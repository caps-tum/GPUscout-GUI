<template>
    <MetricSection
        :title="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.title"
        :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.hint"
        class="w-full"
    >
        <ButtonMetric
            :value="occurrences.length"
            :data="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total"
            :use-custom-format="true"
        />
        <ButtonMetric
            :value="occurrences.filter((o) => o.type === 'F2F').length"
            :data="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f"
            :use-custom-format="true"
        />
        <ButtonMetric
            :value="occurrences.filter((o) => o.type === 'F2I').length"
            :data="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i"
            :use-custom-format="true"
        />
        <ButtonMetric
            :value="occurrences.filter((o) => o.type === 'I2F').length"
            :data="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f"
            :use-custom-format="true"
        />
    </MetricSection>

    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :help-string="selectedStallHelp"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.general.warp_stall_analysis.help_strings.total_stalls"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent)"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            @click="
                selectedStallHelp =
                    TEXT.analyses.datatype_conversion.top_section.warp_stall_analysis.help_strings.short_scoreboard
            "
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent)"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            @click="
                selectedStallHelp =
                    TEXT.analyses.datatype_conversion.top_section.warp_stall_analysis.help_strings.mio_throttle
            "
        />
        <ButtonMetric
            v-show="selectedConversionType === CONVERSION_TYPE.ALL || selectedConversionType === CONVERSION_TYPE.F2F"
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent)"
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
import ButtonGroup from '../../../ui/buttons/ButtonGroup.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import { useDataStore } from '../../../../stores/DataStore';
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { getMetricsData } from '../../../../utils/formatters';

const CONVERSION_TYPE = {
    ALL: 1,
    F2F: 2,
    I2F: 3,
    F2I: 4
};

const props = defineProps({
    kernel: String
});

const dataStore = useDataStore();

const analysisData = computed(() =>
    dataStore.getGPUscoutResult().getAnalysis(ANALYSIS.datatype_conversion.name, props.kernel)
);
const occurrences = computed(() => analysisData.value.getOccurrences());

const selectedConversionType = ref(CONVERSION_TYPE.ALL);
const selectedStallHelp = ref('');

function onSelectConversionType(type) {
    selectedConversionType.value = type;
}
</script>
