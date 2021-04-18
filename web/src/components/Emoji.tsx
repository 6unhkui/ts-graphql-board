import { Box } from "@chakra-ui/layout";
import React from "react";

interface EmojiProps {
    mr?: number;
}

const Emoji: React.FC<EmojiProps> = ({ mr, children }) => {
    return (
        <Box as="span" role="img" mr={mr}>
            {children}
        </Box>
    );
};

export default Emoji;
