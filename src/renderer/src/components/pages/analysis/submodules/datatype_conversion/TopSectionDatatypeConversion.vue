<template>
    <MetricSection
        :title="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.title"
        :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.hint"
        class="w-full"
    >
        <ButtonGroup
            class="w-full"
            :slots="4"
            :active-slot="selectedConversionType"
            @slot-activated="onSelectConversionType"
        >
            <template #button-1>
                <p class="text-lg">
                    {{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total.title }}
                </p>
                <p class="-mt-1 opacity-50">
                    {{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total.hint }}
                </p>
                <p class="text-lg">{{ occurrences.length }}</p>
            </template>
            <template #button-2>
                <p class="text-lg">{{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f.title }}</p>
                <p class="-mt-1 opacity-50">
                    {{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f.hint }}
                </p>
                <p class="text-lg">{{ occurrences.filter((o) => o.type === 'F2F').length }}</p>
            </template>
            <template #button-3>
                <p class="text-lg">{{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i.title }}</p>
                <p class="-mt-1 opacity-50">
                    {{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i.hint }}
                </p>
                <p class="text-lg">{{ occurrences.filter((o) => o.type === 'F2I').length }}</p>
            </template>
            <template #button-4>
                <p class="text-lg">{{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f.title }}</p>
                <p class="-mt-1 opacity-50">
                    {{ TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f.hint }}
                </p>
                <p class="text-lg">{{ occurrences.filter((o) => o.type === 'I2F').length }}</p>
            </template>
        </ButtonGroup>
    </MetricSection>

    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warps_active)"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent)"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent)"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
        />
        <ButtonMetric
            v-show="selectedConversionType === CONVERSION_TYPE.ALL || selectedConversionType === CONVERSION_TYPE.F2F"
            :value="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent)"
            :data="getMetricsData(ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent)"
            :total-stalls="analysisData.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)"
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../../ui/sections/MetricSection.vue';
import ButtonGroup from '../../../../ui/buttons/buttongroup/ButtonGroup.vue';
import ButtonMetric from '../../../../ui/buttons/ButtonMetric.vue';
import { useDataStore } from '../../../../../stores/DataStore';
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../../../../config/analyses';
import { TEXT } from '../../../../../../../config/text';
import { getMetricsData } from '../../../../../utils/formatters';

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

function onSelectConversionType(type) {
    selectedConversionType.value = type;
}
</script>
