"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Command as CommandPrimitive,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";

interface CommandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandDialog({ open, onOpenChange }: CommandDialogProps) {
    const router = useRouter();

    if (!open) return null;

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
        }
    }

    function handleSelect(path: string) {
        onOpenChange(false);
        router.push(path);
    }

    return (
        // Backdrop
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
        >
            {/* Modal container */}
            <div
                className="bg-blue-50 rounded-lg border border-blue-400 shadow-lg w-full max-w-[900px] p-6"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                {/* Command input */}
                <CommandPrimitive className="flex flex-col">
                    <CommandInput
                        placeholder="Type a command or search..."
                        autoFocus
                        className="rounded-md border border-blue-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="mt-1 text-sm text-blue-600 select-none">
                        Start typing to quickly navigate admin pages.
                    </p>

                    {/* Command list */}
                    <CommandList className="max-h-36 overflow-y-auto mt-3">
                        <CommandEmpty className="py-2 text-gray-500">No results found.</CommandEmpty>

                        <CommandGroup heading="Pages" className="text-blue-700 font-semibold">
                            <div className="flex flex-wrap gap-4">
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin")} className="cursor-pointer min-w-[130px]">
                                    Dashboard
                                </CommandItem>
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin/users")} className="cursor-pointer min-w-[130px]">
                                    Users
                                </CommandItem>
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin/settings")} className="cursor-pointer min-w-[130px]">
                                    Settings
                                </CommandItem>
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin/hospital")} className="cursor-pointer min-w-[130px]">
                                    Hospital
                                </CommandItem>
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin/hr")} className="cursor-pointer min-w-[130px]">
                                    HR
                                </CommandItem>
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin/finance")} className="cursor-pointer min-w-[130px]">
                                    Finance
                                </CommandItem>
                                <CommandItem onSelect={() => handleSelect("/dashboard/admin/management")} className="cursor-pointer min-w-[130px]">
                                    Management
                                </CommandItem>
                            </div>
                        </CommandGroup>
                    </CommandList>
                </CommandPrimitive>
            </div>
        </div>
    );
}
