<template>
    <CodeInfoWarpDivergence
        v-if="analysis === ANALYSIS.warp_divergence.name"
        :kernel="kernel"
        :current-view="currentView"
        :selected-line="selectedLine"
        :occurrence="occurrence"
    />
    <CodeInfoDefault
        v-else
        :kernel="kernel"
        :current-view="currentView"
        :selected-line="selectedLine"
        :occurrence="occurrence"
    />
</template>
<script setup>
import CodeInfoWarpDivergence from './warp_divergence/CodeInfoWarpDivergence.vue';
import CodeInfoDefault from './default/CodeInfoDefault.vue';
import { computed } from 'vue';
import { useCodeViewerStore } from '../../../../stores/CodeViewerStore';
import { ANALYSIS } from '../../../../../../config/analyses';
import { Occurrence } from '../../../../utils/Analysis';

defineProps({
    analysis: String,
    kernel: String,
    occurrence: Occurrence
});

const codeViewerStore = useCodeViewerStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const currentView = computed(() => codeViewerStore.getCurrentView);
</script>
