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

const validationSchema = Yup.object().shape({
    email: Yup.string().min(2, "Too Short!").max(70, "Too Long!").email().required("Required"),
    password: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required"),
    name: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required")
});

interface registerProps {}

const Register: NextPage<registerProps> = ({}) => {
    const router = useRouter();
    const [register] = useRegisterMutation();

    return (
        <Layout variant="small" title="Register">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Register
                </Heading>
            </Box>
            <Formik
                initialValues={{ email: "", password: "", name: "" }}
                validationSchema={validationSchema}
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
                        <InputField name="email" label="Email" placeholder="계정을 입력하세요." />
                        <Box mt={4}>
                            <InputField name="password" label="Password" type="password" placeholder="비밀번호를 입력하세요." />
                        </Box>
                        <Box mt={4}>
                            <InputField name="name" label="Name" placeholder="이름을 입력하세요." />
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(Register);
