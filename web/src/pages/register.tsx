import React from "react";
import { Button, Box, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import InputField from "components/InputField";
import { MeDocument, MeQuery, useRegisterMutation } from "generated/graphql";
import { toErrorMap } from "utils/toErrorMap";
import Layout from "components/Layout";
import { NextPage } from "next";
import { withApollo } from "utils/withApollo";
import ko from "yup-locale-ko";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    email: Yup.string().min(2).max(70).email().required(),
    password: Yup.string().min(2).max(70).required(),
    name: Yup.string().min(2).max(70).required()
});

interface registerProps {}

const Register: NextPage<registerProps> = ({}) => {
    const router = useRouter();
    const [register] = useRegisterMutation();

    return (
        <Layout variant="small" title="Register">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    회원가입
                </Heading>
            </Box>
            <Formik
                initialValues={{ email: "", password: "", name: "" }}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values, { setErrors }) => {
                    const { data } = await register({
                        variables: { options: values },
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: "Query",
                                    me: data.register.user
                                }
                            });
                        }
                    });

                    if (data?.register.errors) {
                        setErrors(toErrorMap(data?.register.errors));
                    } else if (data?.register.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="email" label="이메일" placeholder="계정을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요." />
                        </Box>
                        <Box mt={4}>
                            <InputField name="name" label="이름" placeholder="이름을 입력하세요." />
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            가입하기
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(Register);
