<template>
    <div
        class="absolute flex max-h-[50vh] flex-col space-y-1 overflow-y-auto rounded border border-background bg-primary p-2"
        style="z-index: 51"
    >
        <TextInput placeholder="Filter kernels" @changed="onSearchInput" />
        <KernelListEntry
            v-for="kernel in kernels.filter((k) => k.toLowerCase().includes(searchString.toLowerCase()))"
            :key="kernel"
            :kernel="kernel"
            :current-kernel="currentKernel"
            :infos="dataStore.getGPUscoutResult().getKernelInfo(kernel)"
            @select="() => selectKernel(kernel)"
        />
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useDataStore } from '../../stores/DataStore';
import TextInput from '../ui/input/TextInput.vue';
import KernelListEntry from './KernelListEntry.vue';

defineProps({
    kernels: Array
});

const emit = defineEmits(['select']);

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const searchString = ref('');

function onSearchInput(input) {
    searchString.value = input;
}

function selectKernel(kernel) {
    emit('select', kernel);
}
</script>
