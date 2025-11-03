'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
    href: string;
    children: ReactNode;
    activeClassName?: string;
    className?: string;
};

export default function NavLink({ href, children, className = '', activeClassName = 'active' }: Props) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`${className} ${isActive ? activeClassName : ''}`.trim()}
        >
            {children}
        </Link>
    );
}
