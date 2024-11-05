<template>
    <template v-for="(title, index) in titles" :key="title">
        <div v-if="titles.length % 2 === 1 && titles.length !== 1" class=""></div>
        <div class="flex min-h-12 min-w-24 items-center justify-center rounded bg-primary p-2 text-center text-background">
            <p :class="getBoldness(title)">{{ getTitle(title) }}</p>
        </div>
        <div v-if="titles.length % 2 === 0 && index !== titles.length - 1" class=""></div>
    </template>
</template>
<script setup>
defineProps({
    titles: Array
});

/**
 * Return classes to style the font boldness based on the title
 * @returns {String}
 */
function getBoldness(title) {
    return title.startsWith('*') ? 'font-bold text-base' : '';
}

/**
 * Sanitize the string
 * @returns {String}
 */
function getTitle(title) {
    return title.startsWith('*') ? title.substring(1) : title;
}
</script>
