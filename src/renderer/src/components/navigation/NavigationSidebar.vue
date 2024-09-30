<template>
    <div class="flex h-full w-52 flex-col rounded bg-primary px-1 pt-1 text-background">
        <p class="text-center text-xl font-bold">GPUscout-GUI</p>
        <p>Relevant Analyses:</p>
        <a @click="() => setAnalysis(analysis)" class="cursor-pointer" v-for="analysis in analyses" :key="analysis">{{
            analysis
        }}</a>
    </div>
</template>
<script setup>
import { useDataStore } from '../../stores/DataStore';

const dataStore = useDataStore();

const analyses = dataStore.getGPUscoutResult()?.getAnalysesWithOccurrences();

function setAnalysis(analysis) {
    dataStore.setCurrentAnalysis(analysis);
}
</script>
