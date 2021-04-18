import { DefaultSeoProps } from "next-seo";

// site metadata
export const SITE_NAME = "Board App 🚀";
export const DEFAULT_SEO: DefaultSeoProps = {
    title: SITE_NAME,
    description: "Hello, Board App",
    openGraph: {
        title: SITE_NAME,
        description: "Hello, Board App",
        url: process.env.NEXT_PUBLIC_WEB_URL,
        defaultImageWidth: 500,
        defaultImageHeight: 300,
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_WEB_URL}/images/site-image.png`,
                height: 500,
                width: 300
            }
        ]
    }
};

export const __prod__ = process.env.NODE_ENV === "production";
