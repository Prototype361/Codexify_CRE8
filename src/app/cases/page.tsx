"use client"

import { motion } from "framer-motion"
import { Download, Search, ShieldCheck, FileClock } from "lucide-react"
import { GlobalHeader } from "@/components/layout/GlobalHeader"

interface CaseRecord {
    id: string
    dateGenerated: string
    totalInjuries: number
    status: "Locked" | "Draft" | "Archived"
}

const mockCases: CaseRecord[] = [
    { id: "CASE-84920", dateGenerated: "2024-05-14", totalInjuries: 3, status: "Locked" },
    { id: "CASE-71034", dateGenerated: "2024-04-22", totalInjuries: 1, status: "Locked" },
    { id: "CASE-65912", dateGenerated: "2024-04-05", totalInjuries: 5, status: "Archived" },
    { id: "CASE-99210", dateGenerated: "2024-06-01", totalInjuries: 0, status: "Draft" },
]

export default function CasesPage() {
    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
            <GlobalHeader />

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-6xl"
                >
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
                                Secure Case Archive
                                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-500" />
                            </h1>
                            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                                View and securely download historically generated trauma reports.
                            </p>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search Case ID..."
                                className="w-full md:w-64 rounded-full border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Data Table Container */}
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden dark:border-neutral-800 dark:bg-neutral-900/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
                                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold">Case ID</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Date Generated</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Total Injuries Logged</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                                        <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockCases.map((record, idx) => (
                                        <motion.tr
                                            key={record.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                                            className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors dark:border-neutral-800/50 dark:hover:bg-neutral-800/50"
                                        >
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                                                <FileClock className="h-4 w-4 text-neutral-400" />
                                                {record.id}
                                            </td>
                                            <td className="px-6 py-4">{record.dateGenerated}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                                    {record.totalInjuries}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                                    ${record.status === 'Locked' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                                                    ${record.status === 'Draft' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                                                    ${record.status === 'Archived' ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300' : ''}
                                                `}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    title="Download PDF"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span className="sr-only md:not-sr-only">Download</span>
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
