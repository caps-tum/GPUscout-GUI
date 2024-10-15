<template>
    <div class="flex h-full w-full items-center justify-center rounded bg-primary text-background">
        <p class="text-lg font-bold">{{ ANALYSIS[currentAnalysis]?.display_name }} Analysis for Kernel</p>
        <select ref="kernelSelector" :value="currentKernel" class="bg-transparent outline-none" @change="changeKernel">
            <option v-for="kernel in kernels" :key="kernel" :value="kernel">{{ kernel }}</option>
        </select>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useDataStore } from '../../stores/DataStore';
import { ANALYSIS } from '../../../../config/analyses';

const dataStore = useDataStore();

const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const currentKernel = computed(() => dataStore.getCurrentKernel);
const kernels = dataStore.getKernels();

const kernelSelector = ref(null);

function changeKernel() {
    dataStore.setCurrentKernel(kernelSelector.value.value);
}
</script>
