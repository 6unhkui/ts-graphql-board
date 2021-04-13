import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import NextLink from "next/link";
import { Button } from "@chakra-ui/button";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useDeletePostMutation } from "generated/graphql";
import { useRouter } from "next/router";
import DeleteAlert from "./Alert";

interface EditDeletePostButtonsProps {
    id: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id }) => {
    const router = useRouter();
    const [deleteAlertIsOpen, setDeleteAlertIsOpen] = useState<boolean>(false);
    const [deletePost] = useDeletePostMutation();

    return (
        <Box ml={"auto"}>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <Button leftIcon={<EditIcon />} variant="outline" size="sm" mr={2}>
                    수정
                </Button>
            </NextLink>

            <DeleteAlert
                header="게시글 삭제"
                body="게시글을 정말 삭제하겠습니까?"
                isOpen={deleteAlertIsOpen}
                onClose={() => setDeleteAlertIsOpen(false)}
                onOk={() => {
                    deletePost({
                        variables: { id },
                        update: cache => {
                            console.log(cache);
                            cache.evict({ id: "Post:" + id });
                        }
                    });
                    router.push("/");
                }}
            />
            <Button leftIcon={<DeleteIcon />} variant="outline" size="sm" onClick={() => setDeleteAlertIsOpen(true)}>
                삭제
            </Button>
        </Box>
    );
};

export default EditDeletePostButtons;
