import React from "react";
import NextLink from "next/link";
import { Box, Divider, Flex, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLogoutMutation, useMeQuery } from "generated/graphql";
import { DarkModeSwitch } from "components/DarkModeSwitch";
import { isServer } from "utils/isServer";
import { useApolloClient } from "@apollo/client";
import { useColorMode, useColorModeValue, useTheme } from "@chakra-ui/system";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const titleTextColor = useColorModeValue("primary.500", "white");
    const navBarBgColor = useColorModeValue("gray.100", "gray.700");
    const [logout, { loading: logoutFetching }] = useLogoutMutation();
    const { data, loading } = useMeQuery({
        skip: isServer()
    });
    const apolloClient = useApolloClient();

    let body = null;
    if (loading) {
        // data is loading
    } else if (!data?.me) {
        // user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={4}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
            </>
        );
    } else {
        // user is logged in
        body = (
            <>
                <Box mr={4}>Hi, {data.me.name} 👋</Box>
                <Button
                    variant="link"
                    onClick={async () => {
                        await logout();
                        await apolloClient.resetStore();
                    }}
                    isLoading={logoutFetching}
                >
                    Logout
                </Button>
            </>
        );
    }

    return (
        <Box ml={"auto"} position="sticky" zIndex={1} top={0} bg={navBarBgColor}>
            <Flex p={4}>
                {/* <Divider/> */}
                <Box>
                    <NextLink href="/">
                        <Link fontWeight="bold" color={titleTextColor}>
                            Memo
                        </Link>
                    </NextLink>
                </Box>
                <Flex ml={"auto"}>
                    {body}
                    <Box ml={4}>
                        <DarkModeSwitch />
                    </Box>
                </Flex>
            </Flex>
            <Divider />
        </Box>
    );
};

export default NavBar;
