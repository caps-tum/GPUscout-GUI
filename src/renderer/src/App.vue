<template>
    <LandingPage v-if="currentContext === CONTEXT.START_SCREEN" />
    <Analysis v-if="currentContext === CONTEXT.ANALYSIS" />
</template>
<script setup>
import { CONTEXT, useContextStore } from './stores/ContextStore';
import { computed, onBeforeMount } from 'vue';
import { useConfigStore } from './stores/ConfigStore';
import LandingPage from './components/pages/landing/LandingPage.vue';
import Analysis from './components/pages/analysis/Analysis.vue';

const contextStore = useContextStore();
const configStore = useConfigStore();

const currentContext = computed(() => contextStore.getCurrentContext);

onBeforeMount(async () => {
    await configStore.initialize();
    contextStore.setCurrentContext(CONTEXT.START_SCREEN);
});
</script>
