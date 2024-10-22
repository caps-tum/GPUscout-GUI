<template>
    <div class="flex flex-row justify-between">
        <p v-if="analysisData.getMetric(ANALYSIS.use_texture.metrics.texture_memory_used)" class="text-xl">
            {{ TEXT.analyses.use_texture.top_section.usage.yes }}
        </p>
        <p v-else class="text-xl">
            {{ TEXT.analyses.use_texture.top_section.usage.no }}
        </p>
        <ButtonPrimary title="Memory flow details" class="w-fit" @click="openMemoryFlowPopup" />
    </div>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :help-string="selectedStallHelp"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_texture.metrics.warps_active)"
            :metric="ANALYSIS.use_texture.metrics.warps_active"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_texture.metrics.warp_stalls_long_scoreboard_percent)"
            :metric="ANALYSIS.use_texture.metrics.warp_stalls_long_scoreboard_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.use_texture.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.use_texture.top_section.help_strings.long_scoreboard"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_texture.metrics.warp_stalls_tex_throttle_percent)"
            :metric="ANALYSIS.use_texture.metrics.warp_stalls_tex_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.use_texture.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.use_texture.top_section.help_strings.tex_throttle"
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import ButtonPrimary from '../../../ui/buttons/ButtonPrimary.vue';
import { ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { POPUP, useContextStore } from '../../../../stores/ContextStore';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const contextStore = useContextStore();

const selectedStallHelp = ref('');

function openMemoryFlowPopup() {
    contextStore.togglePopup(POPUP.TEXTURE_MEMORY_FLOW, true);
}
</script>
