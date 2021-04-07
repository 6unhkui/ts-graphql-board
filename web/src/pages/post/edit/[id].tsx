import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import { usePostQuery, useUpdatePostMutation } from "generated/graphql";
import { useGetIntIdFromUrl } from "hooks/useGetIntIdFromUrl";
import { useIsAuth } from "hooks/useIsAuth";
import { useRouter } from "next/router";
import React from "react";
import { withApollo } from "utils/withApollo";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    content: Yup.string().required("Required")
});

interface PostEditProps {}

const PostEdit: React.FC<PostEditProps> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const intId = useGetIntIdFromUrl();
    const { data, loading } = usePostQuery({ skip: intId === -1, variables: { id: intId } });
    const [updatePost] = useUpdatePostMutation();

    return (
        <Layout variant="small" title="Edit Post">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Edit Post
                </Heading>
            </Box>
            {loading ? null : (
                <Formik
                    initialValues={{
                        title: data?.post?.title ? data?.post?.title : "",
                        content: data?.post?.content ? data?.post?.content : ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async values => {
                        await updatePost({
                            variables: { id: intId, ...values },
                            update: cache => {
                                cache.evict({ id: "Post:" + intId });
                            }
                        });
                        router.back();
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
            )}
        </Layout>
    );
};

export default withApollo({ ssr: false })(PostEdit);
