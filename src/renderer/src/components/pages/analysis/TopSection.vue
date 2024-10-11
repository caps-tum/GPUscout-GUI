<template>
    <div class="flex flex-col space-y-2">
        <TopSectionDatatypeConversion v-if="analysis === ANALYSIS.datatype_conversion.name" :kernel="kernel" />
        <TopSectionGlobalAtomics v-else-if="analysis === ANALYSIS.global_atomics.name" :kernel="kernel" />
        <TopSectionRestrict v-else-if="analysis === ANALYSIS.use_restrict.name" :kernel="kernel" />
        <TopSectionTextureMemory v-else-if="analysis === ANALYSIS.use_texture.name" :kernel="kernel" />
        <TopSectionVectorization v-else-if="analysis === ANALYSIS.vectorization.name" :kernel="kernel" />
        <TopSectionDefault v-else :kernel="kernel" :analysis="analysis" />
    </div>
</template>
<script setup>
import TopSectionDefault from './custom_top_sections/TopSectionDefault.vue';
import TopSectionGlobalAtomics from './custom_top_sections/TopSectionGlobalAtomics.vue';
import TopSectionDatatypeConversion from './custom_top_sections/TopSectionDatatypeConversion.vue';
import TopSectionRestrict from './custom_top_sections/TopSectionRestrict.vue';
import TopSectionTextureMemory from './custom_top_sections/TopSectionTextureMemory.vue';
import TopSectionVectorization from './custom_top_sections/TopSectionVectorization.vue';
import { ANALYSIS } from '../../../../../config/analyses';

defineProps({
    analysis: String,
    kernel: String
});
</script>
