import { SiteMeta } from "types/SiteMeta";

const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
export const SITE_META: SiteMeta = {
    title: "Board App 🚀",
    description: "board app...",
    image: `${origin}/images/site-image.png`,
    url: origin
};

export const __prod__ = process.env.NODE_ENV === "production";
