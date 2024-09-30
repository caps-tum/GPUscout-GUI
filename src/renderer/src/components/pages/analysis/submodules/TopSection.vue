<template>
    <div class="flex">
        <TopSectionWarpDivergence v-if="analysis === ANALYSES.WARP_DIVERGENCE" :kernel="kernel" />
    </div>
</template>
<script setup>
import TopSectionWarpDivergence from './warp_divergence/TopSectionWarpDivergence.vue';
import { ANALYSES } from '../../../../utils/GPUscoutResult';

defineProps({
    analysis: String,
    kernel: String
});
</script>
