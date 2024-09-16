import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const CONTEXT = {
    NONE: 0,
    START_SCREEN: 1,
    CODE_VIEW: 2
};

export const useContextStore = defineStore('context', () => {
    const currentContext = ref(CONTEXT.NONE);

    const getCurrentContext = computed(() => currentContext.value);

    function setCurrentContext(context) {
        currentContext.value = context;
    }

    return {
        getCurrentContext,
        setCurrentContext
    };
});
