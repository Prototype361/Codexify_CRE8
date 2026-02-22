import type { BodyPart } from "@/components/ui/BodyMap"
import type { InjuryType, RecurrenceType, TimingType } from "@/components/ui/InputModal"

// Professional Medical Terminology Mapping
const CLINICAL_TYPES: Record<InjuryType, string> = {
    "Bruise": "Ecchymosis",
    "Cut/Laceration": "Laceration",
    "Burn": "Thermal injury",
    "Pressure Mark": "Erythema / pressure indentation",
    "Internal Pain": "Localized musculoskeletal tenderness",
}

const CLINICAL_PARTS: Record<BodyPart, string> = {
    "Head": "cranial / facial region",
    "Torso": "anterior/posterior thoracic and abdominal region",
    "Left Arm": "left upper extremity (radius/ulna/humerus)",
    "Right Arm": "right upper extremity (radius/ulna/humerus)",
    "Left Leg": "left lower extremity (femur/tibia/fibula)",
    "Right Leg": "right lower extremity (femur/tibia/fibula)",
}

const CLINICAL_TIMING: Record<TimingType, string> = {
    "Today": "acute (typically <24 hours)",
    "Yesterday": "recent (typically 24-48 hours)",
    "Last Week": "subacute (typically 3-7 days)",
    "Older": "chronic or resolving (>7 days)",
}

// Internal severity mapper (1-5) based on likelihood of needing immediate intervention
const SEVERITY_MAP: Record<InjuryType, number> = {
    "Bruise": 2,
    "Cut/Laceration": 4,
    "Burn": 4,
    "Pressure Mark": 2,
    "Internal Pain": 3,
}

export interface MedicalRecord {
    clinicalDescription: string
    severityLevel: number
    isChronic: boolean
    originalInput: {
        type: string
        part: string
        recurrence: string
        timing: string
    }
}

/**
 * Translates simple user-submitted injury data into professional clinical terminology
 */
export function translateToClinicalTerm(
    type: InjuryType,
    part: BodyPart,
    recurrence: RecurrenceType,
    timing: TimingType
): MedicalRecord {
    const isChronic = recurrence === "Chronic" || recurrence === "Happened before"
    const recurrenceText = isChronic ? "with noted history of recurrence" : "noted as a primary incident"

    const clinicalDescription = `${CLINICAL_TYPES[type]} noted on the ${CLINICAL_PARTS[part]}. The presentation is consistent with ${CLINICAL_TIMING[timing]} onset, ${recurrenceText}.`

    return {
        clinicalDescription,
        severityLevel: SEVERITY_MAP[type] || 1,
        isChronic,
        originalInput: {
            type,
            part,
            recurrence,
            timing
        }
    }
}
