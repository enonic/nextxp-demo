import {NextRequest} from 'next/server'
import {getRequestLocaleInfo} from '@enonic/nextjs-adapter'


export function middleware(req: NextRequest) {

    const pathname = req.nextUrl.pathname;
    const {locale, locales} = getRequestLocaleInfo({
        contentPath: pathname,
        headers: req.headers
    });

    const pathPart = pathname.split('/')[1];    // pathname always starts with a slash, followed by locale
    const pathLocale = locales.find((loc) => pathPart === loc);

    if (pathLocale) {
        // locale is already in the path
        return;
    }

    req.nextUrl.pathname = `/${locale}${pathname}`

    console.debug(`Middleware redirecting '${pathname}' to '${req.nextUrl.pathname}'`);

    return Response.redirect(req.nextUrl);
}

export const config = {
    // do not localize next.js paths
    // TODO: also exclude public folder paths (images, fonts, etc)
    matcher: ["/((?!api/|images/|fonts/|_next/static|_next/image|assets|favicon.ico|sw.js).*)",],
};
