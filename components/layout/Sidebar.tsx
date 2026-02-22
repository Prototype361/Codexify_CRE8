"use client"

import { useState } from "react"
import { Hammer, Flame, Hand, Scissors, Lock, FileText, CheckCircle2, Loader2, Clock } from "lucide-react"
import { useInjuryStore, type InjuryMechanism } from "@/lib/store"
import { generateLegalReport } from "@/lib/documentGenerator"

interface ActionCardProps {
    title: string
    description: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    mechanism: InjuryMechanism
    isActive: boolean
    isSelected: boolean
    onClick: () => void
}

function ActionCard({ title, description, icon, iconBg, iconColor, mechanism, isActive, isSelected, onClick }: ActionCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={!isActive}
            className={`
        relative flex w-full items-start gap-4 rounded-xl border p-4 text-left shadow-sm transition-all group
        ${isActive
                    ? isSelected
                        ? "bg-blue-50/50 border-blue-500 shadow-md dark:bg-blue-900/20 dark:border-blue-400"
                        : "bg-white border-neutral-200 hover:border-blue-400 hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800 cursor-pointer"
                    : "bg-white border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 opacity-60 cursor-not-allowed"}
      `}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor} transition-transform ${isActive ? 'group-hover:scale-110' : ''}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className={`font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 ${isActive ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}`}>
                    {title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {description}
                </p>
            </div>

            {(isActive && isSelected) && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 text-blue-500 transition-opacity">
                    <CheckCircle2 className="w-5 h-5 fill-blue-100 dark:fill-blue-900/30" />
                </div>
            )}
        </button>
    )
}

