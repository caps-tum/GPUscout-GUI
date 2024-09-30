<template>
    <a class="text-background hover:cursor-pointer" @click="emit('click')">
        <img src="../../../assets/circle-question-regular.svg" class="h-5 w-5" alt="" />
    </a>
</template>
<script setup>
const emit = defineEmits(['click']);
</script>
