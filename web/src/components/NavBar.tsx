import React from "react";
import NextLink from "next/link";
import { Box, Divider, Flex, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLogoutMutation, useMeQuery } from "generated/graphql";
import { DarkModeSwitch } from "components/DarkModeSwitch";
import { isServer } from "utils/isServer";
import { useApolloClient } from "@apollo/client";
import { useColorMode, useColorModeValue, useTheme } from "@chakra-ui/system";
import { SITE_META } from "../constants";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const titleTextColor = useColorModeValue("primary.500", "white");
    const navBarBgColor = useColorModeValue("gray.100", "gray.700");
    const [logout, { loading: logoutFetching }] = useLogoutMutation();
    const { data, loading } = useMeQuery({
        skip: isServer()
    });

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
                <NextLink href="/myinfo">
                    <Link mr={4}>Hi, {data.me.name} 👋</Link>
                </NextLink>
                <Button
                    variant="link"
                    onClick={async () => {
                        await logout({
                            update: cache => {
                                cache.reset();
                            }
                        });
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
                            {SITE_META.title}
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
