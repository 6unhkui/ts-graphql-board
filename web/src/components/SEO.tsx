import React from "react";
import { NextSeo } from "next-seo";
import { SITE_META } from "../constants";

type image = {
    url: string;
    width: number;
    height: number;
};

interface SEOProps {
    title?: string;
    description?: string;
    image?: image;
}

const defaultImage: image = {
    url: SITE_META.image,
    width: 500,
    height: 300
};

const SEO: React.FC<SEOProps> = ({ title = "", description = "", image = defaultImage }) => {
    return (
        <NextSeo
            title={title ? `${title} | ${SITE_META.title}` : SITE_META.title}
            description={description ? description : SITE_META.description}
            openGraph={{
                url: SITE_META.url,
                title: title ? title : SITE_META.title,
                description,
                images: [image]
            }}
        />
    );
};

export default SEO;
