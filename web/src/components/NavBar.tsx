import React from "react";
import NextLink from "next/link";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLogoutMutation, useMeQuery } from "generated/graphql";
import { DarkModeSwitch } from "components/DarkModeSwitch";
import { isServer } from "utils/isServer";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    });

    let body = null;
    if (fetching) {
        // data is loading
    } else if (!data?.me) {
        // user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={4} color="white">
                        Login
                    </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">Register</Link>
                </NextLink>
            </>
        );
    } else {
        // user is logged in
        body = (
            <>
                <Box mr={4} color="white">
                    Hi, {data.me.name} 👋
                </Box>
                <Button variant="link" onClick={() => logout()} isLoading={logoutFetching} color="white">
                    Logout
                </Button>
            </>
        );
    }

    return (
        <Flex bg="primary.500" p={4} ml={"auto"} position="sticky" zIndex={1} top={0}>
            <Box>
                <NextLink href="/">
                    <Link color="white" fontWeight="bold">
                        Board App
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
    );
};

export default NavBar;
