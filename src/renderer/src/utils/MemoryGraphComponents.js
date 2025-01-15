/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines all classes involved in the creation of a memory graph
 */

/**
 * The base class of every memory graph
 * @class
 */
export class MemoryGraph {
    /**
     * @param {Number} rows The amount of rows this graph should have
     * @param {...MemoryGraphElement} content The individual column definitions
     */
    constructor(rows, ...content) {
        /**
         * The amount of rows of this graph
         * @type {Number}
         */
        this.rows = rows;
        /**
         * The individual column definitions
         * @type {MemoryGraphElement[]}
         */
        this.content = content;
        /**
         * Used for special formatting when graphs are displayed in popups
         * @type {Boolean}
         */
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

/**
 * A base class for the different kinds of graph node contents
 * @class
 */
class NodeContent {
    constructor() {
        /**
         * If the text on this node should be bold
         * @type {Boolean}
         */
        this.bold = false;
    }
}

/**
 * Base class for any gaph elements
 * @class
 */
class MemoryGraphElement {
    constructor() {
        /**
         * If a spacer should be inserted above the node
         * @type {Boolean}
         */
        this.spaceAbove = false;
        /**
         * If a spacer should be inserted below the node
         * @type {Boolean}
         */
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

/**
 * Defines a graph node
 * @class
 */
export class Node extends MemoryGraphElement {
    /**
     * @param {...NodeContent} content 1 or more node content instances
     */
    constructor(...content) {
        super();
        /**
         * The content of the node
         * @type {Boolean}
         */
        this.content = content;
        /**
         * How many rows the node should span
         * @type {Number}
         */
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

/**
 * Defines a textual node content
 * @class
 */
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

/**
 * @class
 */
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

/**
 * An enum defining the directions an arrow can take
 * @type {Object.<String, Number>}
 */
export const DIRECTION = {
    RIGHT: 1,
    LEFT: 2,
    BIDIRECTIONAL: 3,
    BOTH: 4
};

/**
 * Defines an arrow in the graph
 * @class
 */
export class Arrow extends MemoryGraphElement {
    /**
     * @param {String} metric The name of the metric to display
     * @param {String} [metricBottom=undefined] The name of a second metric to display
     */
    constructor(metric, metricBottom = undefined) {
        super();
        /**
         * The metric to display on the arrow
         * @type {String}
         */
        this.metric = metric;
        /**
         * A second metric to display on the arrow
         * @type {?String}
         */
        this.metricBottom = metricBottom;
        /**
         * The direction the arrow should point in
         * @type {Number}
         */
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

/**
 * Defines a spacer in the graph (an empty node)
 * @class
 */
export class Spacer extends MemoryGraphElement {}
