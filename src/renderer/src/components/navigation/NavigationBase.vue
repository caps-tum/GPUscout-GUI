<!--
Component for the navigation that is always shown (Sidebar and Header)

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full w-full flex-row p-2">
        <NavigationSidebar class="mr-2" />
        <div class="grid h-full w-full grid-rows-[3rem_calc(100vh-4.5rem)]">
            <NavigationHeader />
            <Analysis v-if="currentContext === CONTEXT.ANALYSIS" class="mt-2" />
            <Summary v-if="currentContext === CONTEXT.SUMMARY" class="mt-2" />
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
