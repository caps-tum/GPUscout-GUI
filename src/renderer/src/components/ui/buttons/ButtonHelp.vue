<!--
Component for the help button opening the help popup.

Author: Tobias Stuckenberger
-->
<template>
    <a class="fill-white text-background hover:cursor-pointer" @click="emit('click')">
        <IconHelp class="h-5 w-5" />
    </a>
</template>
<script setup>
import IconHelp from '../icons/IconHelp.vue';

const emit = defineEmits(['click']);
</script>
