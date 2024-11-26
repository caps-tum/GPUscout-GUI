<template>
    <div v-if="arrow.spaceAbove"></div>
    <div class="relative grid min-w-12 grid-cols-1 grid-rows-[50%_50%] flex-col">
        <template v-if="!arrow.metricBottom">
            <div
                class="flex flex-col justify-end border-b border-black px-2 pb-1 text-center text-sm text-text"
                :class="getArrowClass()"
            >
                {{ getTitle(comparisonAnalysisData !== undefined) }}
            </div>
            <div
                class="flex flex-col justify-start border-t border-black px-2 pt-1 text-center text-sm text-text"
                :class="getArrowClass(true)"
            >
                {{ getTitle(comparisonAnalysisData === undefined) }}
            </div>
        </template>
        <template v-else>
            <div
                class="flex flex-col justify-end border-b border-black px-2 pb-1 text-center text-sm text-text"
                :class="getArrowClass()"
            >
                {{ getTitle(false) }} {{ comparisonAnalysisData !== undefined ? 'vs ' + getTitle(true) : '' }}
            </div>
            <div
                class="flex flex-col justify-start border-t border-black px-2 pt-1 text-center text-sm text-text"
                :class="getArrowClass(true)"
            >
                {{ getTitle(false, true) }} {{ comparisonAnalysisData !== undefined ? 'vs ' + getTitle(true, true) : '' }}
            </div>
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
    comparisonAnalysisData: Analysis
});

function getTitle(comparison = false, useBottomMetric = false) {
    if (comparison && !props.comparisonAnalysisData) return '';
    const formatFunction = getMetricsData(useBottomMetric ? props.arrow.metricBottom : props.arrow.metric).format_function;
    if (comparison) {
        return formatFunction(
            props.comparisonAnalysisData.getMetric(useBottomMetric ? props.arrow.metricBottom : props.arrow.metric)
        );
    } else {
        return formatFunction(props.analysisData.getMetric(useBottomMetric ? props.arrow.metricBottom : props.arrow.metric));
    }
}

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
