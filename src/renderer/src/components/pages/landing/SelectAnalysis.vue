<template>
    <ButtonSecondary
        class="flex flex-row items-center space-x-2 pl-4"
        :class="getButtonBackground()"
        @click="chooseAnalysis"
    >
        <IconFile class="h-12 w-12" alt="folder" :class="getButtonBackground()" />
        <div class="flex flex-col">
            <p v-if="!selectedFile" class="text-lg">Choose analysis result file</p>
            <p v-else>Selected Analysis file: {{ selectedFile }}</p>
        </div>
    </ButtonSecondary>
</template>
<script setup>
import { ref } from 'vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';
import IconFile from '../../ui/icons/IconFile.vue';

const emit = defineEmits(['analysisSelected']);
defineExpose({ clear });

const selectedFile = ref('');

/**
 * Open the file picker to choose the analysis file
 */
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
    selectedFile.value = result.substring(result.lastIndexOf('/') + 1);
    emit('analysisSelected', result, true);
}

/**
 * Unselect the selected file
 */
function clear() {
    selectedFile.value = '';
}

/**
 * Get the button background depending on if it has been selected
 */
function getButtonBackground() {
    return selectedFile.value ? '!bg-primary !text-background fill-background' : 'bg-secondary';
}
</script>
