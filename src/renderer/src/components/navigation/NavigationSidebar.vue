<template>
    <div class="flex h-full w-52 flex-col justify-between rounded bg-primary px-1 pb-2 pt-1 text-background">
        <div class="flex flex-col">
            <p class="text-center text-xl font-bold">GPUscout-GUI</p>
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
                    @click="() => setAnalysis(analysis)"
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
import { computed } from 'vue';
import { ANALYSIS } from '../../../../config/analyses';
import { useDataStore } from '../../stores/DataStore';

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const analyses = dataStore.getGPUscoutResult()?.getAnalysesWithOccurrences(currentKernel.value);
const comparisonAnalyses = dataStore.getGPUscoutComparisonResult()?.getAnalysesWithOccurrences(currentKernel.value);

const isComparison = computed(() => dataStore.hasComparisonResult);
const analysesOnlyOriginal = computed(() => comparisonAnalyses.filter((a) => !analyses.includes(a)));
const analysesOnlyCurrent = computed(() => analyses.filter((a) => !comparisonAnalyses.includes(a)));
const analysesBoth = computed(() => analyses.filter((a) => comparisonAnalyses.includes(a)));

function setAnalysis(analysis) {
    dataStore.setCurrentAnalysis(analysis);
}

function quitApp() {
    window.close();
}

function toLanding() {
    window.location.reload();
}
</script>
