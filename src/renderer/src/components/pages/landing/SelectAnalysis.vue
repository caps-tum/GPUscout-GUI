<!--
Component for the analysis select button, which opens a file picker when clicked.

Author: Tobias Stuckenberger
-->
<template>
    <ButtonSecondary
        class="flex flex-row items-center space-x-2 pl-4"
        :class="getButtonBackground()"
        @click="chooseAnalysis"
    >
        <IconFile class="h-12 w-12" alt="folder" :class="getButtonBackground()" />
        <div class="flex flex-col">
            <p v-if="!selectedFile" class="text-lg">{{ TEXT.landing_page.select_file.not_selected }}</p>
            <p v-else>{{ TEXT.landing_page.select_file.selected.replace('{0}', selectedFile) }}</p>
        </div>
    </ButtonSecondary>
</template>
<script setup>
import { ref } from 'vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';
import IconFile from '../../ui/icons/IconFile.vue';
import { TEXT } from '../../../../../config/text';

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
            extensions: ['json']
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
