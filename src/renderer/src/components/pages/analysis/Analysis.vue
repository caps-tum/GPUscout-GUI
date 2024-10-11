<template>
    <div class="flex h-full w-full flex-col space-y-2">
        <div class="min-h-72 shrink-0">
            <TopSection :analysis="currentAnalysis" :kernel="currentKernel" />
        </div>
        <p class="text-xl text-text">Code View</p>
        <p class="!-mb-1 !-mt-1 text-sm text-text/50">Here you can see the code</p>
        <div class="grid flex-grow-0 grid-cols-[75%_25%] grid-rows-1 overflow-x-hidden">
            <CodeViewer />
            <div class="flex h-full w-full flex-col">
                <div class="w-full flex-grow overflow-x-hidden">
                    <CodeInfo
                        :analysis="currentAnalysis"
                        :kernel="currentKernel"
                        :occurrence="selectedOccurrence"
                        :stalls="lineStalls"
                    />
                </div>
                <div class="flex w-full flex-row justify-around space-x-2">
                    <ButtonSecondary
                        class="text-center"
                        title="Select previous occurrence"
                        @click="selectPreviousOccurrence"
                    />
                    <ButtonSecondary class="text-center" title="Select next occurrence" @click="selectNextOccurrence" />
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
import { useCodeViewerStore } from '../../../stores/CodeViewerStore';

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const binaryView = computed(() => codeViewerStore.getCurrentBinary);
const currentView = computed(() => codeViewerStore.getCurrentView);

const selectedOccurrence = computed(() => dataStore.getCurrentOccurrence);
const occurrences = computed(() =>
    dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value).getOccurrences()
);
const lineStalls = computed(() =>
    dataStore.getGPUscoutResult().getLineStalls(currentKernel.value, selectedLine.value, currentView.value)
);

function selectPreviousOccurrence() {
    const currentIndex = occurrences.value.findLastIndex((o) => o.binaryLineNumber < selectedLine.value);
    if (currentIndex >= 0) {
        codeViewerStore.setCurrentView(binaryView.value);
        codeViewerStore.setSelectedLine(occurrences.value[currentIndex].binaryLineNumber);
    }
}

function selectNextOccurrence() {
    const currentIndex = occurrences.value.findIndex((o) => o.binaryLineNumber > selectedLine.value);
    if (currentIndex >= 0) {
        codeViewerStore.setCurrentView(binaryView.value);
        codeViewerStore.setSelectedLine(occurrences.value[currentIndex].binaryLineNumber);
    }
}
</script>
