import React from "react";
import { Box, Center, Divider } from "@chakra-ui/layout";

interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
    return (
        <Box>
            <Divider />
            <Center p={5} color="gray.500" fontSize="sm">
                {new Date().getFullYear()} © Board App.
            </Center>
        </Box>
    );
};

export default Footer;
