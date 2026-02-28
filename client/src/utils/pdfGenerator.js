// Generates a PDF report using jsPDF

export async function generatePDFReport(result, form) {
  // Dynamic imports — keeps initial bundle small
  const { default: jsPDF }     = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc   = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW  = doc.internal.pageSize.getWidth()
  const margin = 20

  doc.setFillColor(5, 8, 16)
  doc.rect(0, 0, pageW, 297, 'F')

  // Brand header
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('⚡ PATENTGUARD AI — NOVELTY INTELLIGENCE ENGINE', margin, 28)

  // Divider line
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.3)
  doc.line(margin, 32, pageW - margin, 32)

  // Title
  doc.setTextColor(226, 232, 240)
  doc.setFontSize(26)
  doc.text('Patentability Intelligence', margin, 48)
  doc.text('Report', margin, 60)

  // Invention details
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invention:  ${form.title}`,  margin, 78)
  doc.text(`Domain:     ${form.domain}`, margin, 86)
  doc.text(`Market:     ${form.market || 'Not specified'}`, margin, 94)
  doc.text(
    `Generated:  ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
    margin, 102
  )

  // Score box
  doc.setFillColor(13, 20, 36)
  doc.roundedRect(margin, 116, 70, 44, 5, 5, 'F')
  doc.setDrawColor(16, 185, 129)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, 116, 70, 44, 5, 5, 'S')

  doc.setTextColor(16, 185, 129)
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  doc.text(`${result.score}`, margin + 8, 143)

  doc.setFontSize(11)
  doc.setTextColor(148, 163, 184)
  doc.text('/100', margin + 34, 143)

  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.text('PATENTABILITY SCORE', margin + 8, 152)

  // Verdict
  const verdict =
    result.score >= 70 ? 'HIGHLY PATENTABLE' :
    result.score >= 50 ? 'POTENTIALLY NOVEL' :
    'NEEDS DIFFERENTIATION'
  doc.setTextColor(result.score >= 70 ? 16 : result.score >= 50 ? 245 : 239,
                   result.score >= 70 ? 185 : result.score >= 50 ? 158 : 68,
                   result.score >= 70 ? 129 : result.score >= 50 ? 11 : 68)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(verdict, margin + 80, 136)

  // ── PAGE 2: Analysis ─────────────────────────────────────
  doc.addPage()
  doc.setFillColor(5, 8, 16)
  doc.rect(0, 0, pageW, 297, 'F')

  let y = 24

  // Section: Scoring Breakdown
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SCORING BREAKDOWN', margin, y)
  y += 8

  const metricsData = Object.entries(result.metrics || {}).map(([key, val]) => [
    key.replace(/([A-Z])/g, ' $1').trim().toUpperCase(),
    `${val} / 100`,
    val >= 70 ? '●●●●●' : val >= 50 ? '●●●○○' : '●●○○○',
  ])

  autoTable(doc, {
    startY: y,
    head:   [['Metric', 'Score', 'Rating']],
    body:   metricsData,
    theme:  'plain',
    headStyles: { textColor: [148, 163, 184], fontSize: 8, fontStyle: 'bold', fillColor: [8, 13, 26] },
    bodyStyles: { textColor: [226, 232, 240], fontSize: 9,  fillColor: [13, 20, 36]  },
    alternateRowStyles: { fillColor: [8, 13, 26] },
    margin: { left: margin, right: margin },
  })

  y = doc.lastAutoTable.finalY + 16

  // Section: Claims
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(8)
  doc.text('CLAIM STRUCTURE ANALYSIS', margin, y)
  y += 8

  const claimsData = (result.claims || []).map((c, i) => [
    `Claim ${i + 1}`,
    c.type.toUpperCase(),
    c.text,
  ])

  autoTable(doc, {
    startY: y,
    head:   [['#', 'Type', 'Claim Text']],
    body:   claimsData,
    theme:  'plain',
    headStyles: { textColor: [148, 163, 184], fontSize: 8, fillColor: [8, 13, 26] },
    bodyStyles: { textColor: [226, 232, 240], fontSize: 8, fillColor: [13, 20, 36]  },
    columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 28 }, 2: { cellWidth: 'auto' } },
    alternateRowStyles: { fillColor: [8, 13, 26] },
    margin: { left: margin, right: margin },
  })

  // ── PAGE 3: Prior Art + Gaps ──────────────────────────────
  doc.addPage()
  doc.setFillColor(5, 8, 16)
  doc.rect(0, 0, pageW, 297, 'F')

  y = 24

  doc.setTextColor(59, 130, 246)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SIMILAR PRIOR ART — VECTOR SEARCH RESULTS', margin, y)
  y += 8

  const patentsData = (result.similarPatents || []).map((p, i) => [
    `${i + 1}`,
    p.patentNumber,
    `${p.similarityScore}%`,
    p.title,
    p.domain,
  ])

  autoTable(doc, {
    startY: y,
    head:   [['#', 'Patent Number', 'Similarity', 'Title', 'Domain']],
    body:   patentsData,
    theme:  'plain',
    headStyles: { textColor: [148, 163, 184], fontSize: 8, fillColor: [8, 13, 26] },
    bodyStyles: { textColor: [226, 232, 240], fontSize: 8, fillColor: [13, 20, 36]  },
    columnStyles: {
      0: { cellWidth: 8  },
      1: { cellWidth: 38 },
      2: { cellWidth: 20 },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 30 },
    },
    alternateRowStyles: { fillColor: [8, 13, 26] },
    margin: { left: margin, right: margin },
  })

  y = doc.lastAutoTable.finalY + 16

  doc.setTextColor(16, 185, 129)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('INNOVATION GAP DETECTION', margin, y)
  y += 10

  ;(result.innovationGaps || []).forEach((gap, i) => {
    if (y > 260) {
      doc.addPage()
      doc.setFillColor(5, 8, 16)
      doc.rect(0, 0, pageW, 297, 'F')
      y = 24
    }

    doc.setTextColor(16, 185, 129)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`${i + 1}. ${gap.title}`, margin, y)
    y += 6

    doc.setTextColor(148, 163, 184)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(gap.description, pageW - margin * 2)
    doc.text(lines, margin, y)
    y += lines.length * 4.5 + 8
  })

  // ── Footer on all pages ───────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(5, 8, 16)
    doc.rect(0, 285, pageW, 12, 'F')
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(0.2)
    doc.line(margin, 286, pageW - margin, 286)
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `PatentGuard AI — Confidential · ${form.title} · Page ${i} of ${totalPages}`,
      margin,
      292
    )
  }

  const filename = `PatentGuard_${form.title.replace(/\s+/g, '_').slice(0, 40)}.pdf`
  doc.save(filename)
}