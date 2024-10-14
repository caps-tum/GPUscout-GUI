<template>
    <Popup :type="POPUP.GLOBAL_LOCAL_MEMORY_FLOW" title="Memory flow details">
        <div class="h-full w-full p-10">
            <MemoryGraph :vertical-nodes="2" :horizontal-nodes="4">
                <MemoryGraphNodeLarge> Kernel </MemoryGraphNodeLarge>
                <MemoryGraphArrows :arrows="2">
                    <template #arrow-1-top>
                        {{
                            formatBytes(analysisData.getMetric(ANALYSIS.register_spilling.metrics.global_memory_to_l1_bytes))
                        }}
                    </template>
                    <template #arrow-2-top>
                        {{
                            formatBytes(analysisData.getMetric(ANALYSIS.register_spilling.metrics.local_memory_to_l1_bytes))
                        }}
                    </template>
                </MemoryGraphArrows>
                <MemoryGraphNodeLarge>
                    {{
                        formatPercent(
                            analysisData.getMetric(ANALYSIS.register_spilling.metrics.global_memory_to_l1_cache_miss_percent)
                        )
                    }}
                    miss rate L1 cache
                    {{
                        formatPercent(
                            analysisData.getMetric(ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent)
                        )
                    }}
                    miss rate
                </MemoryGraphNodeLarge>
                <MemoryGraphArrows :arrows="1">
                    <template #arrow-1-top>{{
                        formatBytes(analysisData.getMetric(ANALYSIS.register_spilling.metrics.global_memory_l1_to_l2_bytes))
                    }}</template>
                    <template #arrow-2-top>{{
                        formatBytes(analysisData.getMetric(ANALYSIS.register_spilling.metrics.local_memory_l1_to_l2_bytes))
                    }}</template>
                </MemoryGraphArrows>
                <MemoryGraphNodeLarge>
                    L2 cache
                    {{
                        formatPercent(analysisData.getMetric(ANALYSIS.register_spilling.metrics.l1_to_l2_cache_miss_percent))
                    }}
                    miss rate
                </MemoryGraphNodeLarge>
                <MemoryGraphArrows :arrows="1">
                    <template #arrow-1-top>{{
                        formatBytes(analysisData.getMetric(ANALYSIS.global_atomics.metrics.l2_to_dram_bytes))
                    }}</template>
                </MemoryGraphArrows>
                <MemoryGraphNodeLarge>DRAM</MemoryGraphNodeLarge>
            </MemoryGraph>
        </div>
    </Popup>
</template>
<script setup>
import { POPUP } from '../../stores/ContextStore';
import Popup from '../ui/Popup.vue';
import MemoryGraph from '../ui/memory_graph/MemoryGraph.vue';
import MemoryGraphNodeLarge from '../ui/memory_graph/MemoryGraphNodeLarge.vue';
import MemoryGraphArrows from '../ui/memory_graph/MemoryGraphArrows.vue';
import { useDataStore } from '../../stores/DataStore';
import { computed } from 'vue';
import { formatBytes, formatPercent } from '../../utils/formatters';
import { ANALYSIS } from '../../../../config/analyses';

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value));
</script>
