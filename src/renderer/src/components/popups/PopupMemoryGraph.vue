<!--
Component for the popup of the main memory graph.

Author: Tobias Stuckenberger
-->
<template>
    <Popup distance-x="10vw" distance-y="10vh" :type="POPUP.MEMORY_GRAPH" title="Complete Memory graph">
        <div class="space-2 flex w-full flex-col justify-center p-2">
            <div class="w-max self-center">
                <MemoryGraph
                    v-if="analysisData"
                    :analysis-data="analysisData"
                    :comparison-analysis-data="comparisonAnalysisData"
                    :graph="MEMORY_GRAPH_DEFINITION.complete"
                    :expanded="true"
                    :no-background="true"
                />
            </div>
            <div>{{ TEXT.complete_memory_graph.help_text }}</div>
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
import { TEXT } from '../../../../config/text';

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis('use_restrict', currentKernel.value));
const comparisonAnalysisData = computed(() =>
    dataStore.getGPUscoutComparisonResult()?.getAnalysis('use_restrict', currentKernel.value)
);
</script>
