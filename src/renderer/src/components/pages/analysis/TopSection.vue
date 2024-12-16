<!--
Component for the top metric section of an analysis.
Displays what is configured in the analysis configuration or a default metric section.

Author: Tobias Stuckenberger
-->
<template>
    <div v-if="ANALYSIS[analysis]?.metrics" class="flex h-full flex-row gap-2">
        <template v-for="(section, index) of ANALYSIS[analysis].metrics" :key="section">
            <MemoryGraph
                v-if="section.type === METRIC_SECTION_TYPE.GRAPH"
                :title="section.title"
                :graph="section.graph"
                :analysis-data="analysisData"
                :comparison-analysis-data="comparisonAnalysisData"
                :expanded="expandedSection === index"
                @expand="expandedSection = index"
            />
            <MetricSection
                v-else-if="section.type === METRIC_SECTION_TYPE.LIST"
                :title="section.title"
                :hint="section.hint"
                :metrics="section.metrics.map((m) => m.name)"
                :values="section.metrics.map((m) => m.value || ((analysis, metric) => analysis.getMetric(metric)))"
                :secondary-values="section.metrics.map((m) => m.secondary_value || (() => 0))"
                :analysis-data="analysisData"
                :comparison-analysis-data="comparisonAnalysisData"
                :expanded="expandedSection === index"
                @expand="expandedSection = index"
            />
        </template>
    </div>
    <div v-else class="flex h-full flex-row gap-2">
        <MetricSection
            :title="TEXT.analyses.general.metrics.title"
            :hint="TEXT.analyses.general.metrics.hint"
            :metrics="Object.keys(analysisData.getOwnMetrics())"
            :values="Array(analysisData.getOwnMetrics().length).fill((analysis, metric) => analysis.getMetric(metric))"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :expanded="true"
        />
    </div>
</template>
<script setup>
import { ANALYSIS, METRIC_SECTION_TYPE } from '../../../../../config/analyses';
import { TEXT } from '../../../../../config/text';
import { useDataStore } from '../../../stores/DataStore';
import { computed, ref } from 'vue';
import MetricSection from '../../ui/sections/MetricSection.vue';
import MemoryGraph from '../../ui/memory_graph/MemoryGraph.vue';

const props = defineProps({
    analysis: String,
    kernel: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(props.analysis, props.kernel));
const comparisonAnalysisData = computed(() =>
    dataStore.getGPUscoutComparisonResult()?.getAnalysis(props.analysis, props.kernel)
);

const expandedSection = ref(1);
</script>