export function Sidebar() {
    const { pendingInjuries, loggedInjuries, addInjury } = useInjuryStore()
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedMechanism, setSelectedMechanism] = useState<InjuryMechanism | null>(null)
    const [incidentDate, setIncidentDate] = useState("")
    const [incidentTime, setIncidentTime] = useState("")

    // Ticketing State
    const [evidenceData, setEvidenceData] = useState<Awaited<ReturnType<typeof generateLegalReport>> | null>(null)
    const [showTicketModal, setShowTicketModal] = useState(false)
    const [isDispatching, setIsDispatching] = useState(false)
    const [ticketSent, setTicketSent] = useState(false)
    const [consentChecked, setConsentChecked] = useState(false)

    const canExport = loggedInjuries.length > 0
    const hasPending = pendingInjuries.length > 0
    const canConfirm = selectedMechanism && incidentDate && incidentTime

    const handleConfirm = () => {
        if (selectedMechanism && incidentDate && incidentTime) {
            addInjury(selectedMechanism, incidentDate, incidentTime)
            setSelectedMechanism(null)
            setIncidentDate("")
            setIncidentTime("")
        }
    }

    const handleExport = async () => {
        if (!canExport) return
        setIsGenerating(true)
        try {
            const data = await generateLegalReport(loggedInjuries, "scene-container")
            setEvidenceData(data)
            setShowTicketModal(true)
        } catch (e) {
            console.error(e)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDispatch = async (authorityType: "NGO" | "POLICE") => {
        if (!evidenceData || !consentChecked) return
        setIsDispatching(true)

        try {
            const response = await fetch('/api/dispatch-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    authorityType,
                    pdfBase64: evidenceData.pdfBase64,
                    blockchainHash: evidenceData.blockchainHash,
                    transactionId: evidenceData.transactionId,
                    caseId: evidenceData.caseId
                })
            })

            if (response.ok) {
                setTicketSent(true)
                // Cleanup sensitive data from local memory post-dispatch
                setEvidenceData(null)
                // Hide modal after a few seconds
                setTimeout(() => setShowTicketModal(false), 3000)
            } else {
                alert("Connection error. Your file is saved locally. Please try again or call emergency services directly.")
            }
        } catch (error) {
            alert("Connection error. Your file is saved locally. Please try again or call emergency services directly.")
            console.error(error)
        } finally {
            setIsDispatching(false)
        }
    }

    return (
        <aside className="relative flex w-full flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto pr-2 pb-6">

            {/* Sliding Ticketing Modal Overlay */}
            {showTicketModal && (
                <div className="absolute inset-0 z-50 flex flex-col bg-white dark:bg-neutral-950 animate-in slide-in-from-bottom-8 duration-300 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white capitalize leading-tight mb-2">
                        Evidence Locked.
                        <span className="block text-green-600 dark:text-green-500 text-lg mt-1">Request Immediate Assistance?</span>
                    </h2>

                    {ticketSent ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-in zoom-in" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Secure Ticket Dispatched</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">The authorized party has been notified securely.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                                Your forensic report has been generated securely to your device. Would you like to securely transmit this immutable report to a trusted authority?
                            </p>

                            {/* Secure Data Summary */}
                            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-4 mb-6 border border-neutral-200 dark:border-neutral-800">
                                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider mb-2">Blockchain Verification</p>
                                <p className="text-xs text-neutral-700 dark:text-neutral-300 break-all mb-1 font-mono">
                                    <span className="font-semibold select-none">ID:</span> {evidenceData?.blockchainHash}
                                </p>
                                <p className="text-xs text-neutral-700 dark:text-neutral-300 break-all font-mono">
                                    <span className="font-semibold select-none">TX:</span> {evidenceData?.transactionId}
                                </p>
                            </div>

                            <label className="flex items-start gap-3 mb-6 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                <input
                                    type="checkbox"
                                    className="mt-1 flex-shrink-0 w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:checked:bg-blue-500"
                                    checked={consentChecked}
                                    onChange={(e) => setConsentChecked(e.target.checked)}
                                />
                                <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                                    I explicitly authorize sharing this encrypted report with the selected authority below.
                                </span>
                            </label>

                            <div className="flex flex-col gap-3 mt-auto">
                                <button
                                    disabled={!consentChecked || isDispatching}
                                    onClick={() => handleDispatch("NGO")}
                                    className={`w-full rounded-xl py-3.5 px-4 font-bold flex items-center justify-center gap-2 transition-all ${consentChecked ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.98]' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'}`}
                                >
                                    {isDispatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                    Alert Local NGO / Advocate
                                </button>

                                <button
                                    disabled={!consentChecked || isDispatching}
                                    onClick={() => handleDispatch("POLICE")}
                                    className={`w-full rounded-xl py-3.5 px-4 font-bold flex items-center justify-center gap-2 transition-all ${consentChecked ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-[0.98]' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'}`}
                                >
                                    {isDispatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                    Alert Law Enforcement
                                </button>

                                <button
                                    disabled={isDispatching}
                                    onClick={() => {
                                        setShowTicketModal(false)
                                        setEvidenceData(null) // Cleanup memory
                                    }}
                                    className="w-full mt-2 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                                >
                                    Cancel & Keep Local Only
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}


            {/* Section 1: Incident Logging */}
            <section className={`flex flex-col gap-4 transition-opacity duration-300 ${showTicketModal ? 'opacity-0 select-none pointer-events-none' : 'opacity-100'}`}>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                        Incident Logging
                        {hasPending && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                    </h2>
                    <p className={`text-sm transition-colors ${hasPending ? 'text-blue-600 font-medium dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {hasPending ? `${pendingInjuries.length} location${pendingInjuries.length !== 1 ? 's' : ''} selected. Choose injury type below.` : "Select a point on the body map to begin."}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <ActionCard
                        title="Blunt Force"
                        description="Bruising, contusions, swelling."
                        icon={<Hammer className="h-5 w-5" />}
                        iconBg="bg-blue-100 dark:bg-blue-900/30"
                        iconColor="text-blue-600 dark:text-blue-400"
                        mechanism="Blunt"
                        isActive={hasPending}
                        isSelected={selectedMechanism === "Blunt"}
                        onClick={() => setSelectedMechanism("Blunt")}
                    />
                    <ActionCard
                        title="Burn / Heat"
                        description="Thermal injuries, scalds, brands."
                        icon={<Flame className="h-5 w-5" />}
                        iconBg="bg-orange-100 dark:bg-orange-900/30"
                        iconColor="text-orange-600 dark:text-orange-400"
                        mechanism="Burn"
                        isActive={hasPending}
                        isSelected={selectedMechanism === "Burn"}
                        onClick={() => setSelectedMechanism("Burn")}
                    />
                    <ActionCard
                        title="Pressure"
                        description="Grip marks, ligature, compression."
                        icon={<Hand className="h-5 w-5" />}
                        iconBg="bg-green-100 dark:bg-green-900/30"
                        iconColor="text-green-600 dark:text-green-400"
                        mechanism="Pressure"
                        isActive={hasPending}
                        isSelected={selectedMechanism === "Pressure"}
                        onClick={() => setSelectedMechanism("Pressure")}
                    />
                    <ActionCard
                        title="Sharp Force"
                        description="Lacerations, incisions, punctures."
                        icon={<Scissors className="h-5 w-5" />}
                        iconBg="bg-purple-100 dark:bg-purple-900/30"
                        iconColor="text-purple-600 dark:text-purple-400"
                        mechanism="Sharp"
                        isActive={hasPending}
                        isSelected={selectedMechanism === "Sharp"}
                        onClick={() => setSelectedMechanism("Sharp")}
                    />
                </div>

                {/* New Timeline Section */}
                {hasPending && (
                    <div className="mt-2 flex flex-col gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neutral-500" /> Timeline
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">Date of Incident</label>
                                <input
                                    type="date"
                                    value={incidentDate}
                                    onChange={(e) => setIncidentDate(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">Approx. Time</label>
                                <input
                                    type="time"
                                    value={incidentTime}
                                    onChange={(e) => setIncidentTime(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                        <button
                            disabled={!canConfirm}
                            onClick={handleConfirm}
                            className={`mt-2 w-full rounded-xl py-3.5 font-bold transition-all ${canConfirm
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.98]'
                                : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
                                }`}
                        >
                            Confirm & Log Injury
                        </button>
                    </div>
                )}
            </section>

            {/* Spacer to push export card to bottom if container is tall */}
            <div className={`flex-1 min-h-[1rem] transition-opacity duration-300 ${showTicketModal ? 'opacity-0' : 'opacity-100'}`} />

            {/* Section 2: Generate Legal Record */}
            <section className={`rounded-2xl p-6 text-white shadow-xl border transition-all shrink-0 ${canExport ? 'bg-neutral-900 dark:bg-neutral-950 border-neutral-800' : 'bg-neutral-800/50 border-transparent opacity-80'} ${showTicketModal ? 'opacity-0 select-none pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-lg font-bold mb-2">Generate Legal Record</h3>
                <p className="text-sm text-neutral-400 mb-6">
                    Finalize and digitally lock the {canExport ? loggedInjuries.length : '0'} logged injuries into a secure PDF.
                </p>

                {/* Attachment Mockup */}
                <div className={`flex items-center gap-3 rounded-lg p-3 mb-6 border transition-colors ${canExport ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-800/30 border-neutral-800'}`}>
                    <div className="rounded bg-neutral-700 p-2">
                        <FileText className="h-5 w-5 text-neutral-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xs font-bold uppercase tracking-wider ${canExport ? 'text-green-400' : 'text-neutral-500'}`}>
                            {canExport ? 'Ready for Sealing' : 'Pending Data'}
                        </span>
                        <span className={`text-sm font-medium ${canExport ? 'text-white' : 'text-neutral-500'}`}>Immutable Proof</span>
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    disabled={!canExport || isGenerating}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-all
            ${canExport && !isGenerating
                            ? 'bg-white text-neutral-900 active:scale-[0.98] hover:bg-neutral-100 shadow-md'
                            : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'}
          `}
                >
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                    {isGenerating ? 'Anchoring to Web3...' : 'Generate & Secure'}
                </button>
            </section>
        </aside>
    )
}
