<template>
    <div class="flex h-full w-52 flex-col justify-between rounded bg-primary px-1 pb-2 pt-1 text-background">
        <div class="flex flex-col">
            <p class="text-center text-xl font-bold">GPUscout-GUI</p>
            <p class="p-2 font-bold">Relevant Analyses:</p>
            <a
                v-for="analysis in analyses"
                :key="analysis"
                class="cursor-pointer pl-3"
                @click="() => setAnalysis(analysis)"
                >{{ ANALYSIS[analysis].display_name || analysis }}</a
            >
        </div>
        <div class="flex flex-col">
            <a class="cursor-pointer pl-2" @click="quitApp">Quit</a>
        </div>
    </div>
</template>
<script setup>
import { ANALYSIS } from '../../../../config/analyses';
import { useDataStore } from '../../stores/DataStore';

const dataStore = useDataStore();

const analyses = dataStore.getGPUscoutResult()?.getAnalysesWithOccurrences();

function setAnalysis(analysis) {
    dataStore.setCurrentAnalysis(analysis);
}

function quitApp() {
    window.close();
}
</script>
