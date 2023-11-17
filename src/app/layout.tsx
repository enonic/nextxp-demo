import {PORTAL_COMPONENT_ATTRIBUTE} from '@enonic/nextjs-adapter';
import {Metadata} from 'next';

export interface LayoutProps {
    children: React.ReactNode
}

export default function RootLayout({children}: LayoutProps) {

    const bodyAttrs: { [key: string]: string } = {
        className: "edit",
        [PORTAL_COMPONENT_ATTRIBUTE]: "page"
    }

    return (
        <html lang="en">
        <body {...bodyAttrs}>{children}</body>
        </html>
    )
}

export function generateMetadata(): Metadata {
    return {
        title: {
            default: 'Next.js + Enonic XP = ❤️',
            template: '%s | Next.XP',
        },
        description: 'The React Framework for Enonic XP',
    }
}
