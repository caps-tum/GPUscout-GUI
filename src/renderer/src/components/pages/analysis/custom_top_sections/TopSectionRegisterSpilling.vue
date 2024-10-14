<template>
    <div class="flex w-full flex-row">
        <MetricSection
            :title="TEXT.analyses.register_spilling.top_section.lmem_impact.title"
            :hint="TEXT.analyses.register_spilling.top_section.lmem_impact.hint"
        >
            <ButtonGroup :slots="2">
                <template #button-1>
                    <p>{{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth.title }}</p>
                    <p class="text-sm text-text/50">
                        {{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth.hint }}
                    </p>
                    <p>50/120 (12%)</p>
                </template>
                <template #button-2>
                    <p>{{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction.title }}</p>
                    <p class="text-sm text-text/50">
                        {{ TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction.hint }}
                    </p>
                    <p>50/120 (12%)</p>
                </template>
            </ButtonGroup>
        </MetricSection>
        <div class="flex h-full flex-grow justify-end">
            <ButtonPrimary title="Memory flow details" class="w-fit" @click="openMemoryFlowPopup" />
        </div>
    </div>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
    >
        <ButtonMetric
            :metric="ANALYSIS.register_spilling.metrics.warp_stalls_long_scoreboard_percent"
            :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warp_stalls_long_scoreboard_percent)"
        />
        <ButtonMetric
            :metric="ANALYSIS.register_spilling.metrics.warp_stalls_lg_throttle_percent"
            :value="analysisData.getMetric(ANALYSIS.register_spilling.metrics.warp_stalls_lg_throttle_percent)"
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import ButtonPrimary from '../../../ui/buttons/ButtonPrimary.vue';
import ButtonGroup from '../../../ui/buttons/ButtonGroup.vue';
import { useDataStore } from '../../../../stores/DataStore';
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { POPUP, useContextStore } from '../../../../stores/ContextStore';

const props = defineProps({
    kernel: String
});

const dataStore = useDataStore();
const contextStore = useContextStore();

const analysisData = computed(() =>
    dataStore.getGPUscoutResult().getAnalysis(ANALYSIS.register_spilling.name, props.kernel)
);

const selectedStallHelp = ref('');

function openMemoryFlowPopup() {
    contextStore.togglePopup(POPUP.GLOBAL_LOCAL_MEMORY_FLOW, true);
}
</script>
