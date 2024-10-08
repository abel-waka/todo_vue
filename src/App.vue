<script setup>
import Task from './components/Task.vue';
import Icon from './components/Icon.vue';
import Modal from './components/Modal.vue';
import { ref, reactive } from 'vue'
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const inputValue = ref('')

const tasks = ref([]);        // [ { id, text, isDone, priority } ]

const tasksNoFilter = ref([]);

const isEditMode = ref(false)

const draggedItem = ref(null);

const isShowDoneTasks = ref(true);

let modalConfig = reactive({
  isVisible: false,
  title: 'Modal',
  type: 'Delete',
  onConfirm: () => console.log('CONFIRMADA')
});

const fetchTasks = async () => {
  const querySnapshot = await getDocs(collection(db, 'tasks'));
  tasks.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  sortTasks();
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

const openDeleteModal = (id) => {
  modalConfig.isVisible = true
  modalConfig.title = 'Eliminar tarea'
  modalConfig.type = 'delete'
  modalConfig.onConfirm = () => deleteTask(id)
}

const openPriorityModal = (task) => {
  modalConfig.isVisible = true
  modalConfig.title = 'Prioridad'
  modalConfig.type = 'priority'
  modalConfig.task = task
}



const deleteTask = async (id) => {
  await deleteDoc(doc(db, 'tasks', id));
  tasks.value = tasks.value.filter(task => task.id !== id);
  // await fetchTasks();
}

const updateTask = async (task) => {
  await updateDoc(doc(db, 'tasks', task.id), task);
  const index = tasks.value.findIndex(t => t.id === task.id)
  tasks.value[index] = task;
  sortTasks();
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

// 1) isDone | 2) Priority 0 > 1
const sortTasks = () => {
  return tasks.value.sort((a, b) => {
    // Primero, ordenamos por isDone: false (las que no están hechas van primero)
    if (a.isDone !== b.isDone) {
      return a.isDone - b.isDone;
    }
    // Si ambas tareas no están hechas, las ordenamos por prioridad
    if (!a.isDone) {
      return a.priority - b.priority;
    }
    // Si ambas están hechas, las dejamos en el mismo orden relativo
    return 0;
  });
}
	
</script>

<template>
  <main>
    <Modal 
      v-if="modalConfig.isVisible" 
      :type="modalConfig.type"
      :title="modalConfig.title"
      :task="modalConfig.task"
      :onConfirm="modalConfig.onConfirm"
      @close="modalConfig.isVisible = false"
      @update-priority="updateTask"
    />
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
          v-for="task in tasks" 
          :key="task.id" 
        >
          <Task 
            :task="task" 
            :isEditMode="isEditMode" 
            @delete-task="openDeleteModal" 
            @update-task="updateTask"
            @update-priority="openPriorityModal"
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
        <button type="submit">
          <Icon type="arrow-top" color="var(--WHITE)" />
        </button>
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
  }

  .body {
    height: calc(100dvh - var(--HEADER-HEIGHT) - var(--FOOTER-HEIGHT));
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding: 10px 0;
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

  form button {
    background: var(--ACCENT);
    border-radius: 0 10px 10px 0;
    width: 60px;
  }

  footer input {
    flex: 1px;
    padding: 10px;
    font-size: 20px;
    border: 2px solid #22222220;
    border-radius: 10px 0 0 10px;
  }
</style>
