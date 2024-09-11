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

const updateTask = (task) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  tasks.value[index] = task
  console.log(tasks.value)
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
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
        <Task 
          v-for="task in tasks" 
          :key="task.id" 
          :task="task" 
          :isEditMode="isEditMode" 
          @delete-task="deleteTask" 
          @update-task="updateTask"
        />
      </ul>
      <h2 v-else>No hay tareas</h2>
    </div>
    <!------------------------------------------------>
    <!-- FOOTER -->
    <footer>
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

  .body ul {
  }

  footer {
    width: 100%;
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
