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
import { withApollo } from "utils/withApollo";
import ko from "yup-locale-ko";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    newPassword: Yup.string().min(2).max(70).required(),
    confirmNewPassword: Yup.string()
        .required()
        .test("passwords-match", "비밀번호가 일치하지 않습니다.", function (value) {
            return this.parent.newPassword === value;
        })
});

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");

    return (
        <Layout variant="small" title="Change Password">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    비밀번호 변경
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
                        <InputField name="newPassword" label="새 비밀번호" placeholder="비밀번호를 입력하세요." type="password" />
                        <Box mt={4}>
                            <InputField
                                name="confirmNewPassword"
                                label="새 비밀번호 확인"
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
