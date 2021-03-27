import React, { useEffect } from "react";
import { Box, Heading } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "components/InputField";
import { Button } from "@chakra-ui/button";
import { useCreatePostMutation, useMeQuery } from "generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
import { useIsAuth } from "hooks/useIsAuth";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    content: Yup.string().required("Required")
});

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    return (
        <Layout variant="small" title="Create Post">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Create Post
                </Heading>
            </Box>
            <Formik
                initialValues={{ title: "", content: "" }}
                validationSchema={validationSchema}
                onSubmit={async values => {
                    const { error } = await createPost({ input: values });
                    if (!error) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" label="Title" placeholder="제목을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="content" label="Content" textarea placeholder="내용를 입력하세요." />
                        </Box>

                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            Create Post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
