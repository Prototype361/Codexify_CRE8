"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, FileText } from "lucide-react"
import { BodyMap, type BodyPart } from "@/components/ui/BodyMap"
import { InputModal, type InjuryReport } from "@/components/ui/InputModal"
import { QuickExit } from "@/components/ui/QuickExit"
import { generateLegalReport } from "@/lib/documentGenerator"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { Sidebar } from "@/components/layout/Sidebar"
import { Canvas3D } from "@/components/3d/HumanModel"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      <GlobalHeader />

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
          {/* Left Column (3D Canvas Box - ~60%) */}
          <div id="scene-container" className="lg:col-span-7 xl:col-span-8 flex flex-col h-[600px] lg:h-[calc(100vh-8rem)] bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-4 relative overflow-hidden">
            <Canvas3D />
          </div>

          {/* Right Column (Sidebar - ~40%) */}
          <div className="lg:col-span-5 xl:col-span-4 h-full">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
