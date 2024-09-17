<template>
    <a
        class="flex h-24 w-full cursor-pointer flex-row items-center space-x-2 rounded bg-red-400 p-2"
        @click="chooseAnalysis"
    >
        <img src="../../assets/folder-open-regular.svg" class="h-20 w-20" alt="folder" />
        <div class="flex flex-col">
            <p v-if="!selectedFile" class="text-lg">Choose analysis result file</p>
            <p v-else-if="!analysisIsValid" class="text-lg">Not all necessary files for the analysis have been found</p>
            <p v-else class="text-lg">Analasis selected and valid: {{ selectedFile }}</p>
        </div>
    </a>
</template>
<script setup>
import { ref } from 'vue';

const emit = defineEmits(['analysisSelected']);

const selectedFile = ref('');
const analysisIsValid = ref(false);

async function chooseAnalysis() {
    const result = await window.electronAPI.selectFile([
        {
            name: 'GPUscout result file',
            extensions: ['json']
        }
    ]);
    selectedFile.value = result.split('/').at(-1).slice(7, -5);
    const analysisFolder = result.substring(0, result.lastIndexOf('/') + 1);
    analysisIsValid.value = await window.electronAPI.checkAnalysis(analysisFolder, selectedFile.value);
    emit('analysisSelected', analysisFolder, selectedFile.value);
}
</script>
