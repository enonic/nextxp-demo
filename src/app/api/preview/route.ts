import {NextRequest, NextResponse} from 'next/server';
import {redirect} from 'next/navigation';
import {draftMode} from 'next/headers';

export function HEAD(req: NextRequest) {
    return processRequest(req);
}

export function GET(req: NextRequest) {
    return processRequest(req);
}

function processRequest(req: NextRequest) {
    const params = req.nextUrl.searchParams;

    const token = params.get('token');
    let response = validateToken(token);
    if (response !== null) {
        return response;
    }

    const path = params.get('path');
    response = validatePath(path);
    if (response !== null) {
        return response;
    }

    console.info(`Previewing [${path}]...`);

    draftMode().enable();

    redirect(!path?.length ? '/' : path);
}

function validateToken(token: string | null) {
    if (token !== process.env.ENONIC_API_TOKEN) {
        // XP hijacks 401 to show login page, so send 407 instead
        return NextResponse.json({message: 'Invalid token'}, {
            status: 407,
        });
    }
    return null;
}

function validatePath(path: string | string[] | null) {
    // If the slug doesn't exist prevent preview mode from being enabled
    if (path === null || path === undefined) {
        return NextResponse.json({message: 'Invalid path'}, {
            status: 400,
        });
    }
    return null;
}
