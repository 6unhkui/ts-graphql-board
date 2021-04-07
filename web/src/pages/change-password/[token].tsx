import { Button } from "@chakra-ui/button";
import { Box, Heading, Link } from "@chakra-ui/layout";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { toErrorMap } from "utils/toErrorMap";
import * as Yup from "yup";
import { MeDocument, MeQuery, useChangePasswordMutation } from "generated/graphql";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import NextLink from "next/link";
import { useApolloClient } from "@apollo/client";
import { withApollo } from "utils/withApollo";

const validationSchema = Yup.object().shape({
    newPassword: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required"),
    confirmNewPassword: Yup.string()
        .required("Required")
        .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.newPassword === value;
        })
});

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
    const apolloClient = useApolloClient();

    return (
        <Layout variant="small" title="Change Password">
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
                        variables: {
                            token: typeof router.query.token === "string" ? router.query.token : "",
                            newPassword: values.newPassword
                        },
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: "Query",
                                    me: data.changePassword.user
                                }
                            });
                        }
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

export default withApollo({ ssr: false })(ChangePassword);
