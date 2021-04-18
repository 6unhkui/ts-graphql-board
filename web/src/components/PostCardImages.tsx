import React, { useState, useCallback } from "react";
import { Image } from "@chakra-ui/image";
import { Box, Grid } from "@chakra-ui/layout";
import { RegularPostFragment } from "generated/graphql";
import ImageZoom from "./ImageZoom";

const Thumbnail: React.FC<{ src: string }> = React.memo(({ src }) => (
    <Image src={src} alt={src} fit="cover" height={220} width="100%" fallbackSrc={src.replace(/thumb/, "original")} />
));

Thumbnail.displayName = "Thumbnail";

const showImageMaxCnt = 2;

interface PostCardImagesProps {}

const PostCardImages: React.FC<PostCardImagesProps & Pick<RegularPostFragment, "images">> = ({ images }) => {
    const hasMoreImage = showImageMaxCnt < images.length - 1;
    const [showImageZoom, setShowImageZoom] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<string>("");

    const onZoom = useCallback((image?: string) => {
        setShowImageZoom(true);
        if (image) setCurrentImage(image);
    }, []);

    const onClose = useCallback(() => {
        setShowImageZoom(false);
    }, []);

    return (
        <>
            <Grid templateColumns={`repeat(${Math.min(images.length, 3)}, 1fr)`}>
                {images.slice(0, hasMoreImage ? showImageMaxCnt : showImageMaxCnt + 1).map(({ url }, i) => (
                    <Box key={i} onClick={() => onZoom(url)}>
                        <Thumbnail src={url.replace(/original/, "thumb")} />
                    </Box>
                ))}

                {hasMoreImage ? (
                    <Box position="relative" onClick={() => onZoom(images[showImageMaxCnt].url)}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            color="white"
                            position="absolute"
                            right={0}
                            bottom={0}
                            bg="blackAlpha.800"
                            width="100%"
                            height="100%"
                        >
                            <Box fontSize="xx-large">{images.length - showImageMaxCnt}</Box>
                            <Box>더보기</Box>
                        </Box>
                        <Thumbnail src={images[showImageMaxCnt].url} />
                    </Box>
                ) : null}
            </Grid>

            {showImageZoom ? (
                <ImageZoom images={images.map(image => image.url)} onClose={onClose} initImage={currentImage} />
            ) : null}
        </>
    );
};

export default PostCardImages;
