<template>
    <label class="relative inline-block h-5 w-8">
        <input type="checkbox" class="h-0 w-0 opacity-0" :checked="checked" @change="emit('changed')" />
        <span class="slider round"></span>
    </label>
</template>
<script setup>
defineProps({
    checked: Boolean
});

const emit = defineEmits(['changed']);
</script>
<style scoped>
/* The slider */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    @apply bg-text/50;
}

.slider:before {
    position: absolute;
    content: '';
    height: 0.75rem;
    width: 0.75rem;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked + .slider {
    @apply bg-primary;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
    -webkit-transform: translateX(0.75rem);
    -ms-transform: translateX(0.75rem);
    transform: translateX(0.75rem);
}

/* Rounded sliders */
.slider.round {
    border-radius: 1.5rem;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
