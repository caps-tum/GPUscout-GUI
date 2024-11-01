import { app } from 'electron';
import { join } from 'path';
import * as fs from 'node:fs';
import { APP_CONFIG_PATH, SAVED_ANALYSES_CONFIG_PATH, SAVED_ANALYSES_DATA_PATH } from '../config/files';

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
    const storedAnalysesPath = join(dataPath, SAVED_ANALYSES_DATA_PATH);
    const storedAnalysesConfigFilePath = join(dataPath, SAVED_ANALYSES_CONFIG_PATH);
    const configFilePath = join(dataPath, APP_CONFIG_PATH);

    if (!fs.existsSync(storedAnalysesPath)) {
        await fs.promises.mkdir(storedAnalysesPath);
    }
    if (!fs.existsSync(configFilePath)) {
        await fs.promises.writeFile(configFilePath, '{}');
    }
    if (!fs.existsSync(storedAnalysesConfigFilePath)) {
        await fs.promises.writeFile(storedAnalysesConfigFilePath, '[]');
    }
    console.log('Checked file structure');
}

/**
 * @returns {Promise<String>}
 */
export async function getConfig() {
    const configFilePath = join(app.getPath('userData'), APP_CONFIG_PATH);
    console.log('Reading config...');
    return await fs.promises.readFile(configFilePath, { encoding: 'utf8' });
}

/**
 * @param event {Object}
 * @param content {String}
 * @returns {Promise<void>}
 */
export async function setConfig(event, content) {
    const configFilePath = join(app.getPath('userData'), APP_CONFIG_PATH);
    console.log('Writing config...');
    return await fs.promises.writeFile(configFilePath, content, { encoding: 'utf8' });
}

/**
 * @returns {Promise<Object>}
 */
export async function getRecentAnalyses() {
    const configFilePath = join(app.getPath('userData'), SAVED_ANALYSES_CONFIG_PATH);
    console.log('Reading recent analyses...');
    return JSON.parse(await fs.promises.readFile(configFilePath, { encoding: 'utf8' }));
}

/**
 * @param event {Object}
 * @param analysis {{id: Number, title: String, num_kernels: Number, num_optimizations: Number, date_created: String, path: String}}
 * @returns {Promise<void>}
 */
export async function addRecentAnalysis(event, analysis) {
    const configFilePath = join(app.getPath('userData'), SAVED_ANALYSES_CONFIG_PATH);
    const data = JSON.parse(await fs.promises.readFile(configFilePath, { encoding: 'utf8' }));
    data.push(analysis);
    await fs.promises.writeFile(configFilePath, JSON.stringify(data), { encoding: 'utf8' });
    console.log('Added recent analysis');
}

/**
 * @param event {Object}
 * @param analysisID {Number}
 * @returns {Promise<void>}
 */
export async function removeRecentAnalysis(event, analysisID) {
    const configFilePath = join(app.getPath('userData'), SAVED_ANALYSES_CONFIG_PATH);
    let data = JSON.parse(await fs.promises.readFile(configFilePath, { encoding: 'utf8' }));
    data = data.filter((analysis) => analysis['id'] !== analysisID);
    await fs.promises.writeFile(configFilePath, JSON.stringify(data), { encoding: 'utf8' });
    console.log('Removed recent analysis');
}

/**
 * @param event {Object}
 * @param folderPath {String}
 * @returns {Promise<String[]>}
 */
export async function getAnalysesInFolder(event, folderPath) {
    const folderContent = await getFolderContent(event, folderPath);
    const analysisTitles = folderContent
        .filter((file) => file.endsWith('.gscout'))
        .map((file) => file.replace('.gscout', ''));

    return analysisTitles;
}

/**
 * @param event {Object}
 * @param filePath {String}
 * @returns {Promise<String>}
 */
export async function getFileContent(event, filePath) {
    console.log(filePath);
    return await fs.promises.readFile(filePath, {
        encoding: 'utf8'
    });
}
