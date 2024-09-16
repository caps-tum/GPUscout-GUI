import { app } from 'electron';
import { join } from 'path';
import * as fs from 'node:fs';

/**
 * @param event
 * @param folderPath
 * @returns {Promise<string[]|*[]>}
 */
export async function getFolderContent(event, folderPath) {
    if (!fs.existsSync(folderPath)) {
        return [];
    }
    return await fs.promises.readdir(folderPath);
}

/**
 * @returns {Promise<void>}
 */
export async function checkFileStructure() {
    const dataPath = app.getPath('userData');
    const storedAnalysesPath = join(dataPath, 'analyses/');
    const configFilePath = join(dataPath, 'config.json');

    if (!fs.existsSync(storedAnalysesPath)) {
        await fs.promises.mkdir(storedAnalysesPath);
    }
    if (!fs.existsSync(configFilePath)) {
        await fs.promises.writeFile(configFilePath, '{}');
    }
    console.log('Checked file structure');
}

/**
 * @returns {Promise<String>}
 */
export async function getConfig() {
    const configFilePath = join(app.getPath('userData'), 'config.json');
    console.log('Reading config...');
    return await fs.promises.readFile(configFilePath, { encoding: 'utf8' });
}

/**
 * @param event {Object}
 * @param content {String}
 * @returns {Promise<void>}
 */
export async function setConfig(event, content) {
    const configFilePath = join(app.getPath('userData'), 'config.json');
    console.log('Writing config...');
    return await fs.promises.writeFile(configFilePath, content, { encoding: 'utf8' });
}
