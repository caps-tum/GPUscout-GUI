<template>
    <a class="rounded bg-secondary px-2 py-2 text-lg text-text hover:cursor-pointer" @click="onClick">
        {{ title }}
        <slot></slot>
    </a>
</template>
<script setup>
defineProps({
    title: String,
    onClick: Function
});
</script>
