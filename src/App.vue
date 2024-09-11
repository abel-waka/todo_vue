<script setup>
import Task from './components/Task.vue';
import Icon from './components/Icon.vue';
import { ref } from 'vue'

const inputValue = ref('')

const tasks = ref([
  {
    id: 1,
    text: "Task 1",
    isDone: false
  },
  {
    id: 2,
    text: "Task 2",
    isDone: true
  },
  {
    id: 3,
    text: "Task 3",
    isDone: false
  }
])

const isEditMode = ref(false)

const draggedItem = ref(null);

const addTask = (e) => {
  e.preventDefault();
  if(inputValue.value !== '') {
    tasks.value.push({
      id: new Date(),
      text: inputValue.value,
      isDone: false
    })
    inputValue.value = ''
  }
}

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(task => task.id !== id)
}

const updateTask = (task) => {orderTasks()
  const index = tasks.value.findIndex(t => t.id === task.id)
  tasks.value[index] = task
  console.log(tasks.value)
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

// Tasks done at the end:
const orderTasks = () => {
  tasks.value.sort((a, b) => {
    if(a.isDone && !b.isDone) {
      return 1
    }
    if(!a.isDone && b.isDone) {
      return -1
    }
    return 0
  })
}

const cleanTasks = () => {
  tasks.value = tasks.value.filter(task => !task.isDone)
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
      <ul v-if="tasks.length > 0">
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
      <button v-if="isEditMode" class="btn_clean" @click="cleanTasks">Limpiar</button>

      <form @submit="addTask">
        <input type="text" v-model="inputValue" />
        <button  @click="addTask">Añadir</button>
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

  .btn_clean {
    position: absolute;
    bottom: 120%;
    background: var(--RED);
    color: white;
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
