import React from "react";
import { Box } from "@chakra-ui/layout";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";
import Footer from "./Footer";

interface LayoutProps {
    variant?: WrapperVariant;
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
    return (
        <Box>
            <NavBar />
            <Wrapper variant={variant}>{children}</Wrapper>
            <Footer />
        </Box>
    );
};

export default Layout;
