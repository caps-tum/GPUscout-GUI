import {
    Arrow,
    DIRECTION,
    MemoryGraph,
    Node,
    NodeMetricContent,
    NodeTextContent,
    Spacer
} from '../renderer/src/utils/MemoryGraphComponents';
import { METRICS } from './metrics';

/**
 * This object contains the definitions of all memory graphs for different analyses. Configuration is as follows:
 * - Each memory graph is a list, with each list entry defining one column of the memory graph
 * - Each column definition is also a list, with each list entry defining a graph element (nodes or arrows)
 * - Graph elements are defined as follows:
 *   - Small graph nodes: Marked with the "size: 'small'" attribute. The title and bold attributes specify the text of the node as well as if this text should be bold
 *   - Large graph nodes: If none of the entries of a column definition has the "size: 'small'" attribute, they are merged into one large node, with the text of the individual nodes being displayed from top to bottom.
 *     Entries can have either a title attribute specifying text (again bold or not), or be formatted depending on a metric value.
 *     When formatting using metric values, the metric attribute specifies the name of the metric to use, with the format and comparison_format attributes specifying the format string the metric values get inserted into ({value} for the current metric value, {comp_value} for the comparison metric value, {diff_arrow} for an arrow indicating the difference of both).
 *   - The first and last column of a memory graph have to contain nodes, with every other column being interpreted as arrows. Arrow nodes can have either a title or metric associated with them.
 */
export const MEMORY_GRAPH_DEFINITION = {
    global_local_caches: new MemoryGraph(
        3,
        [new Node(new NodeTextContent('Kernel')).setRowSpan(3)],
        [
            new Arrow(METRICS.instructions_global_loads.name),
            new Arrow(METRICS.instructions_local_loads.name).addSpaceAbove()
        ],
        [new Node(new NodeTextContent('Global Memory')), new Node(new NodeTextContent('Local Memory')).addSpaceAbove()],
        [
            new Arrow(METRICS.load_data_global_to_l1_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.load_data_local_to_l1_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.load_data_global_to_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeTextContent('L1 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_local_to_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [
            new Arrow(METRICS.load_data_global_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.load_data_local_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeTextContent('L2 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [new Arrow(METRICS.load_data_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()],
        [new Node(new NodeTextContent('DRAM {size}')).setRowSpan(3)]
    ),
    texture_memory: new MemoryGraph(
        3,
        [new Node(new NodeTextContent('Kernel')).setRowSpan(3)],
        [
            new Arrow(METRICS.texture_data_kernel_to_tex_instr.name),
            new Arrow(METRICS.instructions_global_loads.name).addSpaceAbove()
        ],
        [new Node(new NodeTextContent('Texture Memory')), new Node(new NodeTextContent('Global Memory')).addSpaceAbove()],
        [
            new Arrow(METRICS.texture_data_tex_to_l1_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.load_data_global_to_l1_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.texture_data_tex_to_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeTextContent('L1 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_global_to_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [
            new Arrow(METRICS.texture_data_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.load_data_global_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.texture_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeTextContent('L2 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [new Arrow(METRICS.texture_data_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()],
        [new Node(new NodeTextContent('DRAM {size}')).setRowSpan(3)]
    ),
    atomics: new MemoryGraph(
        1,
        [new Node(new NodeTextContent('Global Memory'))],
        [new Arrow(METRICS.atomic_data_global_to_l1_red_atom_bytes.name)],
        [
            new Node(
                new NodeTextContent('L1 Cache {size}'),
                new NodeMetricContent(
                    METRICS.atomic_data_global_to_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.atomic_data_l1_to_l2_bytes.name)],
        [
            new Node(
                new NodeTextContent('L2 Cache {size}'),
                new NodeMetricContent(
                    METRICS.atomic_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.atomic_data_l2_to_dram_bytes.name)],
        [new Node(new NodeTextContent('DRAM {size}'))]
    ),
    global_caches: new MemoryGraph(
        1,
        [new Node(new NodeTextContent('Kernel'))],
        [new Arrow(METRICS.instructions_global_loads.name)],
        [new Node(new NodeTextContent('Global Memory'))],
        [new Arrow(METRICS.load_data_global_to_l1_bytes.name).setDirection(DIRECTION.LEFT)],
        [
            new Node(
                new NodeTextContent('L1 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_global_to_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.load_data_global_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT)],
        [
            new Node(
                new NodeTextContent('L2 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.load_data_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT)],
        [new Node(new NodeTextContent('DRAM {size}'))]
    ),
    complete: new MemoryGraph(
        9,
        [new Node(new NodeTextContent('Kernel')).setRowSpan(9)],
        [
            new Arrow(METRICS.instructions_total.name).setDirection(DIRECTION.BIDIRECTIONAL),
            new Arrow(METRICS.instructions_total.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove(),
            new Arrow(METRICS.instructions_total.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove(),
            new Arrow(METRICS.instructions_total.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove(),
            new Arrow(METRICS.instructions_total.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove()
        ],
        [
            new Node(new NodeTextContent('Global Memory')),
            new Node(new NodeTextContent('Local Memory')).addSpaceAbove(),
            new Node(new NodeTextContent('Shared Memory')).addSpaceAbove(),
            new Node(new NodeTextContent('Texture Memory')).addSpaceAbove(),
            new Node(new NodeTextContent('Surface Memory')).addSpaceAbove()
        ],
        [
            new Arrow(METRICS.load_data_global_to_l1_bytes.name).setDirection(DIRECTION.BIDIRECTIONAL),
            new Arrow(METRICS.load_data_global_to_l1_bytes.name)
                .setDirection(DIRECTION.BIDIRECTIONAL)
                .addSpaceAbove()
                .addSpaceBelow(),
            new Spacer(),
            new Arrow(METRICS.load_data_global_to_l1_bytes.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove(),
            new Arrow(METRICS.load_data_global_to_l1_bytes.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeTextContent('L1 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            ).setRowSpan(9)
        ],
        [
            new Arrow(METRICS.load_data_local_l1_to_l2_bytes.name).setDirection(DIRECTION.BIDIRECTIONAL),
            new Arrow(METRICS.load_data_local_l1_to_l2_bytes.name)
                .setDirection(DIRECTION.BIDIRECTIONAL)
                .addSpaceAbove()
                .addSpaceBelow(),
            new Spacer(),
            new Arrow(METRICS.load_data_local_l1_to_l2_bytes.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove(),
            new Arrow(METRICS.load_data_local_l1_to_l2_bytes.name).setDirection(DIRECTION.BIDIRECTIONAL).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeTextContent('L2 Cache {size}'),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                ),
                new NodeMetricContent(
                    METRICS.load_data_l1_to_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{value} vs {comp_value} hit rate'
                )
            ).setRowSpan(9)
        ],
        [
            new Spacer(),
            new Spacer(),
            new Spacer(),
            new Arrow(METRICS.load_data_l2_to_dram_bytes.name)
                .setDirection(DIRECTION.BIDIRECTIONAL)
                .addSpaceBelow()
                .addSpaceAbove(),
            new Spacer(),
            new Spacer(),
            new Spacer()
        ],
        [new Node(new NodeTextContent('DRAM {size}')).setRowSpan(9)]
    )
};
