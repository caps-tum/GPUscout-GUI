<template>
    <div class="flex min-w-72 flex-col" :class="getOrderClass()">
        <div class="flex flex-col overflow-auto rounded p-2 pt-1" :class="noBackground ? '' : 'bg-secondary/50'">
            <div class="flex flex-shrink-0 flex-row items-start justify-between space-x-1">
                <p class="pr-2 text-xl text-text">{{ title }}</p>
                <a v-show="!expanded" class="cursor-pointer" @click="emit('expand')">
                    <IconExpand class="mr-1 mt-1 h-4 w-4" />
                </a>
                <a v-show="expanded && title" class="cursor-pointer" @click="emit('expand')">
                    <ButtonHelp class="*:!fill-text" @click="showFullMemoryGraph" />
                </a>
            </div>
            <div v-if="expanded" class="grid flex-grow grid-flow-col" :style="getGridStyle()">
                <template v-for="column of graph.content" :key="column">
                    <template v-for="(entry, row) of column" :key="row">
                        <MemoryGraphNode
                            v-if="entry instanceof Node"
                            :node="entry"
                            :analysis-data="analysisData"
                            :comparison-analysis-data="comparisonAnalysisData"
                            :large="graph.large"
                        />
                        <MemoryGraphArrow
                            v-else-if="entry instanceof Arrow"
                            :arrow="entry"
                            :analysis-data="analysisData"
                            :comparison-analysis-data="comparisonAnalysisData"
                            :large="graph.large"
                        />
                        <div v-else-if="entry instanceof Spacer"></div>
                    </template>
                </template>
            </div>
            <div v-else class="flex max-h-60 flex-grow flex-col gap-y-1 overflow-y-auto">
                <ButtonMetricList
                    v-for="metric in getMetrics()"
                    :key="metric"
                    :metric="metric"
                    :value="analysisData.getMetric(metric)"
                    :comparison-value="comparisonAnalysisData ? comparisonAnalysisData.getMetric(metric) : undefined"
                />
            </div>
        </div>
        <div v-if="expanded" class="flex-grow"></div>
    </div>
    <div v-if="expanded" class="order-2 flex-grow"></div>
</template>
<script setup>
import { computed } from 'vue';
import { Analysis } from '../../../utils/Analysis';
import ButtonMetricList from '../buttons/ButtonMetricList.vue';
import IconExpand from '../icons/IconExpand.vue';
import { Arrow, MemoryGraph, Node, Spacer } from '../../../utils/MemoryGraphComponents';
import MemoryGraphNode from './MemoryGraphNode.vue';
import MemoryGraphArrow from './MemoryGraphArrow.vue';
import ButtonHelp from '../buttons/ButtonHelp.vue';
import { POPUP, useContextStore } from '../../../stores/ContextStore';

const props = defineProps({
    title: String,
    graph: MemoryGraph,
    analysisData: Analysis,
    comparisonAnalysisData: Analysis,
    expanded: Boolean,
    noBackground: Boolean
});

const emit = defineEmits(['expand']);

const contextStore = useContextStore();

const cols = computed(() => Math.floor(props.graph.content.length / 2));
const rows = computed(() => Math.ceil(Math.max(props.graph.rows) / 2));

function showFullMemoryGraph() {
    contextStore.togglePopup(POPUP.MEMORY_GRAPH);
}

/**
 * @returns {String[]} The names of all mentioned metrics
 */
function getMetrics() {
    return props.graph.content
        .flatMap((s) => (s instanceof Node ? s.content : s))
        .filter((s) => s.metric !== undefined)
        .map((x) => x.metric);
}

/**
 * The ordering classes of the Graph, when expanded the graph should be at the first position
 * @returns {String}
 */
function getOrderClass() {
    return props.expanded ? 'order-1' : 'order-3';
}

/**
 * Computes the grid style for the graph to be displayed correctly
 * @returns {Object}
 */
function getGridStyle() {
    let columnTemplate = '';
    for (let i = 0; i < cols.value; i++) {
        columnTemplate += ' min-content';
        if (i < cols.value - 1) {
            columnTemplate += ' max-content';
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
