import { Box } from "@chakra-ui/react";

export type WrapperVariant = "small" | "regular" | "large";

interface WrapperProps {
    children: React.ReactNode;
    variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
    return (
        <Box mt={14} mb={20} mx="auto" px={4} maxW={variant === "regular" ? "800px" : "450px"} w="100%" minHeight="xl">
            {children}
        </Box>
    );
};

export default Wrapper;
