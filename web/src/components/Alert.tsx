import React from "react";
import { Button } from "@chakra-ui/button";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay
} from "@chakra-ui/modal";

interface AlertProps {
    header: string;
    body?: string;
    isOpen: boolean;
    onClose: () => void;
    onOk: () => void;
}

const Alert: React.FC<AlertProps> = ({ header, body, isOpen, onClose, onOk }) => {
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={undefined}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {header}
                    </AlertDialogHeader>

                    <AlertDialogBody>{body}</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose} variant="outline">
                            취소
                        </Button>
                        <Button colorScheme="red" onClick={onOk} ml={3}>
                            확인
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default Alert;
