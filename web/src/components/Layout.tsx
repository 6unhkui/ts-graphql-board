import React from "react";
import { Box } from "@chakra-ui/layout";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutProps {
    variant?: WrapperVariant;
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
    return (
        <Box>
            <NavBar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </Box>
    );
};

export default Layout;
