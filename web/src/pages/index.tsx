import { Box, Heading } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
import { usePostsQuery } from "generated/graphql";
import { NextPage } from "next";

const Index: NextPage = () => {
    const [{ data }] = usePostsQuery();
    return (
        <Layout variant="regular">
            <Heading fontSize="6rem">ts-graphql-board-app</Heading>
            {!data ? <div>Loading...</div> : data.posts.map(p => <Box key={p.id}>{p.title}</Box>)}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
