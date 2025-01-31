import { useColorMode, Switch } from "@chakra-ui/react";

export const DarkModeSwitch: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    return <Switch top="1rem" right="1rem" color="green" isChecked={isDark} onChange={toggleColorMode} />;
};
