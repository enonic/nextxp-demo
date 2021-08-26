
const isUUID = (id: string) =>
    id &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
    );

// Requests from content-studio can be either a path or UUID, we check for both
export const routerQueryToXpPathOrId = (routerQuery: string | string[]) => {
    const possibleId =
        typeof routerQuery === 'string' ? routerQuery : routerQuery[0];

    if (isUUID(possibleId)) {
        return possibleId;
    }

    const path = `/${
        typeof routerQuery === 'string' ? routerQuery : routerQuery.join('/')
    }`;

    return `${xpContentPathPrefix}${path}`;
};
