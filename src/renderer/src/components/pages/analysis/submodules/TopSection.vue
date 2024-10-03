<template>
    <div class="flex">
        <TopSectionWarpDivergence v-if="analysis === ANALYSIS.warp_divergence.name" :kernel="kernel" />
        <TopSectionDefault v-else :kernel="kernel" :analysis="analysis" />
    </div>
</template>
<script setup>
import TopSectionWarpDivergence from './warp_divergence/TopSectionWarpDivergence.vue';
import TopSectionDefault from './default/TopSectionDefault.vue';
import { ANALYSIS } from '../../../../../../config/analyses';

defineProps({
    analysis: String,
    kernel: String
});
</script>
