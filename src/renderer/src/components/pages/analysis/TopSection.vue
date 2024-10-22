<template>
    <div class="flex flex-col space-y-2">
        <TopSectionDatatypeConversion
            v-if="analysis === ANALYSIS.datatype_conversion.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionGlobalAtomics
            v-else-if="analysis === ANALYSIS.global_atomics.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionRestrict
            v-else-if="analysis === ANALYSIS.use_restrict.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionTextureMemory
            v-else-if="analysis === ANALYSIS.use_texture.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionVectorization
            v-else-if="analysis === ANALYSIS.vectorization.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionRegisterSpilling
            v-else-if="analysis === ANALYSIS.register_spilling.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionSharedMemory
            v-else-if="analysis === ANALYSIS.use_shared.name"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
        <TopSectionDefault
            v-else
            :kernel="kernel"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalayisData"
        />
    </div>
</template>
<script setup>
import TopSectionDefault from './custom_top_sections/TopSectionDefault.vue';
import TopSectionGlobalAtomics from './custom_top_sections/TopSectionGlobalAtomics.vue';
import TopSectionDatatypeConversion from './custom_top_sections/TopSectionDatatypeConversion.vue';
import TopSectionRestrict from './custom_top_sections/TopSectionRestrict.vue';
import TopSectionTextureMemory from './custom_top_sections/TopSectionTextureMemory.vue';
import TopSectionVectorization from './custom_top_sections/TopSectionVectorization.vue';
import TopSectionRegisterSpilling from './custom_top_sections/TopSectionRegisterSpilling.vue';
import TopSectionSharedMemory from './custom_top_sections/TopSectionSharedMemory.vue';
import { ANALYSIS } from '../../../../../config/analyses';
import { useDataStore } from '../../../stores/DataStore';
import { computed } from 'vue';

const props = defineProps({
    analysis: String,
    kernel: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(props.analysis, props.kernel));
const comparisonAnalayisData = computed(() =>
    dataStore.getGPUscoutComparisonResult()?.getAnalysis(props.analysis, props.kernel)
);
</script>
