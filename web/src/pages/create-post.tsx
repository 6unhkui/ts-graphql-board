import React, { useState } from "react";
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
import UploadImage from "components/UploadImage";
import ko from "yup-locale-ko";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    content: Yup.string().required()
});

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const [createPost] = useCreatePostMutation();
    const [images, setImages] = useState<string[]>([]);

    return (
        <Layout variant="small" title="Create Post">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    게시글 작성
                </Heading>
            </Box>

            <UploadImage
                images={images}
                onChangeImage={(image: string) => setImages(state => [image, ...state])}
                onRemoveImage={(image: string) => setImages(state => state.filter(v => v !== image))}
                mb={8}
            />

            <Formik
                initialValues={{ title: "", content: "" }}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async values => {
                    const { errors } = await createPost({
                        variables: { input: { ...values, images } },
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
                        <InputField name="title" label="제목" placeholder="제목을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="content" label="내용" textarea placeholder="내용를 입력하세요." />
                        </Box>

                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            작성하기
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(CreatePost);
