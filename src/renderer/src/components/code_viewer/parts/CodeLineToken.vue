<template>
    <p v-if="token !== ' '">{{ token }}</p>
    <p v-else>&nbsp;</p>
</template>
<script setup>
defineProps({
    lineNumber: [String, Number],
    mode: Number,
    token: String
});
</script>
