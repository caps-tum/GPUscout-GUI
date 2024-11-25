<template>
    <Popup distance-x="10vw" distance-y="10vh" :type="POPUP.MEMORY_GRAPH" title="Complete Memory graph">
        <div class="flex w-full justify-center">
            <div class="w-max">
                <MemoryGraph
                    v-if="analysisData"
                    :analysis-data="analysisData"
                    :comparison-analysis-data="comparisonAnalysisData"
                    :graph="MEMORY_GRAPH_DEFINITION.complete"
                    :expanded="true"
                />
            </div>
        </div>
    </Popup>
</template>
<script setup>
import { computed } from 'vue';
import { POPUP } from '../../stores/ContextStore';
import Popup from '../ui/Popup.vue';
import MemoryGraph from '../ui/memory_graph/MemoryGraph.vue';
import { useDataStore } from '../../stores/DataStore';
import { MEMORY_GRAPH_DEFINITION } from '../../../../config/memory_graphs';

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value));
const comparisonAnalysisData = computed(() =>
    dataStore.getGPUscoutComparisonResult()?.getAnalysis(currentAnalysis.value, currentKernel.value)
);
</script>
