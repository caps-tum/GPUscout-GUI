<template>
    <ButtonSecondary class="flex flex-row items-center space-x-2 pl-4" @click="chooseAnalysis">
        <img src="../../../assets/file-solid.svg" class="h-12 w-12" alt="folder" />
        <div class="flex flex-col">
            <p v-if="!selectedFile || !containsSelectedAnalysis" class="text-lg">Choose analysis result file</p>
            <p v-else>Selected Analysis file: {{ selectedFile }}</p>
        </div>
    </ButtonSecondary>
</template>
<script setup>
import { ref } from 'vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';

defineProps({
    containsSelectedAnalysis: Boolean
});

const emit = defineEmits(['analysisSelected']);

const selectedFile = ref('');

async function chooseAnalysis() {
    const result = await window.electronAPI.selectFile([
        {
            name: 'GPUscout result file',
            extensions: ['gscout']
        }
    ]);
    if (!result) {
        return;
    }
    selectedFile.value = result.split('/').at(-1).slice(0, -7);
    const analysisFolder = result.substring(0, result.lastIndexOf('/') + 1);
    emit('analysisSelected', analysisFolder, selectedFile.value, 'FILE');
}
</script>
