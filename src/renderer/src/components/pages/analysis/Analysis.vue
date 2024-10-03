<template>
    <div class="flex h-full w-full flex-col space-y-2">
        <div class="min-h-72 shrink-0">
            <TopSection :analysis="currentAnalysis" :kernel="currentKernel" />
        </div>
        <div class="flex flex-grow-0 space-x-2 overflow-x-hidden">
            <CodeViewer />
            <div class="flex h-full w-1/3 flex-col">
                <div class="w-full flex-grow">
                    <CodeInfo :analysis="currentAnalysis" :kernel="currentKernel" :occurrence="selectedOccurrence" />
                </div>
                <div class="flex w-full flex-row justify-around space-x-2">
                    <ButtonSecondary class="text-center" title="Select previous occurrence" />
                    <ButtonSecondary class="text-center" title="Select next occurrence" />
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

const dataStore = useDataStore();

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);

const selectedOccurrence = computed(() => dataStore.getCurrentOccurrence);
</script>
