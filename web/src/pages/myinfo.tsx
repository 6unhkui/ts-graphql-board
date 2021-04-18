import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { Box, Center, Heading, Link } from "@chakra-ui/layout";
import InputField from "components/InputField";
import Layout from "components/Layout";
import { Form, Formik } from "formik";
import { MeDocument, MeQuery, useMeQuery, useUpdateProfileMutation, useWithdrawMutation } from "generated/graphql";
import { isServer } from "utils/isServer";
import { withApollo } from "utils/withApollo";
import * as Yup from "yup";
import { Skeleton } from "@chakra-ui/skeleton";
import { toErrorMap } from "utils/toErrorMap";
import { useRouter } from "next/router";
import WithdrawAlert from "components/Alert";
import { useIsAuth } from "hooks/useIsAuth";
import ko from "yup-locale-ko";
import SEO from "components/SEO";
import { Avatar, AvatarBadge } from "@chakra-ui/avatar";
import { SettingsIcon } from "@chakra-ui/icons";

Yup.setLocale(ko);

const validationSchema = Yup.object().shape({
    email: Yup.string().min(2).max(70).email().required(),
    name: Yup.string().min(2).max(70).required(),
    password: Yup.string().min(2).max(70),
    confirmNewPassword: Yup.string().when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string()
            .oneOf([Yup.ref("password")], "비밀번호가 일치하지 않습니다.")
            .required()
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

    return (
        <Layout variant="small">
            <SEO title="내 정보" />
            <Box mb={10}>
                <Heading fontSize={"3rem"} textAlign={"center"}>
                    내 정보
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
                <>
                    {/* <Center>
                        <Avatar size="2xl" name={data.me.name} src="">
                            <AvatarBadge boxSize="1em" bg="green.500">
                                <SettingsIcon fontSize="sm" />
                            </AvatarBadge>
                        </Avatar>
                    </Center> */}
                    <Formik
                        initialValues={{ email: data?.me.email, name: data?.me.name, password: "", confirmNewPassword: "" }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setErrors }) => {
                            delete values.confirmNewPassword;
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
                                <InputField name="email" label="이메일" placeholder="계정을 입력하세요." />
                                <Box mt={4}>
                                    <InputField name="name" label="이름" placeholder="이름을 입력하세요." />
                                </Box>
                                <Box mt={4}>
                                    <InputField
                                        name="password"
                                        label="새 비밀번호"
                                        type="password"
                                        placeholder="비밀번호를 입력하세요."
                                    />
                                </Box>
                                <Box mt={4}>
                                    <InputField
                                        name="confirmNewPassword"
                                        label="새 비밀번호 확인"
                                        type="password"
                                        placeholder="비밀번호를 다시 한 번 입력하세요."
                                    />
                                </Box>
                                <Button mt={4} type="submit" isLoading={isSubmitting} width={"full"}>
                                    저장
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </>
            )}

            <WithdrawAlert
                header="탈퇴"
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
