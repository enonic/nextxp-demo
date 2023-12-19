import {NextRequest, NextResponse} from 'next/server'
import {getRequestLocaleInfo} from '@enonic/nextjs-adapter'


export function middleware(req: NextRequest) {

    const pathname = req.nextUrl.pathname;
    const {locale, locales} = getRequestLocaleInfo({
        contentPath: pathname,
        headers: req.headers
    });

    const pathPart = pathname.split('/')[1];    // pathname always starts with a slash, followed by locale
    const pathHasLocale = locales.indexOf(pathPart) >= 0

    if (pathHasLocale) {
        // locale is already in the path, no need to redirect
        return;
    } else if (!locale) {
        // no locale found in path or headers, return 404
        console.debug(`Middleware returning 404 for '${pathname}': no locale found`);
        return new NextResponse(null, {
            status: 404,
        });
    }

    req.nextUrl.pathname = `/${locale}${pathname}`

    console.debug(`Middleware redirecting '${pathname}' to '${req.nextUrl.pathname}'`);

    return NextResponse.rewrite(req.nextUrl);
}

export const config = {
    // do not localize next.js paths
    // TODO: also exclude public folder paths (images, fonts, etc)
    matcher: ["/((?!api/|images/|fonts/|_next/static|_next/image|assets|favicon.ico|sw.js).*)",],
};
