export class MemoryGraph {
    /**
     * @param {Number} rows
     * @param {...MemoryGraphElement} content
     */
    constructor(rows, ...content) {
        this.rows = rows;
        this.content = content;
        this.large = false;
    }

    makeLarge() {
        this.large = true;
        return this;
    }
}

class NodeContent {
    constructor() {
        this.bold = false;
    }
}

class MemoryGraphElement {
    constructor() {
        this.spaceAbove = false;
        this.spaceBelow = false;
    }

    addSpaceAbove() {
        this.spaceAbove = true;
        return this;
    }

    addSpaceBelow() {
        this.spaceBelow = true;
        return this;
    }
}

export class Node extends MemoryGraphElement {
    /**
     * @param {...NodeContent} content
     */
    constructor(...content) {
        super();
        this.content = content;
        this.rowSpan = 1;
    }

    /**
     * @param {Number} rowSpan
     */
    setRowSpan(rowSpan) {
        this.rowSpan = rowSpan;
        return this;
    }
}

export class NodeTextContent extends NodeContent {
    constructor(title, bold = true) {
        super();
        this.title = title;
        this.bold = bold;
    }
}

export class NodeMetricContent extends NodeContent {
    constructor(metric, format = '{value}', comparisonFormat = '{value} vs {comp_value}') {
        super();
        this.metric = metric;
        this.format = format;
        this.comparisonFormat = comparisonFormat;
        this.bold = false;
    }
}

export const DIRECTION = {
    RIGHT: 1,
    LEFT: 2,
    BIDIRECTIONAL: 3,
    BOTH: 4
};

export class Arrow extends MemoryGraphElement {
    constructor(metric, metricBottom = undefined) {
        super();
        this.metric = metric;
        this.metricBottom = metricBottom;
        this.direction = DIRECTION.RIGHT;
    }

    setDirection(direction) {
        this.direction = direction;
        return this;
    }
}

export class Spacer extends MemoryGraphElement {}
