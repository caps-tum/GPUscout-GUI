<template>
    <div class="grid h-full w-full grid-rows-[3rem_calc(100vh-5rem)] space-y-2 p-2">
        <NavigationHeader />
        <Analysis v-if="currentContext === CONTEXT.ANALYSIS" />
    </div>
</template>
<script setup>
import Analysis from '../pages/analysis/Analysis.vue';
import NavigationHeader from './NavigationHeader.vue';
import { useContextStore, CONTEXT } from '../../stores/ContextStore';
import { computed } from 'vue';

const contextStore = useContextStore();

const currentContext = computed(() => contextStore.getCurrentContext);
</script>
