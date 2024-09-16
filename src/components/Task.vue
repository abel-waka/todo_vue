<script setup>
import { ref } from 'vue';
import Icon from './Icon.vue';

const { task, isEditMode } = defineProps({
    task: Object,
    isEditMode: Boolean
});

const isTooltipOpen = ref(false);
const prioritySelected = ref(task.priority ? task.priority : 0)

const PRIORITIES = [
    {
        number: 0,
        label: 'P.1'
    },
    {
        number: 1,
        label: 'P.2'
    },
    {
        number: 2,
        label: 'P.3'
    }
]

const emit = defineEmits(['delete-task', 'update-task']);

const deleteTask = () => {
    emit('delete-task', task.id);
}

const updateTask = (type) => {
    if (type === 'checkbox') task.isDone = !task.isDone;
    
    if (type === 'priority') task.priority = prioritySelected.value;

    emit('update-task', task);
}

const updatePriority  = (value) => {
    prioritySelected.value = value;
    updateTask('priority');
    console.log('PRIORIRY: ', value)
}

</script>
<template>
    <div class="task" :class="{ 'task--done': task.isDone }">
        <!-- LEFT -->
        <div class="task__left">
            <input 
                type="checkbox" 
                class="task__checkbox"
                :class="{ 'task__checkbox--p1': task.priority === 0, 'task__checkbox--p2': task.priority === 1}"
                @change="updateTask('checkbox')"
                :checked="task.isDone"
            />
            
            <RoughNotation :is-show="task.isDone" type="strike-through" color="red">
                <input 
                    type="text" 
                    class="task__input" 
                    v-model="task.text" 
                    :disabled="!isEditMode" 
                    @blur="updateTask('input')"
                />
            </RoughNotation>
        </div>
        <!-- RIGHT -->
        <div v-if="isEditMode" class="task__right">
            <button class="btn-edit" @click="isTooltipOpen = !isTooltipOpen">
                <Icon type="flag" color="var(--GREEN)"/>
                <div v-if="isTooltipOpen" class="btn__tooltip">
                    <button 
                        v-for="priority in PRIORITIES" 
                        :key="priority.number" 
                        @click="updatePriority(priority.number)"
                        :class="{ 'p-1': priority.number === 0, 'p-2': priority.number === 1, 'p-3': priority.number === 2 }"
                    >
                        {{ priority.label }}
                    </button>
                </div>
            </button>
            <button class="btn-edit" @click="deleteTask">
                <Icon type="delete" color="var(--RED)"/>
            </button>
        </div>
    </div>
</template>

<style>
    .task {
        display: flex;
        gap: 8px;
        box-shadow: 0 0 10px 0 #22222210;
        border-radius: 4px;
        margin-bottom: 10px;
        min-height: 47px;
    }

    .task--done .task__left {
        opacity: 0.2;
    }
    
    .task__left {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        gap: 18px;
        padding-left: 10px;
    }

    .task__checkbox {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 20px;
        height: 20px;
        background-color: transparent;
        border: 2px solid #ccc;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
    }

    .task__checkbox:checked {
        background-color: #222222;
        border-color: black;
    }    
    
    .task__checkbox:checked::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 50%;
        margin: auto;
        position: relative;
        top: 3.7px;
        left: 0.5px;
    }

    .task__checkbox--p1 {
        border-color: var(--RED);
    }

    .task__checkbox--p2 {
        border-color: var(--ORANGE);
    }

    .task__input {
        height: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-size: 20px;
    }

    .task__right {
        display: flex;
        gap: 4px;
    }

    .btn-edit {
        position: relative;
        z-index: 0;
        background: transparent;
        padding: 4px;
    }

    .btn-edit:active {
        box-shadow: none;
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.2));
    }

    .btn__tooltip {
        position: absolute;
        z-index: 10;
        top: 85%;
    }

    .p-1 {
        color: var(--RED);
    }
    .p-2 {
        color: var(--ORANGE);
    }

</style>