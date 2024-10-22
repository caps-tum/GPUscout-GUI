<template>
    <MetricSection
        :title="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.title"
        :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.hint"
    >
        <ButtonMetric
            :value="occurrences.length"
            :metric="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total.title"
            :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total.hint"
        />
        <ButtonMetric
            :value="occurrences.filter((o) => o.type === 'F2F').length"
            :metric="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f.title"
            :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f.hint"
        />
        <ButtonMetric
            :value="occurrences.filter((o) => o.type === 'F2I').length"
            :metric="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i.title"
            :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i.hint"
        />
        <ButtonMetric
            :value="occurrences.filter((o) => o.type === 'I2F').length"
            :metric="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f.title"
            :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f.hint"
        />
    </MetricSection>

    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :help-string="selectedStallHelp"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            :metric="ANALYSIS.datatype_conversion.metrics.warps_active"
            @click="selectedStallHelp = TEXT.analyses.general.warp_stall_analysis.help_strings.total_stalls"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent)"
            :metric="ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            @click="
                selectedStallHelp =
                    TEXT.analyses.datatype_conversion.top_section.warp_stall_analysis.help_strings.short_scoreboard
            "
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent)"
            :metric="ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            @click="
                selectedStallHelp =
                    TEXT.analyses.datatype_conversion.top_section.warp_stall_analysis.help_strings.mio_throttle
            "
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent)"
            :metric="ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            @click="
                selectedStallHelp =
                    TEXT.analyses.datatype_conversion.top_section.warp_stall_analysis.help_strings.tex_throttle
            "
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';

const props = defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const occurrences = computed(() => props.analysisData.value?.getOccurrences() || []);

const selectedStallHelp = ref('');
</script>
