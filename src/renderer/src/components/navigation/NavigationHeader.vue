<template>
    <div class="flex h-full w-full items-center justify-center rounded bg-primary text-background">
        <p>{{ currentAnalysis.replace('_', ' ') }} analysis for kernel</p>
        <select v-model="currentKernel" class="bg-transparent outline-none">
            <option v-for="kernel in kernels" :key="kernel" :value="kernel">{{ kernel }}</option>
        </select>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useDataStore } from '../../stores/DataStore';

const dataStore = useDataStore();

const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const currentKernel = computed(() => dataStore.getCurrentKernel);
const kernels = dataStore.getKernels();
</script>
