import { Button } from "@chakra-ui/button";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay
} from "@chakra-ui/modal";
import React from "react";

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
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={onOk} ml={3}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default Alert;
