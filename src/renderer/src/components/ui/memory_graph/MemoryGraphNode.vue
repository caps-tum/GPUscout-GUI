<!--
Component for a node in a memory graph

Author: Tobias Stuckenberger
-->
<template>
    <div v-if="node.spaceAbove"></div>
    <div
        class="grid grid-cols-1 whitespace-pre-line rounded bg-primary px-2 py-1 text-center text-sm text-background"
        :style="{ gridRow: `auto / span ${node.rowSpan}` }"
        :class="getDynStyle()"
    >
        <template v-for="entry of node.content" :key="entry">
            <p class="self-center" :class="getBoldness(entry)" v-html="getTitle(entry)"></p>
        </template>
    </div>
</template>
<script setup>
import { Analysis } from '../../../utils/Analysis';
import { getMetricsData } from '../../../utils/formatters';
import { Node, NodeMetricContent, NodeTextContent } from '../../../utils/MemoryGraphComponents';

const props = defineProps({
    node: Node,
    analysisData: Analysis,
    comparisonAnalysisData: Analysis,
    large: Boolean
});

/**
 * @returns {String} The style classes of the node
 */
function getDynStyle() {
    const large = props.large ? 'min-w-28 !p-2' : 'min-w-20';
    return `grid-rows-${props.node.content.length} ${large}`;
}

/**
 * Return classes to style the font boldness
 * @param {NodeTextContent|NodeMetricContent} entry
 * @returns {String}
 */
function getBoldness(entry) {
    return entry.bold ? 'font-bold first-line:text-base' : '';
}

/**
 * Return the title of the entry
 * @param {NodeTextContent|NodeMetricContent} entry
 * @returns {String}
 */
function getTitle(entry) {
    if (entry instanceof NodeTextContent) {
        if (
            entry.title.includes('{size}') &&
            props.comparisonAnalysisData !== undefined &&
            props.comparisonAnalysisData.hasTopologyMetrics() &&
            props.analysisData.hasTopologyMetrics()
        ) {
            const topString = getTopologyString(entry.title, props.analysisData);
            const compTopString = getTopologyString(entry.title, props.analysisData);
            return entry.title.replace('{size}', `(${topString} vs ${compTopString})`);
        } else if (props.analysisData.hasTopologyMetrics()) {
            const topString = getTopologyString(entry.title, props.analysisData);
            return entry.title.replace('{size}', '(' + topString + ')');
        }
        return entry.title.replace('{size}', '');
    } else if (entry instanceof NodeMetricContent) {
        const metricData = getMetricsData(entry.metric);
        if (props.comparisonAnalysisData !== undefined) {
            const isPositiveChange =
                (props.analysisData.getMetric(entry.metric) <= props.comparisonAnalysisData.getMetric(entry.metric) &&
                    metricData.lower_better) ||
                (props.analysisData.getMetric(entry.metric) >= props.comparisonAnalysisData.getMetric(entry.metric) &&
                    !metricData.lower_better);
            const changeColor = isPositiveChange ? 'text-green-300' : 'text-red-300';
            return entry.comparisonFormat
                .replace(
                    '{value}',
                    `<p class="${changeColor}">` +
                        metricData.format_function(props.analysisData.getMetric(entry.metric)) +
                        '</p>'
                )
                .replace('{comp_value}', metricData.format_function(props.comparisonAnalysisData.getMetric(entry.metric)));
        }
        return entry.format.replace('{value}', metricData.format_function(props.analysisData.getMetric(entry.metric)));
    }
}

/**
 * @param {String} title The title of the metric
 * @param {Object} analysisData The analysis data
 * @returns {String} The relevant topology information for the metric
 */
function getTopologyString(title, analysisData) {
    if (title.includes('L1')) {
        return `${Math.ceil(analysisData.getTopologyMetric('l1_data_cache/size'))}${analysisData.getTopologyMetric('l1_data_cache/size_unit')}`;
    } else if (title.includes('L2')) {
        return `${Math.ceil(analysisData.getTopologyMetric('l2_data_cache/size'))}${analysisData.getTopologyMetric('l2_data_cache/size_unit')}`;
    } else if (title.includes('DRAM')) {
        return `${Math.ceil(analysisData.getTopologyMetric('main_memory/size'))}${analysisData.getTopologyMetric('main_memory/size_unit')}`;
    }
    return '';
}
</script>
