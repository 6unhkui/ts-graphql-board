import { Box } from "@chakra-ui/react";

export type WrapperVariant = "small" | "regular" | "large";

interface WrapperProps {
    children: React.ReactNode;
    variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
    return (
        <Box mt="8" mx="auto" px={4} maxW={variant === "regular" ? "800px" : "450px"} w="100%">
            {children}
        </Box>
    );
};

export default Wrapper;
