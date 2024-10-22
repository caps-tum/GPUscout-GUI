<template>
    <div class="flex w-full flex-row space-x-2">
        <MetricSection
            :title="TEXT.analyses.register_spilling.top_section.lmem_impact.title"
            :hint="TEXT.analyses.register_spilling.top_section.lmem_impact.hint"
            class="w-full"
        >
            <ButtonGroup :slots="2" class="w-full">
                <template #button-1>
                    <p>{{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth.title }}</p>
                    <p class="text-sm text-background/75">
                        {{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth.hint }}
                    </p>
                    <p>
                        {{
                            formatNumber(
                                (analysisData.getMetric(ANALYSIS.register_spilling.metrics.total_l2_queries) *
                                    analysisData.getMetric(
                                        ANALYSIS.register_spilling.metrics.l2_queries_due_to_local_memory_percent
                                    )) /
                                    100
                            )
                        }}
                        /
                        {{ formatNumber(analysisData.getMetric(ANALYSIS.register_spilling.metrics.total_l2_queries)) }}
                        ({{
                            formatPercent(
                                analysisData.getMetric(
                                    ANALYSIS.register_spilling.metrics.l2_queries_due_to_local_memory_percent
                                )
                            )
                        }})
                    </p>
                </template>
                <template #button-2>
                    <p>{{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction.title }}</p>
                    <p class="text-sm text-background/75">
                        {{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction.hint }}
                    </p>
                    <p>
                        {{
                            formatNumber(
                                analysisData.getMetric(
                                    ANALYSIS.register_spilling.metrics.instructions_executed_local_loads
                                ) +
                                    analysisData.getMetric(
                                        ANALYSIS.register_spilling.metrics.instructions_executed_local_stores
                                    )
                            )
                        }}
                        /
                        {{ formatNumber(analysisData.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed)) }}
                        ({{
                            formatPercent(
                                (analysisData.getMetric(
                                    ANALYSIS.register_spilling.metrics.instructions_executed_local_loads
                                ) +
                                    analysisData.getMetric(
                                        ANALYSIS.register_spilling.metrics.instructions_executed_local_stores
                                    )) /
                                    analysisData.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed)
                            )
                        }})
                    </p>
                </template>
            </ButtonGroup>
        </MetricSection>
        <div class="flex h-full w-72 flex-grow justify-end">
            <ButtonPrimary title="Global & Local memory flow" class="h-36 w-full" @click="openMemoryFlowPopup">
                <img src="../../../../assets/diagram-project-regular.svg" class="mt-2 h-16 w-16" alt="" />
            </ButtonPrimary>
        </div>
    </div>
    <div class="flex w-full flex-row space-x-2">
        <MetricSection
            :title="TEXT.analyses.general.warp_stall_analysis.title"
            :hint="TEXT.analyses.general.warp_stall_analysis.hint"
            class="w-2/3"
        >
            <ButtonMetric
                :metric="ANALYSIS.register_spilling.metrics.warps_active"
                :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warps_active)"
            />
            <ButtonMetric
                :metric="ANALYSIS.register_spilling.metrics.warp_stalls_long_scoreboard_percent"
                :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warp_stalls_long_scoreboard_percent)"
                :total-stalls="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warps_active)"
            />
            <ButtonMetric
                :metric="ANALYSIS.register_spilling.metrics.warp_stalls_lg_throttle_percent"
                :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warp_stalls_lg_throttle_percent)"
                :total-stalls="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warps_active)"
            />
        </MetricSection>
        <MetricSection :title="TEXT.analyses.general.metrics.title" :hint="TEXT.analyses.general.metrics.hint" class="w-1/3">
            <ButtonMetric
                :metric="ANALYSIS.register_spilling.metrics.occupancy"
                :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.occupancy)"
            />
            <ButtonMetric
                :metric="ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent"
                :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent)"
            />
        </MetricSection>
    </div>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import ButtonPrimary from '../../../ui/buttons/ButtonPrimary.vue';
import ButtonGroup from '../../../ui/buttons/ButtonGroup.vue';
import { ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { POPUP, useContextStore } from '../../../../stores/ContextStore';
import { formatNumber, formatPercent } from '../../../../utils/formatters';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const contextStore = useContextStore();

const selectedStallHelp = ref('');

function openMemoryFlowPopup() {
    contextStore.togglePopup(POPUP.GLOBAL_LOCAL_MEMORY_FLOW, true);
}
</script>
