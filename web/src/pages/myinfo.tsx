import { Button } from "@chakra-ui/button";
import { Box, Center, Divider, Flex, Heading, Link } from "@chakra-ui/layout";
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import {
    MeDocument,
    MeQuery,
    RegularUserFragment,
    useMeQuery,
    useUpdateProfileMutation,
    useWithdrawMutation
} from "generated/graphql";
import React, { useState } from "react";
import { isServer } from "utils/isServer";
import { withApollo } from "utils/withApollo";
import * as Yup from "yup";
import NextLink from "next/link";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";
import { toErrorMap } from "utils/toErrorMap";
import { useRouter } from "next/router";
import WithdrawAlert from "components/Alert";
import { useIsAuth } from "hooks/useIsAuth";

const validationSchema = Yup.object().shape({
    email: Yup.string().min(2, "Too Short!").max(70, "Too Long!").email().required("Required"),
    name: Yup.string().min(2, "Too Short!").max(70, "Too Long!").required("Required"),
    password: Yup.string().min(2, "Too Short!").max(70, "Too Long!"),
    confirmPassword: Yup.string().when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string()
            .oneOf([Yup.ref("password")], "Both password need to be the same")
            .required("Requirede")
    })
});

interface myinfoProps {}

const myinfo: React.FC<myinfoProps> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const [withdrawAlertIsOpen, setWithdrawAlertIsOpen] = useState<boolean>(false);
    const { data, loading } = useMeQuery({
        skip: isServer()
    });
    const [updateProfile] = useUpdateProfileMutation();
    const [withdraw] = useWithdrawMutation();

    // const keys = Object.keys(data?.me || {}) as (keyof RegularUserFragment)[] | [];

    return (
        <Layout variant="small" title="My Info">
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    My Info
                </Heading>
            </Box>

            {loading || !data?.me ? (
                Array.from({ length: 4 }, (_, key) => (
                    <Box key={key} mb={6}>
                        <Skeleton height="14px" width="25%" />
                        <Box padding={3} border="1px" mt={2} borderRadius="md" borderColor="gray.200">
                            <Skeleton height="20px" />
                        </Box>
                    </Box>
                ))
            ) : (
                <Formik
                    initialValues={{ email: data?.me.email, name: data?.me.name, password: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setErrors }) => {
                        delete values.confirmPassword;
                        if (values.password.trim().length === 0) {
                            delete values.password;
                        }

                        const { data } = await updateProfile({
                            variables: { options: values },
                            update: (cache, { data }) => {
                                cache.writeQuery<MeQuery>({
                                    query: MeDocument,
                                    data: {
                                        __typename: "Query",
                                        me: data.updateProfile.user
                                    }
                                });
                            }
                        });

                        if (data?.updateProfile.errors) {
                            setErrors(toErrorMap(data?.updateProfile.errors));
                        } else if (data?.updateProfile.user) {
                            router.push("/");
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField name="email" label="Email" placeholder="계정을 입력하세요." />
                            <Box mt={4}>
                                <InputField name="name" label="Name" placeholder="이름을 입력하세요." />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name="password"
                                    label="New Password"
                                    type="password"
                                    placeholder="비밀번호를 입력하세요."
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="비밀번호를 입력하세요."
                                />
                            </Box>
                            <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}

            <WithdrawAlert
                header="Withdraw"
                body="탈퇴를 하면 돌이킬 수 없습니다. 정말 탈퇴하시겠습니까?"
                isOpen={withdrawAlertIsOpen}
                onClose={() => setWithdrawAlertIsOpen(false)}
                onOk={() => {
                    withdraw({
                        update: cache => {
                            cache.reset();
                        }
                    });
                    router.push("/");
                }}
            />
            <Center mt={10}>
                <Link textDecoration="underline" fontSize="sm" color="gray" onClick={() => setWithdrawAlertIsOpen(true)}>
                    탈퇴하기
                </Link>
            </Center>
        </Layout>
    );
};

export default withApollo({ ssr: false })(myinfo);
