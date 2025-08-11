"use client";

import Image from "next/image";

export default function FooterPoweredBy() {
    return (
        <footer className="w-full bg-black text-white flex items-center justify-center gap-3 px-6 py-3 select-none">
            {/* Replace /favicon.ico with your actual favicon or logo */}
            <Image src="/favicon.ico" alt="Ealfi Team Logo" width={24} height={24} />
            <span className="font-semibold text-sm">Powered by eALIF Team</span>
        </footer>
    );
}
