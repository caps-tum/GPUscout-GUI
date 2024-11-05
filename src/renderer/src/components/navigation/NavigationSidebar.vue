<template>
    <div class="flex h-full w-52 flex-col justify-between rounded bg-primary px-1 pb-2 pt-1 text-background">
        <div class="flex flex-col">
            <p class="text-center text-xl font-bold">GPUscout-GUI</p>
            <div class="p-2">
                <p class="font-bold">Current kernel:</p>
                <select
                    ref="kernelSelector"
                    :value="currentKernel"
                    class="bg-transparent outline-none"
                    @change="changeKernel"
                >
                    <option v-for="kernel in kernels" :key="kernel" :value="kernel">{{ kernel }}</option>
                </select>
            </div>
            <div v-if="isComparison" class="flex flex-col">
                <p v-if="analysesOnlyCurrent.length > 0" class="p-2 font-bold">Analyses only in modified result:</p>
                <a
                    v-for="analysis in analysesOnlyCurrent"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    @click="() => setAnalysis(analysis)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
                <p v-if="analysesBoth.length > 0" class="p-2 font-bold">Analyses in both results:</p>
                <a
                    v-for="analysis in analysesBoth"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    @click="() => setAnalysis(analysis)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
                <p v-if="analysesOnlyOriginal.length > 0" class="p-2 font-bold">Analyses only in original result:</p>
                <a
                    v-for="analysis in analysesOnlyOriginal"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    @click="() => setAnalysis(analysis, true)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
            </div>
            <div v-else class="flex flex-col">
                <p class="p-2 font-bold">Relevant Analyses:</p>
                <a
                    v-for="analysis in analyses"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    @click="() => setAnalysis(analysis)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
            </div>
        </div>
        <div class="flex flex-col">
            <a class="cursor-pointer pl-2" @click="toLanding">Select new result</a>
            <a class="cursor-pointer pl-2" @click="quitApp">Quit</a>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../config/analyses';
import { useDataStore } from '../../stores/DataStore';
import { useCodeViewerStore } from '../../stores/CodeViewerStore';

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const analyses = dataStore.getGPUscoutResult()?.getAnalysesWithOccurrences(currentKernel.value);
const comparisonAnalyses = dataStore.getGPUscoutComparisonResult()?.getAnalysesWithOccurrences(currentKernel.value);

const isComparison = computed(() => dataStore.hasComparisonResult);
const analysesOnlyOriginal = computed(() => comparisonAnalyses.filter((a) => !analyses.includes(a)));
const analysesOnlyCurrent = computed(() => analyses.filter((a) => !comparisonAnalyses.includes(a)));
const analysesBoth = computed(() => analyses.filter((a) => comparisonAnalyses.includes(a)));

const kernels = dataStore.getKernels();
const kernelSelector = ref(null);

/**
 * Change the currently selected kernel
 */
function changeKernel() {
    dataStore.setCurrentKernel(kernelSelector.value.value);
}

/**
 * Change the currently selected analysis
 * @param {String} analysis The name of the analysis to select
 * @param {Boolean} [useComparisonCode=false] If the comparison code should be displayed in the code view by default
 */
function setAnalysis(analysis, useComparisonCode = false) {
    codeViewerStore.setUseComparisonCode(useComparisonCode);
    dataStore.setCurrentAnalysis(analysis);
}

// Quit the App
function quitApp() {
    window.close();
}

// Go back to the landing page
function toLanding() {
    window.location.reload();
}
</script>
