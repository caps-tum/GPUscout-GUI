<template>
    <CodeInfoWarpDivergence
        v-if="analysis === ANALYSES.WARP_DIVERGENCE"
        :kernel="kernel"
        :current-view="currentView"
        :selected-line="selectedLine"
    />
</template>
<script setup>
import CodeInfoWarpDivergence from './warp_divergence/CodeInfoWarpDivergence.vue';
import { computed } from 'vue';
import { useCodeViewerStore } from '../../../../stores/CodeViewerStore';
import { ANALYSES } from '../../../../utils/GPUscoutResult';

defineProps({
    analysis: String,
    kernel: String
});

const codeViewerStore = useCodeViewerStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const currentView = computed(() => codeViewerStore.getCurrentView);
</script>
