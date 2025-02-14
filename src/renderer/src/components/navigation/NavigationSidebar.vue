<!--
Component for the navigation sidebar, which allows changing the current kernel and analysis.
Also displays the availability of analyses in both results if in comparison mode.

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full w-52 flex-col justify-between rounded bg-primary px-1 pb-2 pt-1 text-background">
        <div class="flex flex-col">
            <p class="text-center text-xl font-bold">GPUscout-GUI</p>
            <div class="p-2">
                <p class="font-bold">Current kernel:</p>
                <select
                    :value="currentKernel"
                    class="max-w-44 overflow-hidden text-ellipsis bg-primary outline-none"
                    @change="changeKernel"
                    @mousedown="openKernelSelection"
                >
                    <option v-for="kernel in kernels" :key="kernel" :value="kernel">
                        {{ kernel }}
                    </option>
                </select>
                <div ref="kernelList" class="absolute hidden">
                    <KernelList
                        ref="kernelList"
                        :kernels="kernels.toSorted((a, b) => getAnalysesPerKernel(b) - getAnalysesPerKernel(a))"
                        :kernels-without-metrics="kernelsWithoutMetrics"
                        @select="changeKernel"
                    />
                </div>
            </div>
            <div v-if="isComparison" class="flex flex-col">
                <p v-if="analysesOnlyCurrent.length > 0" class="p-2 font-bold">
                    {{ TEXT.navigation.comparison_titles.only_current }}
                </p>
                <a
                    v-for="analysis in analysesOnlyCurrent"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    :class="getAnalysisStyle(analysis)"
                    @click="() => setAnalysis(analysis)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
                <p v-if="analysesBoth.length > 0" class="p-2 font-bold">{{ TEXT.navigation.comparison_titles.both }}</p>
                <a
                    v-for="analysis in analysesBoth"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    :class="getAnalysisStyle(analysis)"
                    @click="() => setAnalysis(analysis)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
                <p v-if="analysesOnlyOriginal.length > 0" class="p-2 font-bold">
                    {{ TEXT.navigation.comparison_titles.only_original }}
                </p>
                <a
                    v-for="analysis in analysesOnlyOriginal"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    :class="getAnalysisStyle(analysis)"
                    @click="() => setAnalysis(analysis, true)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
            </div>
            <div v-else class="flex flex-col">
                <p v-if="analyses?.length > 0" class="p-2 font-bold">{{ TEXT.navigation.analyses_title }}</p>
                <a
                    v-for="analysis in analyses"
                    :key="analysis"
                    class="cursor-pointer pl-3"
                    :class="getAnalysisStyle(analysis)"
                    @click="() => setAnalysis(analysis)"
                    >{{ ANALYSIS[analysis].display_name || analysis }}</a
                >
            </div>
        </div>
        <div class="flex flex-col">
            <a class="cursor-pointer pl-2" @click="toLanding">Select new result</a>
            <a class="cursor-pointer pl-2" @click="quitApp">Quit</a>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../config/analyses';
import { useDataStore } from '../../stores/DataStore';
import KernelList from './KernelList.vue';
import { useCodeViewerStore } from '../../stores/CodeViewerStore';
import { TEXT } from '../../../../config/text';

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const analyses = computed(() => dataStore.getGPUscoutResult()?.getAnalysesWithOccurrences(currentKernel.value));
const comparisonAnalyses = computed(() =>
    dataStore.getGPUscoutComparisonResult()?.getAnalysesWithOccurrences(currentKernel.value)
);
const kernelsWithoutMetrics = computed(() => dataStore.getGPUscoutResult()?.getKernelsWithoutMetrics() || []);

const isComparison = computed(() => dataStore.hasComparisonResult);
const analysesOnlyOriginal = computed(() => comparisonAnalyses.value.filter((a) => !analyses.value.includes(a)));
const analysesOnlyCurrent = computed(() => analyses.value.filter((a) => !comparisonAnalyses.value.includes(a)));
const analysesBoth = computed(() => analyses.value.filter((a) => comparisonAnalyses.value.includes(a)));

const kernels = dataStore.getKernels();

const kernelList = ref(null);

/**
 * Change the currently selected kernel
 * @param {String} kernel The kernel that the user selected
 */
function changeKernel(kernel) {
    dataStore.setCurrentKernel(kernel);
    kernelList.value.classList.add('hidden');
}

/**
 * Open the kernel selection popup
 */
function openKernelSelection(event) {
    event.preventDefault();
    kernelList.value.classList.toggle('hidden');
}

/**
 * Change the currently selected analysis
 * @param {String} analysis The name of the analysis to select
 * @param {Boolean} [useComparisonCode=false] If the comparison code should be displayed in the code view by default
 */
function setAnalysis(analysis, useComparisonCode = false) {
    codeViewerStore.setUseComparisonCode(useComparisonCode);
    dataStore.setCurrentAnalysis(analysis);
}

/**
 * @param {String} kernel
 * @returns {Number}
 */
function getAnalysesPerKernel(kernel) {
    return dataStore.getGPUscoutResult().getKernelInfo(kernel)[0];
}

/**
 * @param {String} analysis
 * @returns {String} A special style if this analysis entry is currently selected
 */
function getAnalysisStyle(analysis) {
    const hasWarning =
        dataStore
            .getGPUscoutResult()
            .getAnalysis(analysis, currentKernel.value)
            .getOccurrences()
            .filter((o) => o.isWarning).length > 0;
    const noWarningStyle = hasWarning ? '' : 'text-background/50 ';
    return noWarningStyle + (analysis === currentAnalysis.value ? 'font-bold' : '');
}

/**
 * Quit the App
 */
function quitApp() {
    window.close();
}

/**
 * Go back to the landing page
 */
function toLanding() {
    window.location.reload();
}
</script>
