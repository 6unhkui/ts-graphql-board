import { Box } from "@chakra-ui/layout";
import { NextPage } from "next";
import React from "react";
import { WarningIcon } from "@chakra-ui/icons";

interface Error {
    statusCode?: number;
}

const Error: NextPage<Error> = ({ statusCode }) => {
    return (
        <Box textAlign="center" mt={20}>
            <WarningIcon fontSize="xxx-large" />
            <Box my={4}>{statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}</Box>
        </Box>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
