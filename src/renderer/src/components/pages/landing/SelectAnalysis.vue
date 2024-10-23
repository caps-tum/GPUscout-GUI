<template>
    <ButtonSecondary class="flex flex-row items-center space-x-2 pl-4" @click="chooseAnalysis">
        <img src="../../../assets/file-solid.svg" class="h-12 w-12" alt="folder" />
        <div class="flex flex-col">
            <p v-if="!selectedFile" class="text-lg">Choose analysis result file</p>
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
    emit('analysisSelected', result);
}
</script>
