<template>
    <p v-if="token !== ' '" :class="getHighlight()">{{ token }}</p>
    <p v-else>&nbsp;</p>
</template>
<script setup>
const props = defineProps({
    lineNumber: [String, Number],
    mode: Number,
    token: String,
    highlightedTokens: Object
});

function getHighlight() {
    if (
        props.highlightedTokens[props.lineNumber] !== undefined &&
        props.highlightedTokens[props.lineNumber][props.token] !== undefined
    ) {
        return props.highlightedTokens[props.lineNumber][props.token];
    }
    if (props.highlightedTokens['*'] !== undefined && props.highlightedTokens['*'][props.token] !== undefined) {
        return props.highlightedTokens['*'][props.token];
    }
    return '';
}
</script>
