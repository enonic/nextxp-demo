import {NextRequest} from 'next/server'
import {getLocaleProjectConfigById, getLocaleProjectConfigs, PROJECT_ID_HEADER} from '@enonic/nextjs-adapter'
import Negotiator from 'negotiator'
import {match} from '@formatjs/intl-localematcher'

export function middleware(req: NextRequest) {

    const {locale, locales} = getLocale(req)

    const pathname = req.nextUrl.pathname;
    const pathPart = pathname.split('/')[1];    // pathname always starts with a slash, followed by locale
    const pathLocale = locales.find((loc) => pathPart === loc);

    if (pathLocale) {
        // locale is already in the path
        return;
    }

    req.nextUrl.pathname = `/${locale}${pathname}`

    return Response.redirect(req.nextUrl)

}

export const config = {
    // do not localize next.js paths
    // TODO: also exclude public folder paths (images, fonts, etc)
    matcher: ["/((?!api|images/|fonts/|_next/static|_next/image|assets|favicon.ico|sw.js).*)",],
};

function getLocale(req: NextRequest) {
    let locale;
    const configs = getLocaleProjectConfigs();
    const locales = Object.keys(configs);
    const defaultLocale = locales.find((locale) => configs[locale].default)!;

    const projectId = req.headers.get(PROJECT_ID_HEADER) || undefined;
    if (!projectId) {
        const acceptLang = req.headers.get('accept-language') || '';
        const headers = {'accept-language': acceptLang};
        const langs = new Negotiator({headers}).languages();
        locale = match(langs, locales, defaultLocale);
    } else {
        locale = getLocaleProjectConfigById(projectId).locale;
    }

    return {locale, locales}
}
