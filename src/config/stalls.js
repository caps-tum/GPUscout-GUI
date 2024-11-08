import { formatStall } from '../renderer/src/utils/formatters';

/**
 * This list contains the definition of all stalls and their related information
 * - display_name: The title of the stall in the GUI
 * - format_function: The function used to format values of this stall
 * - help_text: The help text displayed in the help popup
 * - lower_better: If lower values are considered better (for comparisons)
 * Help texts are (with modifications) taken from https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html
 */
export const STALLS = {
    smsp__pcsamp_warps_issue_stalled_imc_miss: {
        display_name: 'IMC Miss',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for an immediate constant cache (IMC) miss, which means that data requested from constant memory was not yet available in the IMC and had to be requested from the slower device memory instead.
Because accesses to different addresses from threads within the same warp are serialized, cost scales linearly with the number of unuique addresses read by all threads within a warp. This makes using constant cache most effective in situations where threads in the same warp access only few distinct locations. If all threads of a warp access the same location, then constant memory can be as fast as a register access.
In the SASS code, immediate constants are encoded as c[bank][offset]. To reduce the number of IMC misses, review the use of constant memory in the SASS code at the locations of these stalls.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_long_scoreboard: {
        display_name: 'Long Scoreboard',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for a scoreboard dependency on a previous L1TEX (local, global, surface, texture) operation (in contrast to MIO operations in short scoreboard stalls). Scoreboarding manages dependencies, ensuring that instructions are not issued until the data they need is ready. Operations involving memory loads can often take multiple cycles to complete, so later instructions depending on the loaded data can only be issued when the data is available.
In the SASS code, look for the instruction producing the data being waited on. Generally, to reduce the number of cycles waiting on L1TEX data accesses, verify the memory access patterns are optimal for the target architecture, attempt to increase cache hit rates by increasing data locality (coalescing), or by changing the cache configuration. Moving frequently used data to shared memory can also help.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_short_scoreboard: {
        display_name: 'Short Scoreboard',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for a scoreboard dependency on a MIO (memory input/output) operation (in contrase to L1TEX operations in long scoreboard stalls). Scoreboarding manages dependencies, ensuring that instructions are not issued until the data they need is ready. Operations involving memory input and/or output can often take multiple cycles to complete, so later instructions depending on resulting data can only be issued when they have completed. The primary reason for a high number of short scoreboard stalls are typically memory operations to shared memory. Other reasons include frequent execution of special math instructions or dynamic branching (e.g. BRX, JMX).
To reduce the number of short scoreboaed stalls, check if there are shared memory operations and reduce bank conflicts, if found. Assigning frequently accessed values to variables can assist the compiler in using low-latency registers instead of direct memory accesses.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_no_instructions: {
        display_name: 'No Instructions',
        format_function: formatStall,
        help_text: `The warp was stalled waiting to be selected to fetch an instruction or waiting on an instruction cache miss. This situation typically arises when there are dependencies between instructions, and the warp scheduler has no other work (instructions or warps) available to hide the latency.
A high number of these stalls is no uncommon in very short kernels with less than one full wave of work in the grid.
To reduce the number of no instruction stalls, avoid excessively jumping across large blocks of assembly code, as this could lead to misses in the instruction cache.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_wait: {
        display_name: 'Wait',
        format_function: formatStall,
        help_text: `The warp was stalled waiting on a fixed latency execution dependency. Typically, this stall reason should be very low and only shows up as a top contributor in already highly optimized kernels.
To avoid wait stalls, try increasing the number of active warps, restructuring the code, or unrolling loops with the goal of hiding instruction latencies. Switching to lower latency instructions (e.g. using fast math compiler options) should also be considered.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_lg_throttle: {
        display_name: 'LG Throttle',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for the L1 instruction queue for local and global (LG) memory operations to be not full. Typically, this stall occurs only when executing local or global memory instructions extremely frequently.
To avoid LG throttle stalls, avoid redundant global memory accesses. Also try to avoid using thread-local memory by checking if dynamically indexed arrays are declared in local scope, of if the kernel has excessive register pressure causing by spills. If applicable, consider combining multiple lower-width memory operations into fewer wider memory operations and try interleaving memory operations and math instructions.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_selected: {
        display_name: 'Selected',
        format_function: formatStall,
        help_text: `The warp was selected by the micro scheduler and issued an instruction.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_not_selected: {
        display_name: 'Not Selected',
        format_function: formatStall,
        help_text: `The warp was stalled waiting to be selected to fetch an instruction or waiting on an instruction cache miss. This happend when eligible warps were not picked by the warp scheduler to issue in the current cycle, as another warp was selected.
High numbers of these stalls indicate there are a sufficient nmber of warps to cover warp latencies and the number of active warps could be reduced to possibly increase cache coherence and adta locality.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_math_pipe_throttle: {
        display_name: 'Math Pipe Throttle',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for the execution pipe to be available. This stall occurs when a specific math pipeline gets oversaturated due to all active warps executing their next instruction on it.
To avoid math pipe throttle stalls, the number of active warps should be increased to hide the existent latency. Changing the instructions used to utilize all available pipelines in a more balanced way can also help reduce these stalls.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_dispatch_stall: {
        display_name: 'Dispatch',
        format_function: formatStall,
        help_text: `The warp was stalled waiting on a dispatch stall. This happens when a warp has an instruction ready to issue, but the dispatcher holds back issuing the warp due to other conflicts or events.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_mio_throttle: {
        display_name: 'MIO Throttle',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for the memory input/output (MIO) instruction queue to be not full. Reasons for a saturated MIO pipeline include extreme utilization of special math instructions, dynamic branching as well as shared memory instructions.
To avoid mio throttle stalls, try to decrease utilization of these kinds of instructions. In the case of lots of shared memory accesses, using fewer but wider loads can reduce pipeline pressure.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_tex_throttle: {
        display_name: 'TEX Throttle',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for the L1 instruction queue for texture operations to be not full. This means the L1TEX pipeline is saturated and utilized too much.
To avoid tex throttle stalls, try issuing fewer texture fetches, surface loads, surface stores, or decoupled math operations. If applicable, consider combining multiple lower-width memory operations into fewer wider memory operations and try interleaving memory operations and math instructions. Consider converting texture lookups or surface loads into global memory lookups. Texture can accept four threads’ requests per cycle, whereas global accepts 32 threads.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_drain: {
        display_name: 'Drain',
        format_function: formatStall,
        help_text: `The warp was stalled after EXIT waiting for all outstanding memory operations to complete so that warp's resources can be freed. This typically occurs when a lot of data is written to memory towards the end of a kernel, when no or not many warps are left to hide this latency.
To avoid drain stalls, make sure the memory access patterns of these store operations are optimal for the target architecture and consider parallelized data reduction, if applicable.`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_branch_resolving: {
        display_name: 'Branch Resolving',
        format_function: formatStall,
        help_text: `The warp was stalled waiting for a branch target to be computed, and the warp program counter to be updated.
To avoid branch resolving stalls, the number of jump/branch operations, as well as general control flow divergence should be reduced, for example by reducing or coalescing conditionals in the code.`,
        lower_better: true
    },
    undefined: { display_name: 'Undefined', format_function: formatStall, help_text: '', lower_better: true }
};
