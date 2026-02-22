"use client"

import { useCallback } from "react"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"

export function QuickExit() {
    const handleExit = useCallback(() => {
        // Basic security measures for local state
        if (typeof window !== "undefined") {
            try {
                localStorage.clear()
                sessionStorage.clear()
            } catch (e) {
                console.error("Failed to clear local storage", e)
            }
            // Replace history and redirect
            window.location.replace("https://www.weather.com")
        }
    }, [])

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExit}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 rounded-full bg-neutral-800 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-white"
            aria-label="Quick Exit"
        >
            <LogOut className="h-4 w-4" />
            <span>Quick Exit</span>
        </motion.button>
    )
}
