import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { Box, Center, Divider, Flex, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLogoutMutation, useMeQuery } from "generated/graphql";
import { DarkModeSwitch } from "components/DarkModeSwitch";
import { isServer } from "utils/isServer";
import { useColorModeValue } from "@chakra-ui/system";
import { SITE_NAME } from "../constants";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const textColor = useColorModeValue("primary.500", "white");
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const [logout, { loading: logoutFetching }] = useLogoutMutation();
    const { data, loading } = useMeQuery({
        skip: isServer()
    });
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        if (window.pageYOffset > 140) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.addEventListener("scroll", handleScroll);
        };
    }, []);

    let body = null;
    if (loading) {
        // data is loading
    } else if (!data?.me) {
        // user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={4}>로그인</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>회원가입</Link>
                </NextLink>
            </>
        );
    } else {
        // user is logged in
        body = (
            <>
                <NextLink href="/myinfo">
                    <Link mr={4}>{data.me.name}</Link>
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
                    로그아웃
                </Button>
            </>
        );
    }

    return (
        <Box ml={"auto"} position="sticky" zIndex={1} top={0} bg={bgColor} as="nav">
            {isScrolled ? (
                <Center p={4}>
                    <NextLink href="/">
                        <Link fontWeight="bold" color={textColor}>
                            {SITE_NAME}
                        </Link>
                    </NextLink>
                </Center>
            ) : (
                <Flex p={4}>
                    {/* <Divider/> */}
                    <Box>
                        <NextLink href="/">
                            <Link fontWeight="bold" color={textColor}>
                                {SITE_NAME}
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
            )}
            <Divider />
        </Box>
    );
};

export default NavBar;
