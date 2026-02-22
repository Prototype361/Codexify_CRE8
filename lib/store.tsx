"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import * as THREE from "three"

export type InjuryMechanism = "Blunt" | "Burn" | "Pressure" | "Sharp"

export interface LoggedInjury {
    id: string
    position: THREE.Vector3
    mechanism: InjuryMechanism
    color: string
    date: string
    time: string
    timestamp: string
}

export interface PendingInjury {
    id: string
    position: THREE.Vector3
}

interface InjuryStoreContext {
    loggedInjuries: LoggedInjury[]
    pendingInjuries: PendingInjury[]
    setPendingInjuries: (injuries: PendingInjury[]) => void
    addInjury: (mechanism: InjuryMechanism, date: string, time: string) => void
    removeInjury: (id: string) => void
    clearSession: () => void
}

const InjuryStore = createContext<InjuryStoreContext | undefined>(undefined)

export function InjuryStoreProvider({ children }: { children: ReactNode }) {
    const [loggedInjuries, setLoggedInjuries] = useState<LoggedInjury[]>([])
    const [pendingInjuries, setPendingInjuries] = useState<PendingInjury[]>([])

    const getColorForMechanism = (mechanism: InjuryMechanism) => {
        switch (mechanism) {
            case "Blunt": return "#3b82f6" // blue-500
            case "Burn": return "#f97316" // orange-500
            case "Pressure": return "#22c55e" // green-500
            case "Sharp": return "#a855f7" // purple-500
            default: return "#ef4444" // red-500 fallback
        }
    }

    const addInjury = (mechanism: InjuryMechanism, date: string, time: string) => {
        if (pendingInjuries.length === 0) return

        const newInjuries: LoggedInjury[] = pendingInjuries.map(pending => ({
            id: crypto.randomUUID(),
            position: pending.position,
            mechanism,
            color: getColorForMechanism(mechanism),
            date,
            time,
            timestamp: new Date().toISOString()
        }))

        setLoggedInjuries((prev) => [...prev, ...newInjuries])
        setPendingInjuries([])
    }

    const removeInjury = (id: string) => {
        setLoggedInjuries((prev) => prev.filter(inj => inj.id !== id))
    }

    const clearSession = () => {
        setLoggedInjuries([])
        setPendingInjuries([])
    }

    return (
        <InjuryStore.Provider value={{
            loggedInjuries,
            pendingInjuries,
            setPendingInjuries,
            addInjury,
            removeInjury,
            clearSession
        }}>
            {children}
        </InjuryStore.Provider>
    )
}

export function useInjuryStore() {
    const context = useContext(InjuryStore)
    if (context === undefined) {
        throw new Error("useInjuryStore must be used within an InjuryStoreProvider")
    }
    return context
}
