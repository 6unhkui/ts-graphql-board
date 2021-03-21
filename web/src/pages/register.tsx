import React, { useState } from "react";
import { FormControl, FormLabel, FormErrorMessage, Button, Input } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import Wrapper from "../components/Wrapper";

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    function validateAccount(value: string) {
        let error;
        if (!value) {
            error = "Name is required";
        } else if (value.toLowerCase() !== "naruto") {
            error = "Jeez! You're not a fan 😱";
        }
        return error;
    }

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ account, password, name }}
                onSubmit={(values, actions) => {
                    console.log(values);
                }}
            >
                {props => (
                    <Form>
                        <Field name="account" validate={validateAccount}>
                            {({ field, form }) => (
                                <FormControl isInvalid={form.errors.account && form.touched.account}>
                                    <FormLabel htmlFor="account">Account</FormLabel>
                                    <Input {...field} id="account" placeholder="계정을 입력해주세요." />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="password" validate={validateAccount}>
                            {({ field, form }) => (
                                <FormControl isInvalid={form.errors.account && form.touched.account}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input {...field} type="password" id="password" placeholder="비밀번호를 입력해주세요." />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="name" validate={validateAccount}>
                            {({ field, form }) => (
                                <FormControl isInvalid={form.errors.account && form.touched.account}>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Input {...field} id="name" placeholder="이름을 입력해주세요." />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default register;
