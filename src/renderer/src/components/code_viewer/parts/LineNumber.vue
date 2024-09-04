<template>
  <p class="h-6 max-h-6 w-full px-1">{{ linenumber }}</p>
</template>
<script setup>
defineProps({
  linenumber: [Number, String]
});
</script>
