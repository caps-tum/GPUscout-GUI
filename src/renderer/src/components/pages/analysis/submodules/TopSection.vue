<template>
    <div class="flex flex-col space-y-2">
        <TopSectionWarpDivergence v-if="analysis === ANALYSIS.warp_divergence.name" :kernel="kernel" />
        <TopSectionDatatypeConversion v-else-if="analysis === ANALYSIS.datatype_conversion.name" :kernel="kernel" />
        <TopSectionDefault v-else :kernel="kernel" :analysis="analysis" />
    </div>
</template>
<script setup>
import TopSectionWarpDivergence from './warp_divergence/TopSectionWarpDivergence.vue';
import TopSectionDatatypeConversion from './datatype_conversion/TopSectionDatatypeConversion.vue';
import TopSectionDefault from './default/TopSectionDefault.vue';
import { ANALYSIS } from '../../../../../../config/analyses';

defineProps({
    analysis: String,
    kernel: String
});
</script>
