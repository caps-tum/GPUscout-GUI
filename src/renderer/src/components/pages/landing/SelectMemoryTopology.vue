<template>
    <ButtonSecondary
        class="flex flex-row items-center space-x-2 pl-4"
        :class="getButtonBackground()"
        @click="chooseTopology"
    >
        <IconFile class="h-12 w-12" alt="folder" />
        <div class="flex flex-col">
            <p v-if="!selectedFile" class="text-lg">{{ TEXT.landing_page.select_topology.not_selected }}</p>
            <p v-else>{{ TEXT.landing_page.select_topology.selected.replace('{0}', selectedFile) }}</p>
        </div>
    </ButtonSecondary>
</template>
<script setup>
import { ref } from 'vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';
import IconFile from '../../ui/icons/IconFile.vue';
import { TEXT } from '../../../../../config/text';

const emit = defineEmits(['topologySelected']);

const selectedFile = ref('');

/**
 * Open the file picker to choose the topology file
 */
async function chooseTopology() {
    const result = await window.electronAPI.selectFile([
        {
            name: 'mt4g result file',
            extensions: ['csv']
        }
    ]);
    if (!result) {
        return;
    }
    selectedFile.value = result.substring(result.lastIndexOf('/') + 1);
    emit('topologySelected', result);
}

/**
 * Get button background depending on if a file has been selected
 */
function getButtonBackground() {
    return selectedFile.value ? '!bg-primary !text-background' : 'bg-secondary';
}
</script>
