<template>
    <div
        class="absolute z-40 flex max-h-[50vh] flex-col space-y-1 overflow-y-auto rounded border border-background bg-primary p-2"
    >
        <KernelListEntry
            v-for="kernel in kernels"
            :key="kernel"
            :kernel="kernel"
            :infos="dataStore.getGPUscoutResult().getKernelInfo(kernel)"
            @select="() => selectKernel(kernel)"
        />
    </div>
</template>
<script setup>
import { useDataStore } from '../../stores/DataStore';
import KernelListEntry from './KernelListEntry.vue';

defineProps({
    kernels: Array
});

const emit = defineEmits(['select']);

const dataStore = useDataStore();

function selectKernel(kernel) {
    emit('select', kernel);
}
</script>
