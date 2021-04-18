import React from "react";
import { NextSeo } from "next-seo";
import { DEFAULT_SEO, SITE_NAME } from "../constants";
import { OpenGraphImages } from "next-seo/lib/types";

interface SEOProps {
    title?: string;
    description?: string;
    image?: OpenGraphImages;
    path?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = DEFAULT_SEO.openGraph.title,
    description = DEFAULT_SEO.openGraph.description,
    image,
    path
}) => {
    const currenURL = path ? process.env.NEXT_PUBLIC_WEB_URL + path : process.env.NEXT_PUBLIC_WEB_URL;
    const ogImage = !image ? DEFAULT_SEO.openGraph.images[0] : { ...DEFAULT_SEO.openGraph.images[0], ...image };

    return (
        <NextSeo
            {...DEFAULT_SEO}
            titleTemplate={`%s | ${SITE_NAME}`}
            title={title}
            description={description}
            openGraph={{
                url: currenURL,
                title,
                description,
                images: [ogImage]
            }}
        />
    );
};

export default SEO;
