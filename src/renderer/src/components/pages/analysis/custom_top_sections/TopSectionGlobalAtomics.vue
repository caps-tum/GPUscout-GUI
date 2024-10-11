<template>
    <div class="flex w-full flex-row">
        <MetricSection
            :title="TEXT.analyses.global_atomics.top_section.atomics_usage.title"
            :hint="TEXT.analyses.global_atomics.top_section.atomics_usage.hint"
        >
            <ButtonMetric
                :value="analysisData.getMetric(ANALYSIS.global_atomics.metrics.atom_global_count)"
                :metric="ANALYSIS.global_atomics.metrics.atom_global_count"
            />
            <ButtonMetric
                :value="analysisData.getMetric(ANALYSIS.global_atomics.metrics.atom_shared_count)"
                :metric="ANALYSIS.global_atomics.metrics.atom_shared_count"
            />
        </MetricSection>
        <div class="flex h-full flex-grow justify-end">
            <ButtonPrimary title="Memory flow details" class="w-fit" @click="openMemoryFlowPopup" />
        </div>
    </div>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :help-string="selectedStallHelp"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warps_active)"
            :metric="ANALYSIS.global_atomics.metrics.warps_active"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warp_stalls_mio_throttle_percent)"
            :metric="ANALYSIS.global_atomics.metrics.warp_stalls_mio_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.global_atomics.top_section.help_strings.mio_throttle"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warp_stalls_long_scoreboard_percent)"
            :metric="ANALYSIS.global_atomics.metrics.warp_stalls_long_scoreboard_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.global_atomics.top_section.help_strings.long_scoreboard"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warp_stalls_lg_throttle_percent)"
            :metric="ANALYSIS.global_atomics.metrics.warp_stalls_lg_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.global_atomics.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.global_atomics.top_section.help_strings.lg_throttle"
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import ButtonPrimary from '../../../ui/buttons/ButtonPrimary.vue';
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

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(ANALYSIS.global_atomics.name, props.kernel));

const selectedStallHelp = ref('');

function openMemoryFlowPopup() {
    contextStore.togglePopup(POPUP.GLOBAL_MEMORY_FLOW, true);
}
</script>
