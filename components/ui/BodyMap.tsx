"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export type BodyPart = "Head" | "Torso" | "Left Arm" | "Right Arm" | "Left Leg" | "Right Leg"

interface BodyMapProps {
    onPartClick: (part: BodyPart) => void
}

export function BodyMap({ onPartClick }: BodyMapProps) {
    const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null)

    const handlePartClick = (part: BodyPart) => {
        onPartClick(part)
    }

    // Simplified SVG representations of a gender-neutral body divided into general areas
    // In a full production version, this would be a much more detailed set of SVG paths
    return (
        <div className="relative mx-auto flex w-full max-w-[300px] flex-col items-center justify-center p-4">
            <svg
                viewBox="0 0 200 400"
                className="h-auto w-full max-w-sm drop-shadow-sm"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g stroke="#9CA3AF" strokeWidth="2" fill="none">
                    {/* Head */}
                    <motion.path
                        d="M 100 20 C 130 20, 130 70, 100 80 C 70 70, 70 20, 100 20 Z"
                        fill={hoveredPart === "Head" ? "#E5E7EB" : "#F9FAFB"}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredPart("Head")}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick("Head")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    />
                    {/* Torso */}
                    <motion.path
                        d="M 75 80 L 125 80 L 130 180 L 70 180 Z"
                        fill={hoveredPart === "Torso" ? "#E5E7EB" : "#F9FAFB"}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredPart("Torso")}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick("Torso")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    />
                    {/* Left Arm */}
                    <motion.path
                        d="M 75 80 L 40 160 L 50 165 L 70 110 Z"
                        fill={hoveredPart === "Left Arm" ? "#E5E7EB" : "#F9FAFB"}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredPart("Left Arm")}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick("Left Arm")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    />
                    {/* Right Arm */}
                    <motion.path
                        d="M 125 80 L 160 160 L 150 165 L 130 110 Z"
                        fill={hoveredPart === "Right Arm" ? "#E5E7EB" : "#F9FAFB"}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredPart("Right Arm")}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick("Right Arm")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    />
                    {/* Left Leg */}
                    <motion.path
                        d="M 70 180 L 70 340 L 95 340 L 95 180 Z"
                        fill={hoveredPart === "Left Leg" ? "#E5E7EB" : "#F9FAFB"}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredPart("Left Leg")}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick("Left Leg")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    />
                    {/* Right Leg */}
                    <motion.path
                        d="M 105 180 L 105 340 L 130 340 L 130 180 Z"
                        fill={hoveredPart === "Right Leg" ? "#E5E7EB" : "#F9FAFB"}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoveredPart("Right Leg")}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={() => handlePartClick("Right Leg")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    />
                </g>
            </svg>
        </div>
    )
}
