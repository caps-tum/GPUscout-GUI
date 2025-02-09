/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains the definitions for all memory graphs used in the UI
 */
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
 * This object contains the definitions of all memory graphs for different analyses.
 * @type {Object.<String, MemoryGraph>}
 */
export const MEMORY_GRAPH_DEFINITION = {
    global_local_caches: new MemoryGraph(
        3,
        [new Node(new NodeTextContent('Kernel')).setRowSpan(3)],
        [
            new Arrow(METRICS.global_loads_instructions.name),
            new Arrow(METRICS.local_loads_instructions.name).addSpaceAbove()
        ],
        [new Node(new NodeTextContent('Global Memory')), new Node(new NodeTextContent('Local Memory')).addSpaceAbove()],
        [
            new Arrow(METRICS.global_loads_to_l1_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.local_loads_to_l1_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.global_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                ),
                new NodeTextContent('L1 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.local_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [
            new Arrow(METRICS.global_loads_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.local_loads_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeTextContent('L2 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.general_loads_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [new Arrow(METRICS.general_loads_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()],
        [new Node(new NodeTextContent('DRAM\n{size}')).setRowSpan(3)]
    ),
    texture_memory: new MemoryGraph(
        3,
        [new Node(new NodeTextContent('Kernel')).setRowSpan(3)],
        [new Arrow(METRICS.texture_instructions.name), new Arrow(METRICS.global_loads_instructions.name).addSpaceAbove()],
        [new Node(new NodeTextContent('Texture Memory')), new Node(new NodeTextContent('Global Memory')).addSpaceAbove()],
        [
            new Arrow(METRICS.texture_loads_to_l1_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.global_loads_to_l1_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeMetricContent(
                    METRICS.texture_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                ),
                new NodeTextContent('L1 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.global_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [
            new Arrow(METRICS.texture_loads_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.global_loads_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeTextContent('L2 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.general_loads_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            ).setRowSpan(3)
        ],
        [
            new Arrow(METRICS.texture_loads_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT),
            new Arrow(METRICS.general_loads_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [new Node(new NodeTextContent('DRAM\n{size}')).setRowSpan(3)]
    ),
    atomics: new MemoryGraph(
        1,
        [new Node(new NodeTextContent('Global Memory'))],
        [new Arrow(METRICS.global_atomic_to_l1_bytes.name)],
        [
            new Node(
                new NodeTextContent('L1 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.global_atomic_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.global_atomics_l1_to_l2_bytes.name)],
        [
            new Node(
                new NodeTextContent('L2 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.global_atomics_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.global_atomics_l2_to_dram_bytes.name)],
        [new Node(new NodeTextContent('DRAM\n{size}'))]
    ),
    global_caches: new MemoryGraph(
        1,
        [new Node(new NodeTextContent('Kernel'))],
        [new Arrow(METRICS.global_loads_instructions.name)],
        [new Node(new NodeTextContent('Global Memory'))],
        [new Arrow(METRICS.global_loads_to_l1_bytes.name).setDirection(DIRECTION.LEFT)],
        [
            new Node(
                new NodeTextContent('L1 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.global_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.global_loads_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT)],
        [
            new Node(
                new NodeTextContent('L2 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.general_loads_l2_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            )
        ],
        [new Arrow(METRICS.general_loads_l2_to_dram_bytes.name).setDirection(DIRECTION.LEFT)],
        [new Node(new NodeTextContent('DRAM\n{size}'))]
    ),
    complete: new MemoryGraph(
        7,
        [new Node(new NodeTextContent('Kernel')).setRowSpan(7)],
        [
            new Arrow(METRICS.shared_loads_instructions.name, METRICS.shared_stores_instructions.name).setDirection(
                DIRECTION.BOTH
            ),
            new Arrow(METRICS.global_loads_instructions.name, METRICS.global_stores_instructions.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceAbove(),
            new Arrow(METRICS.local_loads_instructions.name, METRICS.local_stores_instructions.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceAbove(),
            new Arrow(METRICS.texture_instructions.name).setDirection(DIRECTION.RIGHT).addSpaceAbove()
        ],
        [
            new Node(new NodeTextContent('Shared Memory')),
            new Node(new NodeTextContent('Global Memory')).addSpaceAbove(),
            new Node(new NodeTextContent('Local Memory')).addSpaceAbove(),
            new Node(new NodeTextContent('Texture Memory')).addSpaceAbove()
        ],
        [
            new Spacer(),
            new Arrow(METRICS.global_loads_to_l1_bytes.name, METRICS.global_stores_to_l1_bytes.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceAbove(),
            new Arrow(METRICS.local_loads_to_l1_bytes.name, METRICS.local_stores_to_l1_bytes.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceAbove(),
            new Arrow(METRICS.texture_loads_to_l1_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeTextContent('L1 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.global_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                ),
                new NodeMetricContent(
                    METRICS.local_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                ),
                new NodeMetricContent(
                    METRICS.texture_loads_l1_cache_hit_perc.name,
                    '{value} hit rate',
                    '{comp_value} vs {value} hit rate'
                )
            ).setRowSpan(7)
        ],
        [
            new Spacer(),
            new Arrow(METRICS.global_loads_l1_to_l2_bytes.name, METRICS.global_stores_l1_to_l2_bytes.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceAbove(),
            new Arrow(METRICS.local_loads_l1_to_l2_bytes.name, METRICS.local_stores_l1_to_l2_bytes.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceAbove(),
            new Arrow(METRICS.texture_loads_l1_to_l2_bytes.name).setDirection(DIRECTION.LEFT).addSpaceAbove()
        ],
        [
            new Node(
                new NodeTextContent('L2 Cache\n{size}'),
                new NodeMetricContent(
                    METRICS.general_loads_l2_cache_hit_perc.name,
                    '{value} load hit rate',
                    '{comp_value} vs {value} load hit rate'
                ),
                new NodeMetricContent(
                    METRICS.general_stores_l2_cache_hit_perc.name,
                    '{value} store hit rate',
                    '{comp_value} vs {value} store hit rate'
                )
            ).setRowSpan(7)
        ],
        [
            new Spacer(),
            new Spacer(),
            new Arrow(METRICS.general_loads_l2_to_dram_bytes.name, METRICS.general_stores_l2_to_dram_bytes.name)
                .setDirection(DIRECTION.BOTH)
                .addSpaceBelow()
                .addSpaceAbove(),
            new Spacer(),
            new Spacer()
        ],
        [new Spacer(), new Spacer(), new Spacer(), new Node(new NodeTextContent('DRAM\n{size}'))]
    ).makeLarge()
};
