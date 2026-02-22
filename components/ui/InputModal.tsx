"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { BodyPart } from "./BodyMap"

export type InjuryType = "Bruise" | "Cut/Laceration" | "Burn" | "Pressure Mark" | "Internal Pain"
export type RecurrenceType = "First time" | "Happened before" | "Chronic"
export type TimingType = "Today" | "Yesterday" | "Last Week" | "Older"

export interface InjuryReport {
    id: string
    part: BodyPart
    type: InjuryType
    recurrence: RecurrenceType
    timing: TimingType
    timestamp: number
}

interface InputModalProps {
    isOpen: boolean
    part: BodyPart | null
    onClose: () => void
    onSave: (report: Omit<InjuryReport, "id" | "timestamp">) => void
}

const INJURY_TYPES: InjuryType[] = ["Bruise", "Cut/Laceration", "Burn", "Pressure Mark", "Internal Pain"]
const RECURRENCE_TYPES: RecurrenceType[] = ["First time", "Happened before", "Chronic"]
const TIMING_TYPES: TimingType[] = ["Today", "Yesterday", "Last Week", "Older"]

export function InputModal({ isOpen, part, onClose, onSave }: InputModalProps) {
    const [selectedType, setSelectedType] = useState<InjuryType | null>(null)
    const [selectedRecurrence, setSelectedRecurrence] = useState<RecurrenceType | null>(null)
    const [selectedTiming, setSelectedTiming] = useState<TimingType | null>(null)

    const handleSave = () => {
        if (part && selectedType && selectedRecurrence && selectedTiming) {
            onSave({
                part,
                type: selectedType,
                recurrence: selectedRecurrence,
                timing: selectedTiming,
            })
            // Reset state for next time
            setSelectedType(null)
            setSelectedRecurrence(null)
            setSelectedTiming(null)
            onClose()
        }
    }

    const isFormComplete = selectedType && selectedRecurrence && selectedTiming

    return (
        <AnimatePresence>
            {isOpen && part && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold tracking-tight">Record Detail</h2>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Area selected: <span className="font-medium text-neutral-900 dark:text-neutral-100">{part}</span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Type Selection */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">What kind of mark?</label>
                                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {INJURY_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                            className={`rounded-xl border p-3 text-sm transition-all ${selectedType === type
                                                    ? "border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-100"
                                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recurrence Selection */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Has this happened before?</label>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {RECURRENCE_TYPES.map((recurrence) => (
                                        <button
                                            key={recurrence}
                                            onClick={() => setSelectedRecurrence(recurrence)}
                                            className={`rounded-xl border p-3 text-sm transition-all ${selectedRecurrence === recurrence
                                                    ? "border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-100"
                                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                                                }`}
                                        >
                                            {recurrence}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Timing Selection */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">When did this happen?</label>
                                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {TIMING_TYPES.map((timing) => (
                                        <button
                                            key={timing}
                                            onClick={() => setSelectedTiming(timing)}
                                            className={`rounded-xl border p-3 text-sm transition-all ${selectedTiming === timing
                                                    ? "border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-100"
                                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                                                }`}
                                        >
                                            {timing}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={!isFormComplete}
                                    className={`w-full rounded-xl px-4 py-3 text-center font-medium transition-all ${isFormComplete
                                            ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                                            : "bg-neutral-100 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600"
                                        }`}
                                >
                                    Save Record
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
