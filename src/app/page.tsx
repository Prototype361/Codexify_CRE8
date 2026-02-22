"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export default function LandingPage() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center max-w-3xl"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800"
                >
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
                        SCARMAP
                    </span>
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xl md:text-3xl font-medium text-neutral-600 dark:text-slate-300 mb-6 tracking-wide"
                >
                    Speak your truth, without saying a word.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-base md:text-lg text-neutral-500 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed"
                >
                    A secure, visual reporting tool designed to document physical trauma safely
                    and accurately into formal medical-legal records.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                >
                    <Link
                        href="/map"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] transition-all group-hover:animate-[shimmer_1s_infinite]"></span>
                        <span className="relative flex items-center gap-2">
                            Enter Secure Portal
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    )
}
