<template>
    <div class="flex">
        <TopSectionWarpDivergence v-if="analysis === ANALYSIS.warp_divergence.name" :kernel="kernel" />
    </div>
</template>
<script setup>
import TopSectionWarpDivergence from './warp_divergence/TopSectionWarpDivergence.vue';
import { ANALYSIS } from '../../../../../../config/analyses';

defineProps({
    analysis: String,
    kernel: String
});
</script>
