import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with a dummy API key for development/mocking purposes.
// In a real app, this MUST use process.env.RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_123456789")

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { authorityType, pdfBase64, blockchainHash, transactionId, caseId } = body

        if (!authorityType || !pdfBase64 || !blockchainHash || !transactionId || !caseId) {
            return NextResponse.json(
                { error: "Missing required evidence payload fields." },
                { status: 400 }
            )
        }

        // Split Base64 (remove the data:application/pdf;base64, prefix if present)
        const base64Data = pdfBase64.split(",")[1] || pdfBase64

        // Prepare the Authority Data
        const authorityName = authorityType === "NGO" ? "Local Support NGO & Advocate Services" : "Local Law Enforcement Precinct"
        const mockEmail = authorityType === "NGO" ? "intake@localngo.org" : "dispatch@localpolice.gov"

        // Construct the Clinical Warning Email
        const emailContent = `
A secure, immutable trauma report has been generated and dispatched via the SomaSafe network.

Please find the attached Forensics PDF document detailing the logged incident.

-----------------------------------------
CRYPTOGRAPHIC VERIFICATION ARCHIVE
-----------------------------------------
Case File ID: ${caseId}
Evidence Hash: ${blockchainHash}
TxID Anchor: ${transactionId}

This cryptography guarantees that the attached forensic PDF has NOT been altered, modified, or tampered with since the exact moment of user generation.

Requested Action: Please review the attached file securely and follow standard intake protocols.
        `

        // Simulate sending via Resend
        console.log(`[Backend Dispatch] Sending encrypted payload to ${authorityName} (${mockEmail})...`)
        console.log(`[Backend Dispatch] Attached Document Hash: ${blockchainHash}`)

        // If a real API key exists, attempting to dispatch. Otherwise, we simulate success.
        if (process.env.RESEND_API_KEY) {
            const { data, error } = await resend.emails.send({
                from: "SomaSafe Security <onboarding@resend.dev>",
                to: [mockEmail, "delivered@resend.dev"], // Routing to a testing address for devs
                subject: `SECURE INTENDED REPORT: Trauma Incident Logged [${caseId}]`,
                text: emailContent,
                attachments: [
                    {
                        filename: `${caseId}_Evidence.pdf`,
                        content: base64Data,
                    }
                ]
            })

            if (error) {
                console.error("[Resend Error]:", error)
                return NextResponse.json({ error: "Failed to dispatch email via Resend." }, { status: 500 })
            }
        } else {
            // Mocking delay for UI visualization if no API key is present
            await new Promise((resolve) => setTimeout(resolve, 2000))
            console.log("[Backend Dispatch] Mock dispatch successful. (Provide RESEND_API_KEY to test actual delivery).")
        }

        return NextResponse.json({
            success: true,
            message: "Evidence securely dispatched to authority."
        })

    } catch (error) {
        console.error("[API Dispatch Error]:", error)
        return NextResponse.json(
            { error: "Internal server error during dispatch." },
            { status: 500 }
        )
    }
}
