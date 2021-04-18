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
import ko from "yup-locale-ko";
import SEO from "components/SEO";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
});

interface loginProps {}

const Login: NextPage<loginProps> = ({}) => {
    const router = useRouter();
    const [login] = useLoginMutation();

    return (
        <Layout variant="small">
            <SEO title="로그인" />
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    로그인
                </Heading>
            </Box>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
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
                        <InputField name="email" label="이메일" placeholder="이메일을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요." />
                        </Box>
                        <Flex mt={4}>
                            <NextLink href="/forgot-password">
                                <Link ml="auto" color="gray.5 0 0">
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </NextLink>
                        </Flex>
                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            로그인
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(Login);
