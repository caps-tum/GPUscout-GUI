import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
        contextBridge.exposeInMainWorld('electronAPI', {
            getConfig: () => ipcRenderer.invoke('config:get'),
            setConfig: (content) => ipcRenderer.invoke('config:set', content),
            selectDirectory: (defaultPath) => ipcRenderer.invoke('directory:select', defaultPath),
            readDirectory: (folderPath) => ipcRenderer.invoke('directory:read', folderPath),
            getRecentAnalyses: () => ipcRenderer.invoke('recentAnalyses:get'),
            addRecentAnalysis: (analysis) => ipcRenderer.invoke('recentAnalyses:add', analysis),
            removeRecentAnalysis: (analysisID) => ipcRenderer.invoke('recentAnalyses:remove', analysisID),
            checkAnalysis: (folderPath, analysisTitle) => ipcRenderer.invoke('analysis:check', folderPath, analysisTitle),
            loadAnalysis: (folderPath, analysisTitle) => ipcRenderer.invoke('analysis:load', folderPath, analysisTitle)
        });
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.api = api;
}
