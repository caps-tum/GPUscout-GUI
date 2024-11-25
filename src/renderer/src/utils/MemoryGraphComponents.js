export class MemoryGraph {
    constructor(rows, ...content) {
        this.rows = rows;
        this.content = content;
    }
}

export class Node {
    constructor(...content) {
        this.content = content;
        this.rowSpan = 1;
        this.spaceAbove = false;
    }

    setRowSpan(rowSpan) {
        this.rowSpan = rowSpan;
        return this;
    }

    addSpaceAbove() {
        this.spaceAbove = true;
        return this;
    }
}

export class NodeTextContent {
    constructor(title, bold = true) {
        this.title = title;
        this.bold = bold;
    }
}

export class NodeMetricContent {
    constructor(metric, format = '{value}', comparisonFormat = '{value} vs {comp_value}') {
        this.metric = metric;
        this.format = format;
        this.comparisonFormat = comparisonFormat;
        this.bold = false;
    }
}

export const DIRECTION = {
    RIGHT: 1,
    LEFT: 2,
    BIDIRECTIONAL: 3
};

export class Arrow {
    constructor(metric) {
        this.metric = metric;
        this.direction = DIRECTION.RIGHT;
        this.spaceAbove = false;
        this.spaceBelow = false;
    }

    setDirection(direction) {
        this.direction = direction;
        return this;
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

export class Spacer {}
