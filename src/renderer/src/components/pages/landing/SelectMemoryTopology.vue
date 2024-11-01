<template>
    <ButtonSecondary
        class="flex flex-row items-center space-x-2 pl-4"
        :class="getButtonBackground()"
        @click="chooseTopology"
    >
        <img src="../../../assets/file-solid.svg" class="h-12 w-12" alt="folder" />
        <div class="flex flex-col">
            <p v-if="!selectedFile" class="text-lg">Choose memory topology result file</p>
            <p v-else>Selected memory topology file: {{ selectedFile }}</p>
        </div>
    </ButtonSecondary>
</template>
<script setup>
import { ref } from 'vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';

const emit = defineEmits(['topologySelected']);

const selectedFile = ref('');

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

function getButtonBackground() {
    return selectedFile.value ? '!bg-primary !text-background' : 'bg-secondary';
}
</script>
