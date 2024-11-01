<template>
    <LandingPage v-if="currentContext === CONTEXT.START_SCREEN" />
    <NavigationBase v-else />

    <PopupMetricHint />
</template>
<script setup>
import { CONTEXT, useContextStore } from './stores/ContextStore';
import { computed, onBeforeMount } from 'vue';
import { useConfigStore } from './stores/ConfigStore';
import LandingPage from './components/pages/landing/LandingPage.vue';
import NavigationBase from './components/navigation/NavigationBase.vue';
import PopupMetricHint from './components/popups/PopupMetricHint.vue';

const contextStore = useContextStore();
const configStore = useConfigStore();

const currentContext = computed(() => contextStore.getCurrentContext);

onBeforeMount(async () => {
    await configStore.initialize();
    contextStore.setCurrentContext(CONTEXT.START_SCREEN);
});
</script>
<style>
* {
    scrollbar-color: rgb(150, 142, 224) transparent;
}
</style>
