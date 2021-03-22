import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };
const palette = {
    primary: {
        500: "#4379FB"
    }
};

const breakpoints = createBreakpoints({
    sm: "40em",
    md: "52em",
    lg: "64em",
    xl: "80em"
});

const theme = extendTheme({
    config: {
        useSystemColorMode: true
    },
    colors: {
        ...palette,
        black: "#16161D"
    },
    fonts,
    breakpoints
    // components: {
    //     Button: {
    //         // 3. We can add a new visual variant
    //         variants: {
    //             "with-shadow": {
    //                 bg: "red.400",
    //                 boxShadow: "0 0 2px 2px #efdfde"
    //             },
    //             // 4. We can override existing variants
    //             solid: props => ({
    //                 color: "white",
    //                 bg: props.colorMode === "dark" ? "blue.300" : palette.primary
    //             })
    //         }
    //     }
    // }
});

export default theme;
