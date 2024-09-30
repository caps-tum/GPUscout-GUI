<template>
    <p>{{ selectedLine }} in {{ currentView }}</p>
</template>
<script setup>
defineProps({
    kernel: String,
    selectedLine: [Number, String],
    currentView: Number
});
</script>
