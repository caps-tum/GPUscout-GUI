<template>
    <div class="flex flex-col space-y-2">
        <TopSectionDatatypeConversion v-if="analysis === ANALYSIS.datatype_conversion.name" :kernel="kernel" />
        <TopSectionDefault v-else :kernel="kernel" :analysis="analysis" />
    </div>
</template>
<script setup>
import TopSectionDefault from './custom_top_sections/TopSectionDefault.vue';
import TopSectionDatatypeConversion from './custom_top_sections/TopSectionDatatypeConversion.vue';
import { ANALYSIS } from '../../../../../config/analyses';

defineProps({
    analysis: String,
    kernel: String
});
</script>
