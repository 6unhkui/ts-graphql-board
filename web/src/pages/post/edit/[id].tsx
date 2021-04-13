import React, { useState } from "react";
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
import { withApollo } from "utils/withApollo";
import * as Yup from "yup";
import UploadImage from "components/UploadImage";
import ko from "yup-locale-ko";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    content: Yup.string().required()
});

interface PostEditProps {}

const PostEdit: React.FC<PostEditProps> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const intId = useGetIntIdFromUrl();
    const { data, loading } = usePostQuery({ skip: intId === -1, variables: { id: intId } });
    const [updatePost] = useUpdatePostMutation();
    const imagesStoredInPost = data?.post?.images?.map(v => v.url);
    const [images, setImages] = useState<string[]>(imagesStoredInPost || []);

    if (loading || !data?.post) {
        return (
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
        );
    }

    return (
        <Layout variant="small" title="Edit Post">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    게시글 수정
                </Heading>
            </Box>

            <UploadImage
                images={images}
                onChangeImage={(image: string) => setImages(state => [image, ...state])}
                onRemoveImage={(image: string) => setImages(state => state.filter(v => v !== image))}
                mb={8}
            />
            <Formik
                initialValues={{
                    title: data?.post?.title || "",
                    content: data?.post?.content || ""
                }}
                validationSchema={validationSchema}
                onSubmit={async values => {
                    const newImages = images.filter(v => !imagesStoredInPost.includes(v));
                    const deleteImages = imagesStoredInPost.filter(v => !images.includes(v));
                    await updatePost({
                        variables: { input: { id: intId, ...values, images: newImages, deleteImages } },
                        update: cache => {
                            cache.evict({ id: "Post:" + intId });
                        }
                    });
                    router.back();
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" label="제목" placeholder="제목을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="content" label="내용" textarea placeholder="내용를 입력하세요." />
                        </Box>

                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            수정하기
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(PostEdit);
