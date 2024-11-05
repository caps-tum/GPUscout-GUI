<template>
    <input
        ref="input"
        type="text"
        :placeholder="placeholder"
        :value="value"
        :readonly="readonly"
        class="rounded bg-background p-1 text-text"
        @change="onChange"
        @input="onChange"
    />
</template>
<script setup>
import { ref } from 'vue';

defineProps({
    placeholder: String,
    value: String,
    readonly: Boolean
});

const emit = defineEmits(['changed']);

const input = ref(null);

/**
 * Emit the change when the user inputs something
 */
function onChange() {
    emit('changed', input.value.value);
}
</script>
