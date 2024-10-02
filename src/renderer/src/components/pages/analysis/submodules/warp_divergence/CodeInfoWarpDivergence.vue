<template>
    <p>{{ selectedLine }} in {{ currentView }} {{ occurrence }}</p>
</template>
<script setup>
import { Occurrence } from '../../../../../utils/Analysis';

defineProps({
    kernel: String,
    selectedLine: [Number, String],
    currentView: Number,
    occurrence: Occurrence
});
</script>
