
export const assemblyInstructionRegex = new RegExp(
    '^' +
    '\\s+' +
    '([^\\s]+)' +
    '(.*?)//' +
    '\\s*' +
    '(.*?):' +
    '.*'
);

// If one would want to change back to the demangled implementation
export const regexKrnNameDemangled = new RegExp(
    '^;' +                  // leading ';'
    '\\s' +                         // one space
    '(\\w+)' +                      // kernel name (group 1)
    '\\([\\w,*\\s]*\\)' +           // parameter list (...)
    '\\(\\):' +                     // ()():
    '\\s*'                          // optional trailing spaces
);

// Extracts the kernel name out of the object file
export const regexKrnName = new RegExp(
    "^;" +      // leading ';'
    "\\s" +             // matches leading whitespace
    "(_+Z\\d+" +        // matches _Z<digits> (group 1)
    "\\w+)" +           // matches kernel name  (group 1)
    "\\(\\)" +          // matches ()
    ":\\s*"             // matches : and following whitespaces
);

// matches lines containing source code location information
// ; /opt/rocm-6.3.4/lib/llvm/bin/../../../include/hip/amd_detail/amd_hip_runtime.h:275
export const regexLoc = new RegExp(
    '^;' +                   // leading ';'
    '\\s' +                         // one space
    '(.+\\.(?:cpp|hpp|h)):' +   // filename (group 1)
    '(\\d+)' +        // line number (group 2)
    '\\s*'            // optional trailing spaces
);

// matches lines containing a branch label
// 0000000000001a94 <L0>:
export const regexBrcLbl = new RegExp(
    '^([0-9a-z]{16})' +  // 16 hex chars (0000000000001a94) of address (group 1)
    '\\s' +             // one space
    '<(L[0-9][0-9]?)>' + // <L0>, <L01>, etc (group 2)
    ':\\s*'              // : followed by optional trailing spaces
);

// matches lines containing assembly instructions
//      v_mul_f32_e32 v12, 0x3dcccccd, v14                         // 0000000027C4: 0A181CFF 3DCCCCCD
export const regexAssemblyInstruction = new RegExp(
    '^' +                                        // regex must match from the beginning of the string
    '\\s+' +                                     // matches any leading whitespace (at least one)
    '([^\\s]+)' +                                // matches the instruction (group 1)
    '(.*?)\\/\\/' +                              // matches any following until // is encountered
    '\\s*' +                                     // matches the following whitespaces
    '(.*?):' +                                   // matches the address (group 2)
    '.*'                                         // matches anything following
);