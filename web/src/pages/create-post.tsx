import React from "react";
import { Box, Heading } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "components/InputField";
import { Button } from "@chakra-ui/button";
import { useCreatePostMutation } from "generated/graphql";
import { useRouter } from "next/router";
import { useIsAuth } from "hooks/useIsAuth";
import { withApollo } from "utils/withApollo";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    content: Yup.string().required("Required")
});

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const [createPost] = useCreatePostMutation();

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
                    const { errors } = await createPost({
                        variables: { input: values },
                        update: cache => {
                            cache.evict({ fieldName: "posts" });
                        }
                    });
                    if (!errors) {
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

export default withApollo({ ssr: false })(CreatePost);
