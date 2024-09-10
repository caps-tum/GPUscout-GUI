<template>
    <StartScreen v-if="currentContext === CONTEXT.START_SCREEN" />
    <CodeViewer v-if="currentContext === CONTEXT.CODE_VIEW" />
</template>
<script setup>
import StartScreen from './components/start_screen/StartScreen.vue';
import CodeViewer from './components/code_viewer/CodeViewer.vue';
import { CONTEXT, useContextStore } from './stores/ContextStore';
import { computed } from 'vue';

const contextStore = useContextStore();

const currentContext = computed(() => contextStore.getCurrentContext);
</script>
