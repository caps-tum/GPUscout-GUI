<template>
    <div class="flex min-w-72 flex-col rounded bg-secondary/50 p-2">
        <div class="flex flex-shrink-0 flex-row justify-between">
            <div class="flex flex-row">
                <p class="pr-2 text-lg">{{ title }}</p>
                <ButtonHelp v-if="expanded" class="text-text *:h-5 *:w-5" />
            </div>
            <a v-show="!expanded" class="cursor-pointer" @click="emit('expand')">Expand</a>
        </div>
        <div v-if="expanded" class="grid flex-grow grid-flow-col" :style="getGridStyle()">
            <template v-for="(section, index) of sections" :key="index">
                <MemoryGraphNodeLarge
                    v-if="index % 2 === 0 && section[0]['size'] !== 'small'"
                    :titles="buildTitles(section, true)"
                />
                <MemoryGraphNodesSmall v-else-if="index % 2 === 0" :titles="buildTitles(section)" />
                <MemoryGraphArrows
                    v-else
                    :labels="buildTitles(section)"
                    :comparison-labels="buildTitles(section, true)"
                    :rows="rows"
                />
            </template>
        </div>
        <div v-else class="flex flex-grow flex-col gap-y-1 overflow-y-auto">
            <ButtonMetricList
                v-for="metric in getMetrics()"
                :key="metric"
                :metric="metric"
                :value="analysisData.getMetric(metric)"
                :comparison-value="comparisonAnalysisData ? comparisonAnalysisData.getMetric(metric) : undefined"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { Analysis } from '../../../utils/Analysis';
import { getMetricsData } from '../../../utils/formatters';
import ButtonHelp from '../buttons/ButtonHelp.vue';
import MemoryGraphArrows from './MemoryGraphArrows.vue';
import MemoryGraphNodeLarge from './MemoryGraphNodeLarge.vue';
import ButtonMetricList from '../buttons/ButtonMetricList.vue';
import MemoryGraphNodesSmall from './MemoryGraphNodesSmall.vue';

const props = defineProps({
    title: String,
    sections: Array,
    analysisData: Analysis,
    comparisonAnalysisData: Analysis,
    expanded: Boolean
});

const emit = defineEmits(['expand']);

const cols = computed(() => Math.floor(props.sections.length / 2));
const rows = computed(() => Math.ceil(Math.max(...props.sections.map((e) => e.length)) / 2));

function buildTitles(components, useComparison = false) {
    useComparison = useComparison && props.comparisonAnalysisData !== undefined;
    const analysisData = useComparison ? props.comparisonAnalysisData : props.analysisData;
    const result = [];

    for (const entry of components) {
        if (entry.title) {
            result.push(entry.bold ? '*' + entry.title : entry.title);
        } else {
            let metricValue = getMetricsData(entry.metric).format_function(
                entry.value || analysisData.getMetric(entry.metric)
            );
            if (entry.format) {
                if (useComparison) {
                    const originalMetricValue = getMetricsData(entry.metric).format_function(
                        entry.value || props.analysisData.getMetric(entry.metric)
                    );
                    metricValue = entry.comparison_format.replace('{0}', originalMetricValue).replace('{1}', metricValue);
                } else {
                    metricValue = entry.format.replace('{0}', metricValue);
                }
            }
            result.push(metricValue);
        }
    }
    return result;
}

function getMetrics() {
    return props.sections.flatMap((s) => s.filter((x) => x.metric !== undefined).map((x) => x.metric));
}

function getGridStyle() {
    let columnTemplate = '';
    for (let i = 0; i < cols.value; i++) {
        columnTemplate += ' min-content';
        if (i < cols.value - 1) {
            columnTemplate += ' auto';
        }
    }

    let rowTemplate = '';
    for (let i = 0; i < rows.value * 2 - 1; i++) {
        if (i === rows.value * 2 - 2) {
            rowTemplate += ' 1fr [last-line]';
        } else if (i % 2 !== 0) {
            rowTemplate += ' 0.5fr';
        } else {
            rowTemplate += ' 1fr';
        }
    }

    return {
        'grid-template-columns': columnTemplate.trim(),
        'grid-template-rows': rowTemplate.trim()
    };
}
</script>
