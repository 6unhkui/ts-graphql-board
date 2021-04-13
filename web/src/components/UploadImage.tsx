import React, { useCallback, useState } from "react";
import { IconButton } from "@chakra-ui/button";
import { Box, Grid } from "@chakra-ui/layout";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { Image, Text } from "@chakra-ui/react";
import { useUploadImageMutation } from "generated/graphql";
import ImageZoom from "./ImageZoom";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

const BoxWrapper: React.FC<{ rootProps?: DropzoneRootProps }> = ({ children, rootProps }) => (
    <Box
        variant="outline"
        display="flex"
        p={1}
        width="100%"
        borderRadius="md"
        border="1px dotted gray"
        textAlign="center"
        cursor="pointer"
        minHeight={100}
        maxHeight={100}
        {...rootProps}
    >
        {children}
    </Box>
);

interface UploadButtonProps {
    images?: string[];
    onChangeImage: (url: string) => void;
    onRemoveImage?: (url: string) => void;
    mb?: number;
}

const UploadButton: React.FC<UploadButtonProps> = ({ images, onChangeImage, onRemoveImage, mb }) => {
    const [uploadImage] = useUploadImageMutation();
    const onDrop = useCallback(
        async ([file]: File[]) => {
            const { data } = await uploadImage({ variables: { image: file } });
            if (data.uploadImage) {
                onChangeImage(data.uploadImage);
            }
        },
        [uploadImage, onChangeImage]
    );
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const [showImageZoom, setShowImageZoom] = useState<boolean>(false);

    const onZoom = useCallback(() => {
        setShowImageZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImageZoom(false);
    }, []);

    return (
        <Box mb={mb}>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                {images.map(url => (
                    <BoxWrapper key={url}>
                        <IconButton
                            aria-label="Delete Image"
                            icon={<DeleteIcon />}
                            size="xs"
                            position="absolute"
                            mt={2}
                            ml={2}
                            borderRadius={0}
                            onClick={() => onRemoveImage(url)}
                        />
                        <Image src={url} alt="thumbnail" objectFit="cover" mx="auto" loading="eager" onClick={onZoom} />
                    </BoxWrapper>
                ))}

                <BoxWrapper rootProps={getRootProps()}>
                    <Box alignSelf="center" mx="auto" p={4}>
                        <Text color="gray.800" fontWeight="semibold">
                            <AddIcon /> 이미지 등록
                        </Text>
                    </Box>
                    <input {...getInputProps()} hidden accept="image/*" />
                </BoxWrapper>
            </Grid>
            <Text as="sub" color="gray.500">
                {`이미지 등록 버튼에 파일을 Drag & Drop 하거나 버튼을 클릭해주세요.`}
            </Text>

            {showImageZoom ? <ImageZoom images={images} onClose={onClose} /> : null}
        </Box>
    );
};

export default UploadButton;
