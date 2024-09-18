<script setup>
import { ref } from 'vue';
import Icon from './Icon.vue';
const props = defineProps({
    title: String,
    type: String,
    task: {
        type: Object,
        required: false
    },
    onConfirm: {
        type: Function,
        required: false
    }
})

const emit = defineEmits(['close', 'update-priority']);

const prioritySelected = ref(props.task?.priority ? props.task.priority : 0);

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
];

const handleConfirm = () => {
    props.onConfirm();
    emit('close');
}

const handleUpdatePriority = (p) => {
    prioritySelected.value = p;
    if(!props.task) return;
    const newTask = {
        ...props.task,
        priority: prioritySelected.value
    }
    emit('update-priority', newTask);
    emit('close');
}
</script>

<template>
    <div class="modal">
        <div class="modal__card">
            <div class="modal__header">
                <button @click="$emit('close')" class="btn__close">
                    <Icon type="cancel"/>
                </button>
            </div>
            <div class="modal__body">
                <h2>{{ title }}</h2>
                
                <div v-if="type === 'priority'" class="modal__priority">
                    <button 
                        v-for="priority in PRIORITIES" 
                        :key="priority.number" 
                        @click="handleUpdatePriority(priority.number)"
                        :class="{ 
                            'p-1': priority.number === 0, 
                            'p-2': priority.number === 1, 
                            'p-3': priority.number === 2,
                        }"
                    >
                        {{ priority.label }}
                    </button>
                </div>
            </div>
            <div v-if="type === 'delete'" class="modal__footer">
                <button @click="handleConfirm" class="btn__confirm">Confirmar</button>
                <button @click="$emit('close')" class="btn__cancel">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<style>
    .modal {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }

    .modal__card {
        background: var(--WHITE);
        padding: 20px;
        border-radius: 4px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 0 10px 0 #22222210;
    }

    .modal__header {
        display: flex;
        justify-content: flex-end;
    }

    .btn__close {
        background: transparent;
    }

    .modal__body {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100px;
    }

    .modal__priority {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        width: 100%;
    }

    .modal__priority button {
        flex: 1;
    }

    .modal__footer {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .btn__confirm {
        flex: 1;
        background: var(--GREEN);
        color: var(--WHITE);
    }

    .btn__cancel {
        flex: 1;
        background: var(--RED);
        color: var(--WHITE);
    }

    .p-1 {
        background: var(--RED);
        color: var(--WHITE);
    }

    .p-2 {
        background: var(--ORANGE);
        color: var(--WHITE);
    }

    .p-3 {
        background: var(--BLACK);
        color: var(--WHITE);
    }
</style>