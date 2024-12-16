/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines the configStore
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * The config store handles reading and writing to and from the config file
 */
export const useConfigStore = defineStore('config', () => {
    const config = ref({});

    const getConfig = computed(() => config.value);

    /**
     * Load the config from electron
     */
    async function initialize() {
        const loadedConfig = await window.electronAPI.getConfig();
        config.value = JSON.parse(loadedConfig);
    }

    /**
     * Change a config option
     * @param {String} option The name of the option to change
     * @param {String} value The new value of the option
     */
    function setOption(option, value) {
        config.value[option] = value;
        window.electronAPI.setConfig(JSON.stringify(config.value));
    }

    return {
        initialize,
        getConfig,
        setOption
    };
});
