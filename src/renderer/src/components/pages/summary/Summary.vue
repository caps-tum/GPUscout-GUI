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
        <div v-show="showMetrics" class="max-h-[calc(min(18rem,30vh))] flex-shrink-0 overflow-x-auto">
            <TopSectionSummary :analysis-data="currentAnalysis" />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row">
                <p class="mr-4 text-xl text-text">{{ TEXT.code_view.title }}</p>
                <div v-if="hasComparisonResult" class="mr-4 flex flex-row items-end space-x-1">
                    <p class="text-text">{{ TEXT.code_view.toggle.old }}</p>
                    <ToggleSwitch class="mb-1" :checked="!useComparisonCode" @changed="toggleCodeVersions" />
                    <p class="text-text">{{ TEXT.code_view.toggle.new }}</p>
                </div>
                <div class="flex flex-row items-end space-x-1">
                    <p class="text-text">{{ TEXT.summary.toggle.ptx }}</p>
                    <ToggleSwitch class="mb-1" :checked="currentBinary === CODE_TYPE.SASS_CODE" @changed="toggleCodeTypes" />
                    <p class="text-text">{{ TEXT.summary.toggle.sass }}</p>
                </div>
            </div>
            <p class="!-mb-1 !-mt-1 text-sm text-text/50">{{ TEXT.code_view.hint }}</p>
        </div>
        <div class="grid flex-grow grid-cols-[75%_24.5%] grid-rows-1 gap-2 overflow-x-hidden">
            <CodeViewer />
            <div class="flex h-full w-full flex-col space-y-2 rounded">
                <div class="w-full flex-grow overflow-x-hidden rounded bg-secondary/50">
                    <CodeInfo :kernel="currentKernel" :occurrences="selectedOccurrences" :stalls="lineStalls" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { useContextStore, POPUP } from '../../../stores/ContextStore';
import { useDataStore } from '../../../stores/DataStore';
import ToggleSwitch from '../../ui/input/ToggleSwitch.vue';
import CodeInfo from '../analysis/code_info/CodeInfo.vue';
import CodeViewer from '../../code_viewer/CodeViewer.vue';
import { TEXT } from '../../../../../config/text';
import TopSectionSummary from './TopSectionSummary.vue';
import { ANALYSIS } from '../../../../../config/analyses';
import ButtonPrimary from '../../ui/buttons/ButtonPrimary.vue';

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();
const contextStore = useContextStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() =>
    dataStore.getGPUscoutResult().getAnalysis(ANALYSIS.vectorization.name, currentKernel.value)
);
const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const currentView = computed(() => codeViewerStore.getCurrentView);
const currentBinary = computed(() => codeViewerStore.getCurrentBinary);

const showMetrics = ref(true);
const useComparisonCode = computed(() => codeViewerStore.displayComparisonCode);
const hasComparisonResult = computed(() => dataStore.hasComparisonResult);
const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
const lineStalls = computed(() =>
    useComparisonCode.value
        ? dataStore.getGPUscoutComparisonResult().getLineStalls(currentKernel.value, selectedLine.value, currentView.value)
        : dataStore.getGPUscoutResult().getLineStalls(currentKernel.value, selectedLine.value, currentView.value)
);

function openLargeMemoryGraph() {
    contextStore.togglePopup(POPUP.MEMORY_GRAPH, true);
}

function toggleCodeVersions() {
    codeViewerStore.setUseComparisonCode(!useComparisonCode.value);
}

function toggleCodeTypes() {
    codeViewerStore.setCurrentBinary(currentBinary.value === CODE_TYPE.SASS_CODE ? CODE_TYPE.PTX_CODE : CODE_TYPE.SASS_CODE);
}
</script>
