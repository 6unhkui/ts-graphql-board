import { useEffect } from "react";
import { useMeQuery } from "generated/graphql";
import { useRouter } from "next/router";

export const useIsAuth = (): void => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        if (!fetching && !data?.me) {
            router.replace("/login?next=" + router.pathname.slice(router.pathname.indexOf("/") + 1));
        }
    }, [fetching, data, router]);
};
