import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import { NextPage } from "next";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
};

export default MyApp;
