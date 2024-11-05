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

/**
 * Get the highlight of the current token
 * @returns {String}
 */
function getHighlight() {
    for (const key of Object.keys(props.highlightedTokens)) {
        if (!props.highlightedTokens[key][props.token]) {
            continue;
        }
        if (
            (key.startsWith('<=') && props.lineNumber.toString() <= key.substring(2)) ||
            (key.startsWith('< ') && props.lineNumber.toString() < key.substring(2)) ||
            (key.startsWith('>=') && props.lineNumber.toString() >= key.substring(2)) ||
            (key.startsWith('> ') && props.lineNumber.toString() > key.substring(2)) ||
            props.lineNumber.toString() === key ||
            key === '*'
        ) {
            return props.highlightedTokens[key][props.token];
        }
    }
    return '';
}
</script>
