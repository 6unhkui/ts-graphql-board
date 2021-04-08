interface SiteMeta {
    title: string;
    description: string;
    image: string;
    url: string;
}

const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
export const SITE_META: SiteMeta = {
    title: "Board App 🚀",
    description: "board app...",
    image: `${origin}/images/site-image.png`,
    url: origin
};
