import React, { FC } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { render, RenderOptions } from "@testing-library/react";
import theme from "../src/styles/theme";

const ChakraRender: FC = ({ children }) => {
    return (
        <ChakraProvider resetCSS theme={theme}>
            {children}
        </ChakraProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "queries">) =>
    render(ui, { wrapper: ChakraRender, ...options });

export * from "@testing-library/react";
export { customRender as render };
