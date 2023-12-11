import {revalidatePath} from 'next/cache';
import {NextRequest} from 'next/server';

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
            // This will revalidate everything
            revalidatePath('/', 'layout');
            console.info(`Revalidated everything`);
        } else {
            revalidatePath(normalizePath(path), 'page');
            console.info(`Revalidated [${path}]`);
        }
        return Response.json({revalidated: true}, {status: 200});
    } catch (err) {
        console.error(`Revalidation [${path ?? 'everything'}] error: ` + err);
        return Response.json({revalidated: false}, {status: 200});
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
