<template>
    <div class="flex h-full w-full flex-col space-y-2">
        <div class="min-h-72 shrink-0">
            <TopSection :analysis="currentAnalysis" :kernel="currentKernel" />
        </div>
        <p class="text-xl text-text">Code View</p>
        <p class="!-mb-1 !-mt-1 text-sm text-text/50">Here you can see the code</p>
        <div class="flex flex-grow-0 flex-row space-x-2 overflow-x-hidden">
            <CodeViewer />
            <div class="flex h-full w-1/3 flex-col">
                <div class="w-full flex-grow">
                    <CodeInfo :analysis="currentAnalysis" :kernel="currentKernel" :occurrence="selectedOccurrence" />
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
import CodeInfo from './submodules/CodeInfo.vue';
import TopSection from './submodules/TopSection.vue';
import { useDataStore } from '../../../stores/DataStore';
import { computed } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { ANALYSIS } from '../../../../../config/analyses';

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);

const selectedOccurrence = computed(() => dataStore.getCurrentOccurrence);
const occurrences = computed(() =>
    dataStore.getGPUscoutResult().getAnalysis(currentAnalysis.value, currentKernel.value).getOccurrences()
);

function selectPreviousOccurrence() {}

function selectNextOccurrence() {}
</script>
