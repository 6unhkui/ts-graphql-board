import React, { useState } from "react";
import { IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, Center } from "@chakra-ui/layout";
import Slick from "react-slick";
import { Global, css } from "@emotion/react";
import { CloseIcon } from "@chakra-ui/icons";

const globalStyle = css`
    .slick-slide {
        display: inline-block;
    }

    .slick-list,
    .slick-track {
        height: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slick-thumb {
        margin-top: 100px;
        display: flex !important;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        li {
            width: 80px;
            height: 80px;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            &.slick-active {
                border: 2px solid var(--chakra-colors-primary-500);
            }

            &:not(:last-child) {
                margin-right: 10px;
            }
        }
    }
`;

interface ImageZoomProps {
    images: string[];
    onClose?: () => void;
    initImage?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ images, onClose, initImage }) => {
    const [currentImageIndex] = useState<number>(initImage ? images.findIndex(v => v === initImage) : 0);

    return (
        <Box position="fixed" zIndex={1000} top={0} left={0} right={0} bottom={0} bg="blackAlpha.800" cursor="auto">
            <Global styles={globalStyle} />

            <IconButton
                aria-label="Close"
                icon={<CloseIcon />}
                onClick={onClose}
                variant="ghost"
                color="white"
                position="absolute"
                top={4}
                right={4}
                size="lg"
                _hover={{ backgroundColor: "transparent" }}
                _active={{ backgroundColor: "transparent" }}
            />

            <Box mt="10vh">
                <Slick
                    initialSlide={currentImageIndex}
                    infinite
                    arrows={false}
                    slidesToShow={1}
                    slidesToScroll={1}
                    customPaging={i => (
                        <Image src={images[i].replace(/original/, "thumb")} alt={images[i]} fallbackSrc={images[i]} />
                    )}
                    dots={true}
                    dotsClass="slick-dots slick-thumb"
                >
                    {images.map(image => (
                        <Center key={image} textAlign="center">
                            <Image src={image} alt={image} m="auto" maxHeight="50vh" />
                        </Center>
                    ))}
                </Slick>
            </Box>
        </Box>
    );
};

export default ImageZoom;
