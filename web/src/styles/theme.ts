import { ColorMode, extendTheme, ThemingProps } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };
const palette = {
    primary: {
        200: "#719bff",
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
        // useSystemColorMode: true
    },
    colors: {
        ...palette,
        black: "#16161D"
    },
    fonts,
    breakpoints,
    components: {
        Textarea: {
            baseStyle: {
                minHeight: "300px"
            }
        },
        Button: {
            variants: {
                solid: {
                    color: "white",
                    bg: "primary.500",
                    _hover: {
                        bg: "primary.200"
                    }
                },
                outline: {
                    color: "primary.500",
                    borderColor: "primary.500"
                }
            }
        }
    }
});

export default theme;
