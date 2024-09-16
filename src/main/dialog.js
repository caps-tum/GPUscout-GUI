import { dialog } from 'electron';

/**
 * @param event
 * @param defaultPath
 * @returns {Promise<string|string>}
 */
export async function selectDirectory(event, defaultPath) {
    const result = await dialog.showOpenDialog(undefined, {
        properties: ['openDirectory'],
        defaultPath: defaultPath
    });
    return result['filePaths'][0] || '';
}
