<template>
    <div class="flex h-full w-full flex-col space-y-2">
        <div class="shrink-0">
            <TopSection :analysis="currentAnalysis" :kernel="currentKernel" />
        </div>
        <p class="text-xl text-text">Code View</p>
        <p class="!-mb-1 !-mt-1 text-sm text-text/50">Here you can see the code</p>
        <div class="grid flex-grow grid-cols-[75%_24.5%] grid-rows-1 gap-2 overflow-x-hidden">
            <CodeViewer />
            <div class="flex h-full w-full flex-col rounded bg-secondary/50">
                <div class="w-full flex-grow overflow-x-hidden">
                    <CodeInfo
                        :analysis="currentAnalysis"
                        :kernel="currentKernel"
                        :occurrences="selectedOccurrences"
                        :stalls="lineStalls"
                    />
                </div>
                <div class="flex w-full flex-row justify-around space-x-2">
                    <ButtonSecondary
                        class="text-center !text-base"
                        title="Select previous occurrence"
                        @click="selectPreviousOccurrence"
                    />
                    <ButtonSecondary
                        class="text-center !text-base"
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
import CodeInfo from './CodeInfo.vue';
import TopSection from './TopSection.vue';
import { useDataStore } from '../../../stores/DataStore';
import { computed } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const binaryView = computed(() => codeViewerStore.getCurrentBinary);
const currentView = computed(() => codeViewerStore.getCurrentView);

const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
const occurrences = computed(() =>
    dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value).getOccurrences()
);
const lineStalls = computed(() =>
    dataStore.getGPUscoutResult().getLineStalls(currentKernel.value, selectedLine.value, currentView.value)
);

function selectPreviousOccurrence() {
    let currentIndex = -1;
    if (currentView.value !== CODE_TYPE.SOURCE_CODE) {
        currentIndex = occurrences.value.findLastIndex((o) => o.binaryLineNumber < selectedLine.value);
    } else if (selectedOccurrences.value.length > 0) {
        const minBinaryLine = selectedOccurrences.value
            .map((so) => so.binaryLineNumber)
            .reduce((min, curr) => (curr < min ? curr : min));
        currentIndex = occurrences.value.findLastIndex((o) => o.binaryLineNumber < minBinaryLine);
    } else {
        const binaryLine = occurrences.value
            .filter((oc) => oc.sourceLineNumber < selectedLine.value)
            .map((oc) => oc.binaryLineNumber)
            .reduce((min, curr) => (curr < min ? min : curr));
        currentIndex = occurrences.value.findIndex((o) => o.binaryLineNumber === binaryLine);
    }

    if (currentIndex >= 0) {
        codeViewerStore.setCurrentView(binaryView.value);
        codeViewerStore.setSelectedLine(occurrences.value[currentIndex].binaryLineNumber, true);
    }
}

function selectNextOccurrence() {
    let currentIndex = -1;
    if (currentView.value !== CODE_TYPE.SOURCE_CODE) {
        currentIndex = occurrences.value.findIndex((o) => o.binaryLineNumber > selectedLine.value);
    } else if (selectedOccurrences.value.length > 0) {
        const maxBinaryLine = selectedOccurrences.value
            .map((so) => so.binaryLineNumber)
            .reduce((max, curr) => (curr > max ? curr : max));
        currentIndex = occurrences.value.findIndex((o) => o.binaryLineNumber > maxBinaryLine);
    } else {
        const binaryLine = occurrences.value
            .filter((oc) => oc.sourceLineNumber > selectedLine.value)
            .map((oc) => oc.binaryLineNumber)
            .reduce((max, curr) => (curr > max ? max : curr));
        currentIndex = occurrences.value.findIndex((o) => o.binaryLineNumber === binaryLine);
    }

    if (currentIndex >= 0) {
        codeViewerStore.setCurrentView(binaryView.value);
        codeViewerStore.setSelectedLine(occurrences.value[currentIndex].binaryLineNumber, true);
    }
}
</script>
