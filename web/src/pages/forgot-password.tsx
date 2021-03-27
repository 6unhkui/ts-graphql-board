import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import { useForgotPasswordMutation } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { createUrqlClient } from "utils/createUrqlClient";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Required")
});

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [, forgotPassword] = useForgotPasswordMutation();
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
                    await forgotPassword(values);
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ? (
                        <Box>if an account with that email exists, we sent you can email</Box>
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

export default withUrqlClient(createUrqlClient)(ForgotPassword);
