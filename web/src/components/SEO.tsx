import Head from "next/head";

import React from "react";

interface SEOProps {
    title?: string;
    description?: string;
    siteTitle?: string;
}

const SEO: React.FC<SEOProps> = ({ title = "", description = "", siteTitle = "Board App" }) => {
    return (
        <Head>
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title ? title : siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="twitter:card" content="summary" />
            {/* <meta property="twitter:creator" content={config.social.twitter} /> */}
            <meta property="twitter:title" content={title ? title : siteTitle} />
            <meta property="twitter:description" content={description} />
        </Head>
    );
};

export default SEO;
