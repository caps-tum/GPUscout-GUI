export const CODE_BINARY_TOKEN_COLORS = {
    INSTRUCTION: 'bg-white', // The color of instruction tokens of a selected line
    REGISTER_1: 'bg-green-600', // The color of the first highlighted register of an occurrence
    REGISTER_2: 'bg-blue-600' // The color of the seconds highlighted register of an occurrence
};

export const CODE_STYLES = {
    OCCURRENCE: 'border-2 border-red-400', // The border around occurrence lines
    INFO_OCCURRENCE: 'border-2 border-blue-400', // The border around occurrence lines
    SELECTED_LINE: 'bg-primary/75', // The color of selected lines
    SELECTED_LINE_SECONDARY: 'bg-secondary', // The color of the corresponding lines of the selected line in the other code view
    HIGHLIGHTED_LINE_OCCURRENCE: 'bg-red-400', // The color of selected occurrence lines
    HIGHLIGHTED_LINE_OCCURRENCE_SECONDARY: 'bg-red-300', // The color of both secondary occurrence lines and the corresponding lines in the other code view
    HIGHLIGHTED_LINE_INFO: 'bg-blue-400', // The color of selected occurrence info lines
    HIGHLIGHTED_LINE_INFO_SECONDARY: 'bg-blue-300', // The color of both secondary occurrence info lines and the corresponding lines in the other code view
    SOURCE_LINE_WITHOUT_MAPPING: 'text-text/50'
};
