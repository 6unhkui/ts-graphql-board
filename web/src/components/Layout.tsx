import React from "react";
import { Box } from "@chakra-ui/layout";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";
import SEO from "./SEO";
import Footer from "./Footer";

interface LayoutProps {
    variant?: WrapperVariant;
    title?: string;
    description?: string;
}

const Layout: React.FC<LayoutProps> = ({ variant, children, ...props }) => {
    return (
        <Box>
            <SEO {...props} />
            <NavBar />
            <Wrapper variant={variant}>{children}</Wrapper>
            <Footer />
        </Box>
    );
};

export default Layout;
