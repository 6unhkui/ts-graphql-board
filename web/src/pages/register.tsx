import React from "react";
import { Button, Box, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/dist/client/router";
import InputField from "components/InputField";
import { useRegisterMutation } from "generated/graphql";
import { toErrorMap } from "utils/toErrorMap";
import Layout from "components/Layout";

const validationSchema = Yup.object().shape({
    account: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required"),
    password: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required"),
    name: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required")
});

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Layout variant="small">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    Register
                </Heading>
            </Box>
            <Formik
                initialValues={{ account: "", password: "", name: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setErrors }) => {
                    const { data } = await register({ options: values });
                    if (data?.register.errors) {
                        setErrors(toErrorMap(data?.register.errors));
                    } else if (data?.register.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="account" label="Account" placeholder="계정을 입력하세요." />
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

export default register;
