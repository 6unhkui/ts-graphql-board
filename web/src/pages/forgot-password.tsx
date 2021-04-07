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

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Required")
});

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);

    return (
        <Layout variant="small" title="Forgot Password">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Forgot Password
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
                            만약 존재하는 계정이라면, 메일이 정상적으로 전송되었습니다.
                            <Center mt={4}>
                                <NextLink href="/">
                                    <Button>메인으로 가기</Button>
                                </NextLink>
                            </Center>
                        </Box>
                    ) : (
                        <Form>
                            <InputField name="email" label="Email" placeholder="이메일을 입력하세요." />

                            <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                                Forgot Password
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(ForgotPassword);
