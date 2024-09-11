<script setup>
import Icon from './Icon.vue';

const { task, isEditMode } = defineProps({
    task: Object,
    isEditMode: Boolean
});

const emit = defineEmits(['delete-task', 'update-task'])

const deleteTask = () => {
    emit('delete-task', task.id)
}

const updateTask = () => {
    emit('update-task', task)
}

</script>
<template>
    <div class="task" :class="{ 'task--done': task.isDone }">
        <!-- LEFT -->
        <div class="task__left">
            <input 
                type="checkbox" 
                class="task__checkbox"
                v-model="task.isDone" 
                @change="updateTask"
            />
            
            <RoughNotation :is-show="task.isDone" type="strike-through" color="red">
                <input 
                    type="text" 
                    class="task__input" 
                    v-model="task.text" 
                    :disabled="!isEditMode" 
                    @blur="updateTask"
                />
            </RoughNotation>
        </div>
        <!-- RIGHT -->
        <div class="task__right">
            <button v-if="isEditMode" class="btn-delete" @click="deleteTask">
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
        position: relative;
    }

    .task__left {
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
        border: 1px solid #ccc;
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
        top: 4px;
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
    }

    .btn-edit {
        background: transparent;
    }

    .btn-delete {
        background: transparent;
    }

    .btn-edit:active,
    .btn-delete:active {
        box-shadow: none;
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.2));
    }

</style>