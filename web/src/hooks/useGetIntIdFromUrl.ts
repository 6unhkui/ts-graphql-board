import { useRouter } from "next/router";

export const useGetIntIdFromUrl = (): number => {
    const router = useRouter();
    return typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
};
