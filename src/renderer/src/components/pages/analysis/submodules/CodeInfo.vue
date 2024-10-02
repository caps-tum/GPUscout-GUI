<template>
    <CodeInfoWarpDivergence
        v-if="analysis === ANALYSIS.warp_divergence.name"
        :kernel="kernel"
        :current-view="currentView"
        :selected-line="selectedLine"
    />
</template>
<script setup>
import CodeInfoWarpDivergence from './warp_divergence/CodeInfoWarpDivergence.vue';
import { computed } from 'vue';
import { useCodeViewerStore } from '../../../../stores/CodeViewerStore';
import { ANALYSIS } from '../../../../../../config/analyses';

defineProps({
    analysis: String,
    kernel: String
});

const codeViewerStore = useCodeViewerStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const currentView = computed(() => codeViewerStore.getCurrentView);
</script>
