<template>
    <LandingPage v-if="currentContext === CONTEXT.START_SCREEN" />
    <NavigationBase v-else />

    <PopupMetricHint />
    <PopupGlobalMemoryFlow />
    <PopupTextureMemoryFlow />
    <PopupGlobalLocalMemoryFlow />
</template>
<script setup>
import { CONTEXT, useContextStore } from './stores/ContextStore';
import { computed, onBeforeMount } from 'vue';
import { useConfigStore } from './stores/ConfigStore';
import LandingPage from './components/pages/landing/LandingPage.vue';
import NavigationBase from './components/navigation/NavigationBase.vue';
import PopupMetricHint from './components/popups/PopupMetricHint.vue';
import PopupGlobalMemoryFlow from './components/popups/PopupGlobalMemoryFlow.vue';
import PopupTextureMemoryFlow from './components/popups/PopupTextureMemoryFlow.vue';
import PopupGlobalLocalMemoryFlow from './components/popups/PopupGlobalLocalMemoryFlow.vue';

const contextStore = useContextStore();
const configStore = useConfigStore();

const currentContext = computed(() => contextStore.getCurrentContext);

onBeforeMount(async () => {
    await configStore.initialize();
    contextStore.setCurrentContext(CONTEXT.START_SCREEN);
});
</script>
