import React from "react";
import { Button, Box, Heading, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import InputField from "components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from "generated/graphql";
import { toErrorMap } from "utils/toErrorMap";
import Layout from "components/Layout";
import { NextPage } from "next";
import NextLink from "next/link";
import { withApollo } from "utils/withApollo";

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Required"),
    password: Yup.string().required("Required")
});

interface loginProps {}

const Login: NextPage<loginProps> = ({}) => {
    const router = useRouter();
    const [login, { client }] = useLoginMutation();

    return (
        <Layout variant="small" title="Login">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Login
                </Heading>
            </Box>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setErrors }) => {
                    const { data } = await login({
                        variables: { options: values },
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: "Query",
                                    me: data.login.user
                                }
                            });

                            cache.evict({ fieldName: "posts:{}" });
                        }
                    });

                    if (data?.login.errors) {
                        setErrors(toErrorMap(data?.login.errors));
                    } else if (data?.login.user) {
                        if (typeof router.query.next === "string") {
                            router.push(`/${router.query.next}`);
                        } else {
                            router.push("/");
                        }
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="email" label="Email" placeholder="이메일을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="password" label="Password" type="password" placeholder="비밀번호를 입력하세요." />
                        </Box>
                        <Flex mt={4}>
                            <NextLink href="/forgot-password">
                                <Link ml="auto" color="gray.5 0 0">
                                    forgot password?
                                </Link>
                            </NextLink>
                        </Flex>
                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(Login);
