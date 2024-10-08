<template>
    <template v-for="node in nodes" :key="node">
        <div class="flex min-h-12 min-w-24 items-center justify-center rounded bg-blue-400 p-2">
            <slot :name="'node-' + node"></slot>
        </div>
        <div v-if="node !== nodes" class=""></div>
    </template>
</template>
<script setup>
defineProps({
    nodes: Number
});
</script>
