<template>
    <div class="relative flex h-full w-full flex-col overflow-x-auto">
        <CodeLine
            v-for="line in codeLines"
            :key="line.address"
            :tokens="line.tokens"
            :line-number="line.address"
            :code-type="codeType"
            :highlighted-lines="highlightedLines"
            :high-lighted-tokens="highlightedTokens"
        />
    </div>
</template>
<script setup>
import CodeLine from './parts/CodeLine.vue';

defineProps({
    codeType: Number,
    codeLines: Array,
    highlightedLines: Object,
    highlightedTokens: Object
});
</script>
