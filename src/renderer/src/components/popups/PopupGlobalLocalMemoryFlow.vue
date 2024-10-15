<template>
    <Popup :type="POPUP.GLOBAL_LOCAL_MEMORY_FLOW" title="Memory flow details">
        <div class="h-full w-full p-10">
            <MemoryGraph :vertical-nodes="2" :horizontal-nodes="5">
                <MemoryGraphNodeLarge> Kernel </MemoryGraphNodeLarge>
                <MemoryGraphArrows :arrows="2">
                    <template #arrow-1-top>
                        {{
                            formatNumber(analysisData.getMetric(ANALYSIS.register_spilling.metrics.global_loads_count)) +
                            ' Inst.'
                        }}
                    </template>
                    <template #arrow-2-top> TODO Inst. </template>
                </MemoryGraphArrows>
                <MemoryGraphNodesSmall :nodes="2">
                    <template #node-1>Global memory</template>
                    <template #node-2>Local memory</template>
                </MemoryGraphNodesSmall>
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
                    <p class="text-sm font-normal">
                        {{
                            formatPercent(
                                analysisData.getMetric(
                                    ANALYSIS.register_spilling.metrics.global_memory_to_l1_cache_miss_percent
                                )
                            )
                        }}<br />
                        miss rate
                    </p>
                    <p class="my-8">L1 cache</p>
                    <p class="text-sm font-normal">
                        {{
                            formatPercent(
                                analysisData.getMetric(
                                    ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent
                                )
                            )
                        }}<br />
                        miss rate
                    </p>
                </MemoryGraphNodeLarge>
                <MemoryGraphArrows :arrows="2">
                    <template #arrow-1-top>{{
                        formatBytes(analysisData.getMetric(ANALYSIS.register_spilling.metrics.global_memory_l1_to_l2_bytes))
                    }}</template>
                    <template #arrow-2-top>{{
                        formatBytes(analysisData.getMetric(ANALYSIS.register_spilling.metrics.local_memory_l1_to_l2_bytes))
                    }}</template>
                </MemoryGraphArrows>
                <MemoryGraphNodeLarge>
                    <p>L2 cache</p>
                    <p class="mt-4 text-sm font-normal">
                        {{
                            formatPercent(
                                analysisData.getMetric(ANALYSIS.register_spilling.metrics.l1_to_l2_cache_miss_percent)
                            )
                        }}<br />
                        miss rate
                    </p>
                </MemoryGraphNodeLarge>
                <MemoryGraphArrows :arrows="1" :space-top="1">
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
import MemoryGraphNodesSmall from '../ui/memory_graph/MemoryGraphNodesSmall.vue';
import MemoryGraphArrows from '../ui/memory_graph/MemoryGraphArrows.vue';
import { useDataStore } from '../../stores/DataStore';
import { computed } from 'vue';
import { formatBytes, formatNumber, formatPercent } from '../../utils/formatters';
import { ANALYSIS } from '../../../../config/analyses';

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value));
</script>
