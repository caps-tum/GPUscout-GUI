<template>
    <div
        class="absolute z-40 flex max-h-[50vh] flex-col space-y-1 overflow-y-auto rounded border border-background bg-primary p-2"
    >
        <TextInput placeholder="Filter kernels" @changed="onSearchInput" />
        <KernelListEntry
            v-for="kernel in kernels.filter((k) => k.toLowerCase().includes(searchString.toLowerCase()))"
            :key="kernel"
            :kernel="kernel"
            :infos="dataStore.getGPUscoutResult().getKernelInfo(kernel)"
            @select="() => selectKernel(kernel)"
        />
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useDataStore } from '../../stores/DataStore';
import TextInput from '../ui/input/TextInput.vue';
import KernelListEntry from './KernelListEntry.vue';

defineProps({
    kernels: Array
});

const emit = defineEmits(['select']);

const dataStore = useDataStore();
const searchString = ref('');

function onSearchInput(input) {
    searchString.value = input;
}

function selectKernel(kernel) {
    emit('select', kernel);
}
</script>
