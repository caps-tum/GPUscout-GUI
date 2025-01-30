<!--
Component for navigation header, that displays current analysis and kernel.

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full w-full items-center justify-center rounded bg-primary text-background">
        <p v-if="currentAnalysis" class="line-clamp-1 max-w-[50vw] text-ellipsis text-center text-lg font-bold">
            {{ ANALYSIS[currentAnalysis].display_name }} Analysis for Kernel {{ currentKernel }}
        </p>
        <p v-else class="text-lg font-bold">Summary for Kernel {{ currentKernel }}</p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useDataStore } from '../../stores/DataStore';
import { ANALYSIS } from '../../../../config/analyses';

const dataStore = useDataStore();

const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);
const currentKernel = computed(() => dataStore.getCurrentKernel);
</script>
