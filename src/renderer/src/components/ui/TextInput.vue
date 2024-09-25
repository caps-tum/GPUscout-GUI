<template>
    <input
        ref="input"
        type="text"
        :placeholder="placeholder"
        class="rounded bg-background p-1 text-text"
        @change="onChange"
        @input="onChange"
    />
</template>
<script setup>
import { ref } from 'vue';

defineProps({
    placeholder: String
});

const emit = defineEmits(['changed']);

const input = ref(null);

function onChange() {
    emit('changed', input.value.value);
}
</script>
