"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { FolderPlus, Moon, Sun, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

export function GlobalHeader() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleExit = () => {
        if (typeof window !== "undefined") {
            try {
                localStorage.clear()
                sessionStorage.clear()
            } catch (e) {
                console.error("Failed to clear storage", e)
            }
            window.location.replace("/")
        }
    }

    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            {/* Left: Branding */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors">
                    <FolderPlus className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none tracking-tight text-neutral-900 dark:text-white">ScarMap</h1>
                    <p className="text-[10px] font-semibold text-neutral-500 tracking-wider">FORENSIC MAPPING TOOL</p>
                </div>
            </Link>

            {/* Center: Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
                <Link
                    href="/map"
                    className={`text-sm font-semibold py-5 transition-colors ${pathname === "/map" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"}`}
                >
                    Map View
                </Link>
                <Link
                    href="/cases"
                    className={`text-sm font-semibold py-5 transition-colors ${pathname === "/cases" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"}`}
                >
                    Case Files
                </Link>
            </nav>

            {/* Right: Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors dark:hover:bg-neutral-800 dark:hover:text-white"
                    aria-label="Toggle Dark Mode"
                >
                    {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                    onClick={handleExit}
                    className="flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow hover:bg-neutral-900 transition-colors dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-white"
                >
                    Save & Exit <LogOut className="h-4 w-4 ml-1" />
                </button>
            </div>
        </header>
    )
}
