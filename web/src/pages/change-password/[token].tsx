import { Button } from "@chakra-ui/button";
import { Box, Heading, Link } from "@chakra-ui/layout";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { toErrorMap } from "utils/toErrorMap";
import * as Yup from "yup";
import { useChangePasswordMutation } from "generated/graphql";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import NextLink from "next/link";

const validationSchema = Yup.object().shape({
    newPassword: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required"),
    confirmNewPassword: Yup.string()
        .required("Required")
        .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.newPassword === value;
        })
});

const ChangePassword: NextPage<{ token?: string }> = ({ token = "" }) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");

    return (
        <Layout variant="small">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Change Password
                </Heading>
            </Box>

            {tokenError ? (
                <Alert status="error" mb={6}>
                    <AlertIcon />
                    <Box flex="1">
                        <AlertTitle> {tokenError}</AlertTitle>
                        <AlertDescription display="block">
                            <NextLink href="/forgot-password">
                                <Link>{"go forget it again >"}</Link>
                            </NextLink>
                        </AlertDescription>
                    </Box>
                </Alert>
            ) : null}

            <Formik
                initialValues={{ newPassword: "", confirmNewPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setErrors }) => {
                    const { data } = await changePassword({
                        token,
                        newPassword: values.newPassword
                    });

                    if (data?.changePassword.errors) {
                        const errorMap = toErrorMap(data.changePassword.errors);
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        } else {
                            setErrors(errorMap);
                        }
                    } else if (data?.changePassword.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            label="New Password"
                            placeholder="비밀번호를 입력하세요."
                            type="password"
                        />
                        <Box mt={4}>
                            <InputField
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                placeholder="비밀번호를 다시 한 번 입력하세요."
                                type="password"
                            />
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
