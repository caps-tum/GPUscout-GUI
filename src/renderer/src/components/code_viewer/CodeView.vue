<template>
    <div class="relative flex h-full w-full flex-col overflow-x-auto">
        <CodeLine
            v-for="(line, index) in code"
            :key="line"
            :line="line"
            :line-number="index"
            :mode="mode"
        />
    </div>
</template>
<script setup>
import CodeLine from './parts/CodeLine.vue';

defineProps({
    mode: Number,
    code: Array
});
</script>
