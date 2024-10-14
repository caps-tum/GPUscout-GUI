<template>
    <template v-for="node in nodes" :key="node">
        <div v-if="nodes % 2 === 1 && nodes !== 1" class=""></div>
        <div
            class="flex min-h-12 min-w-24 items-center justify-center rounded bg-primary p-2 text-center font-bold text-background"
        >
            <slot :name="'node-' + node"></slot>
        </div>
        <div v-if="nodes % 2 === 0 && node !== nodes" class=""></div>
    </template>
</template>
<script setup>
defineProps({
    nodes: Number
});
</script>
