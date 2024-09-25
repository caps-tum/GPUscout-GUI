<template>
    <ButtonSecondary class="flex flex-row items-center space-x-2 pl-4" @click="chooseAnalysis">
        <img src="../../../assets/file-solid.svg" class="h-12 w-12" alt="folder" />
        <div class="flex flex-col">
            <p v-if="!selectedFile || !containsSelectedAnalysis" class="text-lg">Choose analysis result file</p>
            <p v-else>Selected Analysis file: {{ selectedFile }}</p>
            <p v-if="selectedFile && analysisIsValid && containsSelectedAnalysis" class="text-sm">
                All necessary files have been found
            </p>
            <p v-else-if="selectedFile && !analysisIsValid && containsSelectedAnalysis" class="text-sm">
                Not all necessary files for the analysis have been found
            </p>
        </div>
    </ButtonSecondary>
</template>
<script setup>
import { ref } from 'vue';
import ButtonSecondary from '../../ui/ButtonSecondary.vue';

defineProps({
    containsSelectedAnalysis: Boolean
});

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
    emit('analysisSelected', analysisFolder, selectedFile.value, 'FILE');
}
</script>
