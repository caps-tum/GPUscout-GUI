<template>
    <StartScreen v-if="currentContext === CONTEXT.START_SCREEN" />
    <CodeViewer v-if="currentContext === CONTEXT.CODE_VIEW" />
</template>
<script setup>
import StartScreen from './components/start_screen/StartScreen.vue';
import CodeViewer from './components/code_viewer/CodeViewer.vue';
import { CONTEXT, useContextStore } from './stores/ContextStore';
import { computed, onBeforeMount } from 'vue';
import { useConfigStore } from './stores/ConfigStore';

const contextStore = useContextStore();
const configStore = useConfigStore();

const currentContext = computed(() => contextStore.getCurrentContext);

onBeforeMount(async () => {
    await configStore.initialize();
    contextStore.setCurrentContext(CONTEXT.START_SCREEN);
});
</script>
