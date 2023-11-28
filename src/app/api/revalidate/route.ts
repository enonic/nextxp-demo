import {revalidatePath} from 'next/cache';
import {NextRequest} from 'next/server';
import {getProjectLocales} from '@enonic/nextjs-adapter';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const token = params.get('token');
    const path = params.get('path');
    // Check for secret to confirm this is a valid request
    if (token !== process.env.ENONIC_API_TOKEN) {
        // XP hijacks 401 to show login page, so send 407 instead
        return Response.json({message: 'Invalid token'}, {
            status: 407,
        });
    }

    try {
        if (!path) {
            const localeSegment = getProjectLocales().length > 1 ? '/[locale]' : '';
            revalidatePath(`${localeSegment}/[[..contentPath]]/page`, 'page');
            console.info(`Revalidated everything`);
        } else {
            revalidatePath(normalizePath(path), 'page');
            console.info(`Revalidated [${path}]`);
        }
        return Response.json({message: 'Revalidation done'}, {
            status: 200,
        });
    } catch (err) {
        console.error(`Revalidation [${path ?? 'everything'}] error: ` + err);
    }
}

function normalizePath(path: string[] | string): string {
    let normalPath;
    if (typeof path === 'string') {
        normalPath = path.charAt(0) !== '/' ? '/' + path : path;
    } else {
        normalPath = '/' + path.join('/');
    }
    return normalPath;
}
