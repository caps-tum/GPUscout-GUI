<!--
Author: Tobias Stuckenberger
-->
<template>
    <div v-if="arrow.spaceAbove"></div>
    <div class="relative grid grid-cols-1 grid-rows-[50%_50%] flex-col" :class="large ? 'min-w-20' : 'min-w-12'">
        <template v-if="!arrow.metricBottom && !large">
            <div
                class="flex flex-col justify-end border-b border-black px-2 pb-1 text-center text-sm text-text"
                :class="getArrowClass()"
                v-html="getTitle(comparisonAnalysisData !== undefined)"
            ></div>
            <div
                class="flex flex-col justify-start border-t border-black px-2 pt-1 text-center text-sm text-text"
                :class="getArrowClass(true)"
                v-html="getTitle(comparisonAnalysisData === undefined)"
            ></div>
        </template>
        <template v-else>
            <div
                class="whitespace-nowrap border-b border-black px-2 pb-1 text-center text-sm text-text"
                :class="getArrowClass()"
                v-html="(comparisonAnalysisData !== undefined ? getTitle(true) + ' vs ' : '') + getTitle(false)"
            ></div>
            <div
                v-if="arrow.metricBottom"
                class="whitespace-nowrap border-t border-black px-2 pt-1 text-center text-sm text-text"
                :class="getArrowClass(true)"
                v-html="(comparisonAnalysisData !== undefined ? getTitle(true, true) + ' vs ' : '') + getTitle(false, true)"
            ></div>
            <div v-else class="border-t border-black px-2 pt-1"></div>
        </template>
    </div>
    <div v-if="arrow.spaceBelow"></div>
</template>
<script setup>
import { Analysis } from '../../../utils/Analysis';
import { getMetricsData } from '../../../utils/formatters';
import { Arrow, DIRECTION } from '../../../utils/MemoryGraphComponents';

const props = defineProps({
    arrow: Arrow,
    analysisData: Analysis,
    comparisonAnalysisData: Analysis,
    large: Boolean
});

/**
 * Generates the text of the arrow
 * @param {boolean} [comparison=false] If the comparison GPUscout result should be used
 * @param {boolean} [useBottomMetric=false] If the bottom metric should be used
 * @returns {String}
 */
function getTitle(comparison = false, useBottomMetric = false) {
    if (comparison && !props.comparisonAnalysisData) return '';
    if (useBottomMetric && !props.arrow.metricBottom) return '';
    const metric = useBottomMetric ? props.arrow.metricBottom : props.arrow.metric;
    const metricsData = getMetricsData(metric);
    if (comparison) {
        return metricsData.format_function(props.comparisonAnalysisData.getMetric(metric));
    } else {
        if (props.comparisonAnalysisData) {
            const isPositiveChange =
                (props.analysisData.getMetric(metric) <= props.comparisonAnalysisData.getMetric(metric) &&
                    metricsData.lower_better) ||
                (props.analysisData.getMetric(metric) >= props.comparisonAnalysisData.getMetric(metric) &&
                    !metricsData.lower_better);
            const changeColor = isPositiveChange ? 'text-green-500' : 'text-red-500';
            return (
                `<a class="${changeColor}"> ` + metricsData.format_function(props.analysisData.getMetric(metric)) + '</a>'
            );
        }
        return metricsData.format_function(props.analysisData.getMetric(metric));
    }
}

/**
 * Generates the styling of the arrow
 * @param {boolean} [second=false] If the function is called from the bottom part of the arrow
 * @returns {String}
 */
function getArrowClass(second = false) {
    if (second) return props.arrow.direction === DIRECTION.BOTH ? 'mt-[3px] arrow-left arrow-left-both border-t-2' : '';
    if (props.arrow.direction === DIRECTION.RIGHT) return 'arrow-right';
    if (props.arrow.direction === DIRECTION.LEFT) return 'arrow-left';
    if (props.arrow.direction === DIRECTION.BIDIRECTIONAL) return 'arrow-right arrow-left';
    if (props.arrow.direction === DIRECTION.BOTH) return 'mb-[3px] arrow-right arrow-right-both border-b-2';
}
</script>
<style scoped>
/*
 * With modifications taken from
 * https://stackoverflow.com/questions/45030914/how-to-put-arrow-between-two-divs-using-html-and-css
 */
.arrow-right:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    border-style: solid;
    border-width: 5px 0 5px 10px;
    border-color: transparent transparent transparent black;
    right: 0;
    transform: translate(1px, -50%);
}

.arrow-left:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    border-style: solid;
    border-width: 5px 10px 5px 0;
    border-color: transparent black transparent transparent;
    left: 0;
    transform: translate(-1px, -50%);
}

.arrow-right-both:before {
    top: calc(50% + 2px) !important;
    transform: translate(1px, calc(-50% + 2px)) !important;
}

.arrow-left-both:after {
    top: calc(50% - 2px) !important;
    transform: translate(-1px, calc(-50% - 2px)) !important;
}
</style>
