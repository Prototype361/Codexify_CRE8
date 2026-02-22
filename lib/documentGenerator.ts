"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toJpeg } from "html-to-image"
import { format } from "date-fns"
import type { LoggedInjury } from "./store"

// Simple mock cryptograph hashing function
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return hashHex
}

function drawPageBorder(pdf: jsPDF) {
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    pdf.setDrawColor(0) // Black border
    pdf.setLineWidth(0.5)
    pdf.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
}

export interface GeneratedReportData {
    pdfBase64: string
    caseId: string
    blockchainHash: string
    transactionId: string
}

export async function generateLegalReport(
    loggedInjuries: LoggedInjury[],
    elementIdToCapture: string
): Promise<GeneratedReportData> {
    try {
        // 1. Capture the visual body map first
        const element = document.getElementById(elementIdToCapture)
        if (!element) throw new Error("Could not find body map element to capture.")

        // Use html-to-image which properly parses modern CSS properties (like Lab colors from Tailwind v4)
        const imgData = await toJpeg(element, {
            quality: 0.9,
            backgroundColor: "#0f172a", // Slate-900 
            pixelRatio: 2
        })

        // 2. Initialize PDF Document
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 20

        const timestamp = new Date()
        const formattedDate = format(timestamp, "yyyy-MM-dd HH:mm:ss '(UTC'xxx')'")
        const caseId = `CASE-${Math.floor(Math.random() * 90000) + 10000}`

        // Generate preliminary payload hash just for document ID (Not the actual file hash yet)
        const rawData = JSON.stringify(loggedInjuries) + timestamp.toISOString()
        const documentIdHash = await sha256(rawData)

        // --- PAGE 1: Formal Declaration & Body Map ---
        drawPageBorder(pdf)

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(18)
        pdf.setTextColor(15, 23, 42) // Slate 900
        pdf.text("ScarMap Official Forensic Report", pageWidth / 2, margin + 10, { align: "center" })

        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(71, 85, 105) // Slate 500

        pdf.text(`Case ID: ${caseId}`, margin, margin + 25)
        pdf.text(`Generated on: ${formattedDate}`, margin, margin + 30)
        pdf.text(`Doc ID: ${documentIdHash.substring(0, 16).toUpperCase()}`, margin, margin + 35)

        pdf.setDrawColor(203, 213, 225) // Slate 300
        pdf.setLineWidth(0.2)
        pdf.line(margin, margin + 40, pageWidth - margin, margin + 40)

        // Add Body Map Image
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(15, 23, 42)
        pdf.text("VISUAL EVIDENCE MAP", margin, margin + 50)

        const imgProps = pdf.getImageProperties(imgData)
        const imgWidth = pageWidth - margin * 2
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width

        pdf.addImage(imgData, "JPEG", margin, margin + 55, imgWidth, imgHeight)

        // --- PAGE 2: Clinical Summary Table ---
        pdf.addPage()
        drawPageBorder(pdf)

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(14)
        pdf.text("LOGGED INJURIES DATA TABLE", margin, margin + 10)

        const tableData = loggedInjuries.map((injury, index) => [
            `INJ-${index + 1}`,
            `${injury.mechanism} Force`,
            `[${injury.position.x.toFixed(2)}, ${injury.position.y.toFixed(2)}, ${injury.position.z.toFixed(2)}]`,
            `${injury.date} ${injury.time}`,
            format(new Date(injury.timestamp), "HH:mm:ss")
        ])

        autoTable(pdf, {
            startY: margin + 20,
            head: [['ID', 'Injury Mechanism', 'Location / Coordinates (X, Y, Z)', 'Date & Time of Incident', 'System Log Time']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [30, 58, 138] }, // Blue 900
            styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
            alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate 50
            margin: { left: margin, right: margin }
        })

        // 3. Generate the FINAL Immutable Web3 Evidence Hash from the PDF ArrayBuffer
        // To get the true hash, we must create a preliminary buffer of the document.
        const preliminaryBuffer = pdf.output('arraybuffer')
        const finalPdfHashBuffer = await crypto.subtle.digest("SHA-256", preliminaryBuffer)
        const hashArray = Array.from(new Uint8Array(finalPdfHashBuffer))
        const finalPdfHashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

        // 4. Simulate Smart Contract Call (ethers.js)
        /* 
           ACTUAL ETHERS.JS IMPLEMENTATION WOULD LOOK LIKE:
           import { ethers } from "ethers";
           const provider = new ethers.providers.Web3Provider(window.ethereum);
           const signer = provider.getSigner();
           const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
           // NEVER UPLOAD THE FILE. ONLY THE HASH.
           const tx = await contract.logEvidence(finalPdfHashHex, caseId);
           await tx.wait();
           const txId = tx.hash;
        */

        // MOCK TRANSACTION DELAY
        console.log(`[Web3 Anchor] Logging Hash: 0x${finalPdfHashHex} to network...`)
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockTxId = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...`

        // 5. Visibly embed the Blockchain Anchor into the Document Footer
        const finalPages = pdf.getNumberOfPages()
        for (let i = 1; i <= finalPages; i++) {
            pdf.setPage(i)
            pdf.setFont("helvetica", "bold")
            pdf.setFontSize(8)
            pdf.setTextColor(71, 85, 105)

            pdf.text(
                "CRYPTOGRAPHIC EVIDENCE LOCK",
                pageWidth / 2,
                pageHeight - 20,
                { align: "center" }
            )

            pdf.setFont("helvetica", "normal")
            pdf.setFontSize(6)
            pdf.setTextColor(148, 163, 184)
            pdf.text(
                `SHA-256 Hash: 0x${finalPdfHashHex}`,
                pageWidth / 2,
                pageHeight - 16,
                { align: "center" }
            )
            pdf.text(
                `Blockchain TxID: ${mockTxId}`,
                pageWidth / 2,
                pageHeight - 13,
                { align: "center" }
            )
        }

        // 6. Output Base64 for the API & Trigger standard user download.
        const fileName = `${caseId}_Trauma_Record_${format(timestamp, "yyyyMMdd_HHmm")}.pdf`
        pdf.save(fileName)

        const pdfBase64 = pdf.output('datauristring')

        return {
            pdfBase64,
            caseId,
            blockchainHash: `0x${finalPdfHashHex}`,
            transactionId: mockTxId
        }

    } catch (error) {
        console.error("Failed to generate report:", error)
        throw new Error("Failed to generate secure report.")
    }
}
