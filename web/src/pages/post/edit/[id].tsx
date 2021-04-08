import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";
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
            {loading || !data?.post ? (
                <Box>
                    <Box mb={6}>
                        <Skeleton height="14px" width="25%" />
                        <Box padding={3} border="1px" mt={2} borderRadius="md" borderColor="gray.200">
                            <Skeleton height="20px" />
                        </Box>
                    </Box>

                    <Box>
                        <Skeleton height="14px" width="25%" />
                        <Box padding={3} border="1px" mt={2} borderRadius="md" borderColor="gray.200">
                            <SkeletonText noOfLines={8} spacing={4} skeletonHeight="20px" />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Formik
                    initialValues={{
                        title: data?.post?.title || "",
                        content: data?.post?.content || ""
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
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}
        </Layout>
    );
};

export default withApollo({ ssr: false })(PostEdit);
