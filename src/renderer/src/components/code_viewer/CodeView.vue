<template>
    <div class="relative flex h-full w-full flex-col overflow-x-auto">
        <CodeLine
            v-for="line in codeLines"
            :key="line.address"
            :tokens="line.tokens"
            :line-number="line.address"
            :mode="mode"
        />
    </div>
</template>
<script setup>
import CodeLine from './parts/CodeLine.vue';

defineProps({
    mode: Number,
    codeLines: Array
});
</script>
