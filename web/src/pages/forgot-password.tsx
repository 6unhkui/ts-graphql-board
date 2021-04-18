import { Button } from "@chakra-ui/button";
import { Box, Center, Heading } from "@chakra-ui/layout";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import { useForgotPasswordMutation } from "generated/graphql";
import React, { useState } from "react";
import { withApollo } from "utils/withApollo";
import * as Yup from "yup";
import NextLink from "next/link";
import ko from "yup-locale-ko";
import SEO from "components/SEO";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required()
});

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);

    return (
        <Layout variant="small">
            <SEO title="비밀번호 찾기" />
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    비밀번호 찾기
                </Heading>
            </Box>
            <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={async values => {
                    await forgotPassword({ variables: values });
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ? (
                        <Box textAlign="center">
                            존재하는 계정이라면, 입력한 메일 주소로 메일이 정상적으로 전송되었습니다.
                            <Center mt={4}>
                                <NextLink href="/">
                                    <Button>메인으로 가기</Button>
                                </NextLink>
                            </Center>
                        </Box>
                    ) : (
                        <Form>
                            <InputField name="email" label="이메일" placeholder="이메일을 입력하세요." />

                            <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                                비밀번호 찾기
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(ForgotPassword);
