// PatentGuard AI — pdfGenerator.js — POLISHED VERSION
export async function generatePDFReport(result, form) {
  const { default: jsPDF }     = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc   = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW  = doc.internal.pageSize.getWidth()
  const margin = 20

  // ── Helper: draw colored rect ─────────────────────────
  const fillRect = (x, y, w, h, r, g, b) => {
    doc.setFillColor(r, g, b)
    doc.rect(x, y, w, h, 'F')
  }

  // ── PAGE 1: Cover ─────────────────────────────────────
  fillRect(0, 0, pageW, 297, 5, 8, 16)

  // Top accent bar
  fillRect(0, 0, pageW, 2, 59, 130, 246)

  // Logo area — text based (no image needed)
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('⚡', margin, 18)
  doc.setTextColor(226, 232, 240)
  doc.text('PatentGuard', margin + 8, 18)
  doc.setTextColor(59, 130, 246)
  doc.text('AI', margin + 36, 18)

  // Tag line
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('NOVELTY INTELLIGENCE ENGINE', margin + 8, 23)

  // Divider
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.3)
  doc.line(margin, 27, pageW - margin, 27)

  // Report title
  doc.setTextColor(226, 232, 240)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('Patentability', margin, 50)
  doc.text('Intelligence Report', margin, 64)

  // Invention details box
  fillRect(margin, 75, pageW - margin * 2, 38, 13, 20, 36)
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.4)
  doc.rect(margin, 75, pageW - margin * 2, 38, 'S')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(148, 163, 184)
  doc.text('INVENTION', margin + 5, 84)
  doc.text('DOMAIN', margin + 5, 92)
  doc.text('MARKET', margin + 5, 100)
  doc.text('DATE', margin + 5, 108)

  doc.setTextColor(226, 232, 240)
  doc.setFont('helvetica', 'normal')
  const invTitle = (form.title || 'Untitled').slice(0, 55)
  doc.text(invTitle,                        margin + 32, 84)
  doc.text((form.domain  || 'N/A').slice(0, 50), margin + 32, 92)
  doc.text((form.market  || 'N/A').slice(0, 50), margin + 32, 100)
  doc.text(new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }), margin + 32, 108)

  // Score box
  const scoreColor =
    result.score >= 70 ? [16, 185, 129] :
    result.score >= 50 ? [245, 158, 11]  :
                         [239, 68,  68]

  fillRect(margin, 125, 70, 50, 13, 20, 36)
  doc.setDrawColor(...scoreColor)
  doc.setLineWidth(0.8)
  doc.rect(margin, 125, 70, 50, 'S')

  // Score number
  doc.setTextColor(...scoreColor)
  doc.setFontSize(42)
  doc.setFont('helvetica', 'bold')
  doc.text(String(result.score), margin + 8, 158)

  doc.setFontSize(12)
  doc.setTextColor(148, 163, 184)
  doc.text('/100', margin + 44, 158)

  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.text('PATENTABILITY SCORE', margin + 5, 168)

  // Verdict
  const verdict =
    result.score >= 70 ? 'HIGHLY PATENTABLE' :
    result.score >= 50 ? 'POTENTIALLY NOVEL' :
                         'NEEDS DIFFERENTIATION'

  doc.setTextColor(...scoreColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(verdict, margin + 80, 148)

  // Summary text
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184)
  const summary =
    result.score >= 70
      ? 'Low prior art overlap detected. Strong novelty indicators present.\nRecommendation: Proceed with patent filing.'
      : result.score >= 50
      ? 'Moderate prior art overlap. Some differentiation work needed.\nRecommendation: Refine claims before filing.'
      : 'High prior art overlap detected. Significant differentiation required.\nRecommendation: Redesign core claims.'
  doc.text(summary, margin + 80, 158, { maxWidth: pageW - margin - 80 - 10 })

  // Stats row
  const stats = [
    { label: 'PRIOR ART FOUND',  value: String(result.similarPatents?.length || 0) },
    { label: 'CLAIMS EXTRACTED', value: String(result.claims?.length || 0) },
    { label: 'INNOVATION GAPS',  value: String(result.innovationGaps?.length || 0) },
    { label: 'PROCESSING TIME',  value: `${result.processingTimeMs || 0}ms` },
  ]

  let sx = margin
  stats.forEach(stat => {
    fillRect(sx, 190, 38, 22, 13, 20, 36)
    doc.setDrawColor(30, 50, 80)
    doc.rect(sx, 190, 38, 22, 'S')
    doc.setTextColor(...scoreColor)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(stat.value, sx + 4, 202)
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    doc.text(stat.label, sx + 4, 208)
    sx += 42
  })

  // ── PAGE 2: Scoring + Claims ─────────────────────────
  doc.addPage()
  fillRect(0, 0, pageW, 297, 5, 8, 16)
  fillRect(0, 0, pageW, 2, 59, 130, 246)

  let y = 20

  // Section header
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SCORING BREAKDOWN', margin, y)
  y += 2

  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.2)
  doc.line(margin, y, pageW - margin, y)
  y += 8

  // Metrics with visual bars (ASCII-safe)
  const metrics = [
    { label: 'Novelty Index',         value: result.metrics?.noveltyIndex         || 0, color: [16, 185, 129] },
    { label: 'Claim Differentiation', value: result.metrics?.claimDifferentiation || 0, color: [59, 130, 246] },
    { label: 'Similarity Inverse',    value: result.metrics?.similarityInverse    || 0, color: [245, 158, 11]  },
    { label: 'Domain Clustering',     value: result.metrics?.domainClustering     || 0, color: [167, 139, 250] },
    { label: 'Keyword Density',       value: result.metrics?.keywordDensity       || 0, color: [34, 211, 238]  },
  ]

  metrics.forEach(m => {
    // Label
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(m.label.toUpperCase(), margin, y)

    // Score number
    doc.setTextColor(...m.color)
    doc.setFont('helvetica', 'bold')
    doc.text(`${m.value}`, pageW - margin - 10, y, { align: 'right' })

    // Background bar
    fillRect(margin + 52, y - 3.5, 90, 4, 20, 30, 50)

    // Filled bar
    const barWidth = (m.value / 100) * 90
    fillRect(margin + 52, y - 3.5, barWidth, 4, ...m.color)

    y += 10
  })

  y += 4

  // Claims section
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('CLAIM STRUCTURE ANALYSIS', margin, y)
  y += 2
  doc.setDrawColor(59, 130, 246)
  doc.line(margin, y, pageW - margin, y)
  y += 6

  const claimsData = (result.claims || []).map((c, i) => [
    `Claim ${i + 1}`,
    c.type === 'independent' ? 'INDEPENDENT' : 'DEPENDENT',
    c.text || '',
  ])

  autoTable(doc, {
    startY: y,
    head:   [['#', 'Type', 'Claim Text']],
    body:   claimsData,
    theme:  'plain',
    styles: {
      fontSize:  7.5,
      cellPadding: 3,
      textColor: [226, 232, 240],
      fillColor: [13, 20, 36],
      lineColor: [30, 50, 80],
      lineWidth: 0.1,
    },
    headStyles: {
      textColor:  [148, 163, 184],
      fillColor:  [8, 13, 26],
      fontStyle:  'bold',
      fontSize:   7,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 26 },
      2: { cellWidth: 'auto' },
    },
    alternateRowStyles: { fillColor: [8, 13, 26] },
    margin: { left: margin, right: margin },
  })

  // ── PAGE 3: Prior Art + Gaps ─────────────────────────
  doc.addPage()
  fillRect(0, 0, pageW, 297, 5, 8, 16)
  fillRect(0, 0, pageW, 2, 59, 130, 246)

  y = 20

  doc.setTextColor(59, 130, 246)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SIMILAR PRIOR ART — VECTOR SEARCH RESULTS', margin, y)
  y += 2
  doc.setDrawColor(59, 130, 246)
  doc.line(margin, y, pageW - margin, y)
  y += 6

  const patentsData = (result.similarPatents || []).map((p, i) => [
    `${i + 1}`,
    p.patentNumber    || 'N/A',
    `${p.similarityScore || 0}%`,
    (p.title          || '').slice(0, 55),
    (p.domain         || '').slice(0, 22),
  ])

  autoTable(doc, {
    startY: y,
    head:   [['#', 'Patent No.', 'Match', 'Title', 'Domain']],
    body:   patentsData,
    theme:  'plain',
    styles: {
      fontSize:    7.5,
      cellPadding: 3,
      textColor:   [226, 232, 240],
      fillColor:   [13, 20, 36],
      lineColor:   [30, 50, 80],
      lineWidth:   0.1,
    },
    headStyles: {
      textColor:  [148, 163, 184],
      fillColor:  [8, 13, 26],
      fontStyle:  'bold',
      fontSize:   7,
    },
    columnStyles: {
      0: { cellWidth: 8  },
      1: { cellWidth: 36 },
      2: { cellWidth: 16 },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 28 },
    },
    alternateRowStyles: { fillColor: [8, 13, 26] },
    margin: { left: margin, right: margin },
  })

  y = doc.lastAutoTable.finalY + 14

  // Innovation Gaps
  doc.setTextColor(16, 185, 129)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('INNOVATION GAP DETECTION', margin, y)
  y += 2
  doc.setDrawColor(16, 185, 129)
  doc.line(margin, y, pageW - margin, y)
  y += 8

  ;(result.innovationGaps || []).forEach((gap, i) => {
    if (y > 255) {
      doc.addPage()
      fillRect(0, 0, pageW, 297, 5, 8, 16)
      y = 20
    }

    // Gap number box
    fillRect(margin, y - 4, 7, 7, 16, 50, 35)
    doc.setTextColor(16, 185, 129)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text(`${i + 1}`, margin + 2, y + 1)

    // Gap title
    doc.setTextColor(16, 185, 129)
    doc.setFontSize(10)
    doc.text(gap.title || '', margin + 11, y + 1)
    y += 8

    // Gap description
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(gap.description || '', pageW - margin * 2 - 5)
    doc.text(lines, margin + 5, y)
    y += lines.length * 4.5 + 8
  })

  // ── Footer on all pages ───────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    fillRect(0, 283, pageW, 14, 8, 13, 26)
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(0.2)
    doc.line(margin, 284, pageW - margin, 284)
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `PatentGuard AI — Confidential  |  ${(form.title || '').slice(0, 40)}  |  Page ${i} of ${totalPages}`,
      margin, 291
    )
    doc.setTextColor(59, 130, 246)
    doc.text('patentguard.ai', pageW - margin, 291, { align: 'right' })
  }

  const filename = `PatentGuard_${(form.title || 'Report').replace(/\s+/g, '_').slice(0, 35)}.pdf`
  doc.save(filename)
}