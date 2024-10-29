export class Topology {
    constructor(data) {
        data = data.split('\n').map((line) => line.split(';').map((e) => e.replaceAll('"', '')));
        this.gpuTitle = data[0][4];

        this.streamingMultiprocessors = parseInt(data[1][4]);
        this.cores = parseInt(data[1][6]);
        this.coresPerSM = parseInt(data[1][8]);

        this.registersPerThreadBlock = parseInt(data[2][2]);
        this.registersPerSM = parseInt(data[2][5]);

        this.l1Size = Math.round(parseFloat(data[4][2]));
        this.l1SizeUnit = data[4][3].trim();
        this.l2Size = Math.round(parseFloat(data[5][2]));
        this.l2SizeUnit = data[5][3].trim();
        this.textureCacheSize = Math.round(parseFloat(data[6][2]));
        this.textureCacheSizeUnit = data[6][3].trim();
        this.readOnlyCacheSize = Math.round(parseFloat(data[7][2]));
        this.ReadOnlyCacheSizeUnit = data[7][3].trim();
        this.constantL1Size = Math.round(parseFloat(data[8][2]));
        this.constantL1SizeUnit = data[8][3].trim();
        this.dramSize = Math.round(parseFloat(data[10][2]));
        this.dramSizeUnit = data[10][3].trim();
        this.sharedMemorySize = Math.round(parseFloat(data[11][2]));
        this.sharedMemoryUnit = data[11][3].trim();
    }
}
