export class MemoryGraph {
    /**
     * @param {Number} rows The amount of rows this graph should have
     * @param {...MemoryGraphElement} content The individual column definitions
     */
    constructor(rows, ...content) {
        this.rows = rows;
        this.content = content;
        this.large = false;
    }

    /**
     * Used for memory graphs in popups
     * @returns {MemoryGraph}
     */
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

    /**
     * Add a spacer above the element
     * @returns {MemoryGraphElement}
     */
    addSpaceAbove() {
        this.spaceAbove = true;
        return this;
    }

    /**
     * Add a spacer below the element
     * @returns {MemoryGraphElement}
     */
    addSpaceBelow() {
        this.spaceBelow = true;
        return this;
    }
}

export class Node extends MemoryGraphElement {
    /**
     * @param {...NodeContent} content 1 or more node content instances
     */
    constructor(...content) {
        super();
        this.content = content;
        this.rowSpan = 1;
    }

    /**
     * @param {Number} rowSpan The amount of rows this node should span
     * @returns {Node}
     */
    setRowSpan(rowSpan) {
        this.rowSpan = rowSpan;
        return this;
    }
}

export class NodeTextContent extends NodeContent {
    /**
     * @param {String} title The title of the element
     * @param {boolean} [bold=true] If the text should be bold
     */
    constructor(title, bold = true) {
        super();
        this.title = title;
        this.bold = bold;
    }
}

export class NodeMetricContent extends NodeContent {
    /**
     * @param {String} metric The name of the metric to display
     * @param {string} [format='{value}'] The format to display the metric value in
     * @param {string} [comparisonFormat='{value} vs {comp_value}'] The format to display the metric value and its comparison value in
     */
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
    /**
     * @param {String} metric The name of the metric to display
     * @param {String} [metricBottom=undefined] The name of a second metric to display
     */
    constructor(metric, metricBottom = undefined) {
        super();
        this.metric = metric;
        this.metricBottom = metricBottom;
        this.direction = DIRECTION.RIGHT;
    }

    /**
     * @param {Number} direction The direction the arrow(s) should point in
     * @returns {Arrow}
     */
    setDirection(direction) {
        this.direction = direction;
        return this;
    }
}

export class Spacer extends MemoryGraphElement {}
