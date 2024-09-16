<script setup>
import Task from './components/Task.vue';
import Icon from './components/Icon.vue';
import { ref } from 'vue'
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const inputValue = ref('')

const tasks = ref([]);        // [ { id, text, isDone } ]

const tasksNoFilter = ref([]);

const isEditMode = ref(false)

const draggedItem = ref(null);

const isShowDoneTasks = ref(true);

const fetchTasks = async () => {
  const querySnapshot = await getDocs(collection(db, 'tasks'));
  tasks.value = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      // Order isDone last:
      .sort((a, b) => {
      if(a.isDone && !b.isDone) {
          return 1
        }
        if(!a.isDone && b.isDone) {
          return -1
        }
        return 0
      })
  tasksNoFilter.value = tasks.value;
}

// __INIT
fetchTasks();

const addTask = async (e) => {
  if(inputValue.value !== '') {
    const newTask = {
      text: inputValue.value,
      isDone: false
    }
    await addDoc(collection(db, 'tasks'), newTask);
    
    inputValue.value = '';
    await fetchTasks();
  }
}

const deleteTask = async (id) => {
  await deleteDoc(doc(db, 'tasks', id));
  tasks.value = tasks.value.filter(task => task.id !== id);
  // await fetchTasks();
}

const updateTask = async (task) => {
  console.log('_____________',task)
  await updateDoc(doc(db, 'tasks', task.id), task);
  const index = tasks.value.findIndex(t => t.id === task.id)
  tasks.value[index] = task;
  // await fetchTasks();
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const toggleShowDoneTasks = () => {
  isShowDoneTasks.value = !isShowDoneTasks.value;
  if (isShowDoneTasks.value) {
    tasks.value = tasksNoFilter.value;
    // fetchTasks();
  } else {
    tasks.value = tasks.value.filter(task => !task.isDone)
  }
}

const deleteDoneTasks = async () => {
  // await fetchTasks();
  const doneTasks = tasksNoFilter.value.filter(task => task.isDone);
  doneTasks.forEach(async (task) => {
    await deleteDoc(doc(db, 'tasks', task.id));
  });
  isShowDoneTasks.value = true;

  // TODO: Eliminar tareas sin llamada?:
  await fetchTasks();
}


// DRAG
const handleDragStart = (index) => {
  draggedItem.value = index
}

const handleDragOver = (event) => {
  event.preventDefault();
}

const handleDrop = (index) => {
  const droppedItem = tasks.value.splice(draggedItem.value, 1)[0]
  tasks.value.splice(index, 0 , droppedItem)
  draggedItem.value = null
}
	
</script>

<template>
  <main>
    <!------------------------------------------------>
    <!-- HEADER -->
    <header>
      <h1>Tareas</h1>
      <button @click="toggleEditMode">
        <Icon v-if="isEditMode" type="cancel"/>
        <Icon v-else type="edit"/>
      </button>
    </header>
    
    <!------------------------------------------------>
    <!-- BODY -->
    <div class="body">
      <ul v-if="tasks?.length > 0">
        <li
          v-for="(task, index) in tasks" 
          :key="task.id" 
          :draggable="true"
          @dragstart="handleDragStart(index)"
          @dragover="handleDragOver"
          @drop="handleDrop(index)"
          :class="{ 'dragged': index === draggedItem }"
        >
          <Task 
            :task="task" 
            :isEditMode="isEditMode" 
            @delete-task="deleteTask" 
            @update-task="updateTask"

          />

        </li>
      </ul>
      <h2 v-else>No hay tareas</h2>
    </div>
    <!------------------------------------------------>
    <!-- FOOTER -->
    <footer>
      <div class="buttons_done">
        <button v-if="isEditMode" class="btn_hidde_done" @click="toggleShowDoneTasks">
          <Icon v-if="!isShowDoneTasks" type="eye" color="white"/>
          <Icon v-else type="no-eye" color="white"/>
          <span>Completadas</span>
        </button>
        <button v-if="isEditMode" class="btn_delete_done" @click="deleteDoneTasks">
          <Icon type="delete" color="white"/>
          <span>Completadas</span>
        </button>
      </div>

      <form @submit.prevent="addTask">
        <input type="text" v-model="inputValue" />
        <button type="submit">Añadir</button>
      </form>
    </footer>
  </main>
</template>

<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100dvh;
    padding: 10px;
    max-width: 400px;
    margin: 0 auto;
  }

  h1 {
    opacity: 0.6;
  }

  h2 {
    opacity: 0.4;
    font-weight: 400;
    text-align: center;
    font-size: 24px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--HEADER-HEIGHT);
    width: 100%;
  }  

  header button {
    background: transparent;
    border: 1px solid #222222;
    padding: 6px 8px;
    border-radius: 50%;
    opacity: 0.6;
    scale: 0.8;
  }

  .body {
    height: calc(100dvh - var(--HEADER-HEIGHT) - var(--FOOTER-HEIGHT));
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding: 10px 0;
  }

  .dragged {
    background-color: #22222240;
  }

  footer {
    position: relative;
    width: 100%;
  }

  .buttons_done {
    position: absolute;
    bottom: 100%;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background: var(--WHITE);
    padding-bottom: 10px;
  }
  .btn_hidde_done,
  .btn_delete_done {
    background: var(--RED);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  
  footer form {
    height: var(--HEADER-HEIGHT);
    display: flex;
  }

  footer input {
    flex: 1px;
    padding: 10px;
    font-size: 20px;
    border: 1px solid #22222220;
  }
</style>
