<!--
Component for the navigation that is always shown (Sidebar and Header)

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full w-full flex-row space-x-2 p-2">
        <NavigationSidebar />
        <div class="grid h-full w-full grid-rows-[3rem_calc(100vh-4.5rem)] space-y-2">
            <NavigationHeader />
            <Analysis v-if="currentContext === CONTEXT.ANALYSIS" />
            <Summary v-if="currentContext === CONTEXT.SUMMARY" />
        </div>
    </div>
</template>
<script setup>
import Analysis from '../pages/analysis/Analysis.vue';
import NavigationHeader from './NavigationHeader.vue';
import NavigationSidebar from './NavigationSidebar.vue';
import { useContextStore, CONTEXT } from '../../stores/ContextStore';
import { computed } from 'vue';
import Summary from '../pages/summary/Summary.vue';

const contextStore = useContextStore();

const currentContext = computed(() => contextStore.getCurrentContext);
</script>
