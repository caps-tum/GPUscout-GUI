import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const CONTEXT = {
    NONE: 0,
    START_SCREEN: 1,
    ANALYSIS: 2,
    CODE_VIEW: 3
};

export const POPUP = {
    METRIC_HELP: 0,
    GLOBAL_MEMORY_FLOW: 1,
    TEXTURE_MEMORY_FLOW: 2,
    GLOBAL_LOCAL_MEMORY_FLOW: 3
};

export const useContextStore = defineStore('context', () => {
    const currentContext = ref(CONTEXT.NONE);
    const activePopups = ref([]);
    const popupParameters = ref({});

    const getCurrentContext = computed(() => currentContext.value);
    const getActivePopups = computed(() => activePopups.value);
    const getPopupParameters = computed(() => popupParameters.value);

    function setCurrentContext(context) {
        currentContext.value = context;
    }

    function togglePopup(popup, show = true, parameters = {}) {
        if (show && !activePopups.value.includes(popup)) {
            popupParameters.value = parameters;
            activePopups.value.push(popup);
        } else if (!show && activePopups.value.includes(popup)) {
            activePopups.value.splice(activePopups.value.indexOf(popup), 1);
        }
    }

    return {
        getCurrentContext,
        setCurrentContext,
        getActivePopups,
        togglePopup,
        getPopupParameters
    };
});
