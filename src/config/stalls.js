/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains the definitions for all stalls, which are a result of the PC sampling
 */
import { formatStall } from '../renderer/src/utils/formatters';

const MORE_INFO = `

For more information visit <a target="_blank" href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#metrics-reference">https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#metrics-reference</a>`;

/**
 * Contains the definition of a single stall
 * @typedef {Object} StallDefinition
 * @property {String} display_name The name of the stall as is should be displayed in the UI
 * @property {Function} format_function A function that takes the value of the stall, as well as the percentage of the total stalls as inputs and returns a formatted string
 * @property {String} help_text A detailed description of the stall that is displayed in a popup when users wlick the help icon of the stall. Allows for html formatting
 * @property {Boolean} lower_better If a lower value should be considered better when comparing two GPUscout results
 */

/**
 * This list contains the definition of all stalls and their related information.
 * The key of this object has to correspond to the exact name of the stall as it is called in the GPUscout result.
 * Help texts are (with modifications) taken from https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html
 * @type {Object.<String, StallDefinition>}
 */
export const STALLS = {
    smsp__pcsamp_warps_issue_stalled_imc_miss: {
        display_name: 'IMC Miss Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for an immediate constant cache (IMC) miss, which means that data requested from constant memory was not yet available in the IMC and had to be requested from the slower device memory instead.
<b>Constant cache</b>
Because accesses to different addresses from threads within the same warp are serialized, cost scales linearly with the number of unuique addresses read by all threads within a warp. This makes using constant cache most effective in situations where threads in the same warp access only few distinct locations. If all threads of a warp access the same location, then constant memory can be as fast as a register access.
<b>Steps to avoid</b>
In the SASS code, immediate constants are encoded as c[bank][offset]. To reduce the number of IMC misses, review the use of constant memory in the SASS code at the locations of these stalls. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_long_scoreboard: {
        display_name: 'Long Scoreboard Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for a scoreboard dependency on a previous L1TEX (local, global, surface, texture) operation (in contrast to MIO operations in short scoreboard stalls). Scoreboarding manages dependencies, ensuring that instructions are not issued until the data they need is ready. Operations involving memory loads can often take multiple cycles to complete, so later instructions depending on the loaded data can only be issued when the data is available.
<b>Instruction to blame</b>
In the SASS code, look for the instruction producing the data being waited on.
<b>Steps to avoid</b>
Generally, to reduce the number of cycles waiting on L1TEX data accesses, verify the memory access patterns are optimal for the target architecture, attempt to increase cache hit rates by increasing data locality (coalescing), or by changing the cache configuration. Moving frequently used data to shared memory can also help. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_short_scoreboard: {
        display_name: 'Short Scoreboard Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for a scoreboard dependency on a MIO (memory input/output) operation (in contrase to L1TEX operations in long scoreboard stalls). Scoreboarding manages dependencies, ensuring that instructions are not issued until the data they need is ready. Operations involving memory input and/or output can often take multiple cycles to complete, so later instructions depending on resulting data can only be issued when they have completed.
<b>Reasons for frequent stalls</b>
The primary reason for a high number of short scoreboard stalls are typically memory operations to shared memory. Other reasons include frequent execution of special math instructions or dynamic branching (e.g. BRX, JMX).
<b>Steps to avoid</b>
To reduce the number of short scoreboaed stalls, check if there are shared memory operations and reduce bank conflicts, if found. Assigning frequently accessed values to variables can assist the compiler in using low-latency registers instead of direct memory accesses. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_no_instructions: {
        display_name: 'No Instructions Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting to be selected to fetch an instruction or waiting on an instruction cache miss. This situation typically arises when there are dependencies between instructions, and the warp scheduler has no other work (instructions or warps) available to hide the latency.
<b>Reasons for frequent stalls</b>
A high number of these stalls is no uncommon in very short kernels with less than one full wave of work in the grid.
<b>Steps to avoid</b>
To reduce the number of no instruction stalls, avoid excessively jumping across large blocks of assembly code, as this could lead to misses in the instruction cache. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_wait: {
        display_name: 'Wait Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting on a fixed latency execution dependency. Typically, this stall reason should be very low and only shows up as a top contributor in already highly optimized kernels.
<b>Steps to avoid</b>
To avoid wait stalls, try increasing the number of active warps, restructuring the code, or unrolling loops with the goal of hiding instruction latencies. Switching to lower latency instructions (e.g. using fast math compiler options) should also be considered. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_lg_throttle: {
        display_name: 'LG Throttle Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for the L1 instruction queue for local and global (LG) memory operations to be not full. Typically, this stall occurs only when executing local or global memory instructions extremely frequently.
<b>Steps to avoid</b>
To avoid LG throttle stalls, avoid redundant global memory accesses. Also try to avoid using thread-local memory by checking if dynamically indexed arrays are declared in local scope, of if the kernel has excessive register pressure causing by spills. If applicable, consider combining multiple lower-width memory operations into fewer wider memory operations and try interleaving memory operations and math instructions. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_selected: {
        display_name: 'Selected Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
The warp was selected by the micro scheduler and issued an instruction. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_not_selected: {
        display_name: 'Not Selected Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting to be selected to fetch an instruction or waiting on an instruction cache miss. This happend when eligible warps were not picked by the warp scheduler to issue in the current cycle, as another warp was selected.
<b>Steps to avoid</b>
High numbers of these stalls indicate there are a sufficient number of warps to cover warp latencies and the number of active warps could be reduced to possibly increase cache coherence and adta locality. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_math_pipe_throttle: {
        display_name: 'Math Pipe Throttle Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for the execution pipe to be available. This stall occurs when a specific math pipeline gets oversaturated due to all active warps executing their next instruction on it.
<b>Steps to avoid</b>
To avoid math pipe throttle stalls, the number of active warps should be increased to hide the existent latency. Changing the instructions used to utilize all available pipelines in a more balanced way can also help reduce these stalls. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_dispatch_stall: {
        display_name: 'Dispatch Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting on a dispatch stall. This happens when a warp has an instruction ready to issue, but the dispatcher holds back issuing the warp due to other conflicts or events. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_mio_throttle: {
        display_name: 'MIO Throttle Stalls',
        format_function: formatStall,
        help_text: `<b>Stalls</b>
This stall occurs when the current warp is waiting for the memory input/output (MIO) instruction queue to be not full. Reasons for a saturated MIO pipeline include extreme utilization of special math instructions, dynamic branching as well as shared memory instructions.
<b>Steps to avoid</b>
To avoid mio throttle stalls, try to decrease utilization of these kinds of instructions. In the case of lots of shared memory accesses, using fewer but wider loads can reduce pipeline pressure. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_tex_throttle: {
        display_name: 'TEX Throttle Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for the L1 instruction queue for texture operations to be not full. This means the L1TEX pipeline is saturated and utilized too much.
<b>Steps to avoid</b>
To avoid tex throttle stalls, try issuing fewer texture fetches, surface loads, surface stores, or decoupled math operations. If applicable, consider combining multiple lower-width memory operations into fewer wider memory operations and try interleaving memory operations and math instructions. Consider converting texture lookups or surface loads into global memory lookups. Texture can accept four threads’ requests per cycle, whereas global accepts 32 threads. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_drain: {
        display_name: 'Drain Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting after EXIT for all outstanding memory operations to complete so that warp's resources can be freed. This typically occurs when a lot of data is written to memory towards the end of a kernel, when no or not many warps are left to hide this latency.
<b>Steps to avoid</b>
To avoid drain stalls, make sure the memory access patterns of these store operations are optimal for the target architecture and consider parallelized data reduction, if applicable. ${MORE_INFO}`,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_branch_resolving: {
        display_name: 'Branch Resolving Stalls',
        format_function: formatStall,
        help_text: `<b>Description</b>
This stall occurs when the current warp is waiting for a branch target to be computed, and the warp program counter to be updated.
<b>Steps to avoid</b>
To avoid branch resolving stalls, the number of jump/branch operations, as well as general control flow divergence should be reduced, for example by reducing or coalescing conditionals in the code. ${MORE_INFO}`,
        lower_better: true
    },
    undefined: { display_name: 'Undefined', format_function: formatStall, help_text: '', lower_better: true }
};
