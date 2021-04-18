import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { DEFAULT_SEO } from "../constants";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <DefaultSeo {...DEFAULT_SEO} />
            <Component {...pageProps} />
        </ChakraProvider>
    );
};

export default MyApp;
