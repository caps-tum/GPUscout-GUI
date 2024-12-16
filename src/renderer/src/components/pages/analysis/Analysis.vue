<!--
Component for the main analysis view, which contains the metrics at the top, and the code view and info in the lower half of the screen.
Also handles buttons like selecting prev/next occurrences or switching code versions.

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full w-full flex-col space-y-1">
        <div class="flex flex-row justify-between">
            <div class="-mt-2 flex flex-col">
                <div class="flex flex-row">
                    <p v-if="!hasComparisonResult" class="text-xl text-text">{{ TEXT.top_section.title }}</p>
                    <p v-else class="text-xl text-text">{{ TEXT.top_section.title_comparison }}</p>
                    <ToggleSwitch
                        class="ml-2 mr-1 mt-2"
                        :checked="!showMetrics"
                        @changed="
                            () => {
                                showMetrics = !showMetrics;
                            }
                        "
                    />
                    <p class="mt-1 text-text">Hide</p>
                </div>
                <p class="!-mb-1 !-mt-1 text-sm text-text/50">
                    {{ TEXT.top_section.hint }}
                </p>
            </div>
            <ButtonPrimary class="!px-4 !py-0" @click="openLargeMemoryGraph">View Complete Memory Graph</ButtonPrimary>
        </div>
        <div v-show="showMetrics" class="max-h-[calc(min(18rem,30vh))]">
            <TopSection :analysis="currentAnalysis" :kernel="currentKernel" />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row">
                <p class="mr-4 text-xl text-text">{{ TEXT.code_view.title }}</p>
                <div v-if="hasComparisonResult" class="flex flex-row items-end space-x-1">
                    <p class="text-text">{{ TEXT.code_view.toggle.old }}</p>
                    <ToggleSwitch class="mb-1" :checked="!useComparisonCode" @changed="toggleCodeVersions" />
                    <p class="text-text">{{ TEXT.code_view.toggle.new }}</p>
                </div>
            </div>
            <p class="!-mb-1 !-mt-1 text-sm text-text/50">{{ TEXT.code_view.hint }}</p>
        </div>
        <div class="grid flex-grow grid-cols-[75%_24.5%] grid-rows-1 gap-2 overflow-x-hidden">
            <CodeViewer />
            <div class="flex h-full w-full flex-col space-y-2 rounded">
                <div class="w-full flex-grow overflow-x-hidden rounded bg-secondary/50">
                    <CodeInfo
                        :analysis="currentAnalysis"
                        :kernel="currentKernel"
                        :occurrences="selectedOccurrences"
                        :stalls="lineStalls"
                    />
                </div>
                <div class="flex w-full flex-row space-x-2">
                    <ButtonSecondary
                        class="!w-full text-center !text-base"
                        title="Select previous occurrence"
                        @click="selectPreviousOccurrence"
                    />
                    <ButtonSecondary
                        class="!w-full text-center !text-base"
                        title="Select next occurrence"
                        @click="selectNextOccurrence"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import CodeViewer from '../../code_viewer/CodeViewer.vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';
import CodeInfo from './code_info/CodeInfo.vue';
import TopSection from './TopSection.vue';
import { useDataStore } from '../../../stores/DataStore';
import { computed, ref } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import ToggleSwitch from '../../ui/input/ToggleSwitch.vue';
import { TEXT } from '../../../../../config/text';
import ButtonPrimary from '../../ui/buttons/ButtonPrimary.vue';
import { POPUP, useContextStore } from '../../../stores/ContextStore';

const dataStore = useDataStore();
const contextStore = useContextStore();
const codeViewerStore = useCodeViewerStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const binaryView = computed(() => codeViewerStore.getCurrentBinary);
const currentView = computed(() => codeViewerStore.getCurrentView);

const hasComparisonResult = computed(() => dataStore.hasComparisonResult);
const useComparisonCode = computed(() => codeViewerStore.displayComparisonCode);
const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
const showMetrics = ref(hasComparisonResult.value);
const occurrences = computed(() =>
    useComparisonCode.value
        ? dataStore.getGPUscoutComparisonResult().getAnalysis(currentAnalysis.value, currentKernel.value).getOccurrences()
        : dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value).getOccurrences()
);
const lineStalls = computed(() =>
    useComparisonCode.value
        ? dataStore.getGPUscoutComparisonResult().getLineStalls(currentKernel.value, selectedLine.value, currentView.value)
        : dataStore.getGPUscoutResult().getLineStalls(currentKernel.value, selectedLine.value, currentView.value)
);

/**
 * Opens the large memory graph available from every analysis
 */
function openLargeMemoryGraph() {
    contextStore.togglePopup(POPUP.MEMORY_GRAPH, true);
}

/**
 * Toggles between the two GPUscout results, if available
 */
function toggleCodeVersions() {
    codeViewerStore.setUseComparisonCode(!useComparisonCode.value);
}

/**
 * Selects the previous occurrence, if any exists
 */
function selectPreviousOccurrence() {
    let currentIndex = -1;
    const occs = occurrences.value.toSorted((a, b) => a.binaryLineNumber - b.binaryLineNumber);
    if (currentView.value !== CODE_TYPE.SOURCE_CODE) {
        currentIndex = occs.findLastIndex((o) => o.binaryLineNumber < selectedLine.value);
    } else if (selectedOccurrences.value.length > 0) {
        const minBinaryLine = selectedOccurrences.value
            .map((so) => so.binaryLineNumber)
            .reduce((min, curr) => (curr < min ? curr : min));
        currentIndex = occs.findLastIndex((o) => o.binaryLineNumber < minBinaryLine);
    } else {
        const binaryLine = occs
            .filter((oc) => oc.sourceLineNumber < selectedLine.value)
            .map((oc) => oc.binaryLineNumber)
            .reduce((min, curr) => (curr < min ? min : curr), 0);
        currentIndex = occs.findIndex((o) => o.binaryLineNumber === binaryLine);
    }

    if (currentIndex >= 0) {
        codeViewerStore.setCurrentView(binaryView.value);
        codeViewerStore.setSelectedLine(occs[currentIndex].binaryLineNumber, true);
    }
}

/**
 * Selects the next occurrence, if any exists
 */
function selectNextOccurrence() {
    let currentIndex = -1;
    const occs = occurrences.value.toSorted((a, b) => a.binaryLineNumber - b.binaryLineNumber);
    if (currentView.value !== CODE_TYPE.SOURCE_CODE) {
        currentIndex = occs.findIndex((o) => o.binaryLineNumber > selectedLine.value);
    } else if (selectedOccurrences.value.length > 0) {
        const maxBinaryLine = selectedOccurrences.value
            .map((so) => so.binaryLineNumber)
            .reduce((max, curr) => (curr > max ? curr : max));
        currentIndex = occs.findIndex((o) => o.binaryLineNumber > maxBinaryLine);
    } else {
        const binaryLine = occs
            .filter((oc) => oc.sourceLineNumber > selectedLine.value)
            .map((oc) => oc.binaryLineNumber)
            .reduce((max, curr) => (curr > max ? max : curr), 99999);
        currentIndex = occs.findIndex((o) => o.binaryLineNumber === binaryLine);
    }

    if (currentIndex >= 0) {
        codeViewerStore.setCurrentView(binaryView.value);
        codeViewerStore.setSelectedLine(occs[currentIndex].binaryLineNumber, true);
    }
}
</script>
