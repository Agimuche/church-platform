/**
 * Exporter utility for Sermon Notes into Microsoft Word (.docx) and PDF (.pdf) formats.
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } from "docx";
import { jsPDF } from "jspdf";

export interface SermonNotesExportData {
  title: string;
  preacher?: string;
  series?: string;
  date?: string;
  serviceType?: string;
  content: string;
}

/**
 * Clean and format raw notes content into structured paragraphs
 */
function parseContentToLines(content: string): string[] {
  return content
    .split("\n")
    .map((l) => l.trimEnd());
}

/**
 * Downloads a Blob directly in the browser
 */
function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Export Sermon Notes to Microsoft Word (.docx)
 */
export async function exportToWordDocx(data: SermonNotesExportData): Promise<void> {
  const dateStr = data.date || new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const preacherStr = data.preacher || "Pastor & Ministers of The Brook Church";
  const filename = `TBC-Sermon-Notes-${data.title.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().slice(0, 10)}.docx`;

  try {
    const rawLines = parseContentToLines(data.content);
    const contentParagraphs: Paragraph[] = [];

    // Header paragraphs
    contentParagraphs.push(
      new Paragraph({
        text: "THE BROOK CHURCH — CALABAR SANCTUARY",
        heading: HeadingLevel.HEADING_3,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Official Live Broadcast Sermon Notes & Transcript",
            italics: true,
            color: "555555",
            size: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: data.title,
            bold: true,
            size: 36,
            color: "1e3a8a", // deep blue
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 160 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true }),
          new TextRun({ text: `${dateStr}   |   ` }),
          new TextRun({ text: "Minister: ", bold: true }),
          new TextRun({ text: `${preacherStr}   |   ` }),
          new TextRun({ text: "Broadcast: ", bold: true }),
          new TextRun({ text: "Simultaneous Sanctuary Live Stream" }),
        ],
        spacing: { after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "_________________________________________________________________________________",
            color: "94a3b8",
          }),
        ],
        spacing: { after: 300 },
      })
    );

    // Parse each line from user content
    for (const line of rawLines) {
      if (!line.trim()) {
        contentParagraphs.push(new Paragraph({ spacing: { after: 100 } }));
        continue;
      }

      // Main headings (e.g. "### Heading" or starts with "• Topic:" or numbered sections)
      if (line.startsWith("### ") || line.startsWith("## ") || line.startsWith("# ")) {
        const cleanHeading = line.replace(/^#+\s*/, "");
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cleanHeading,
                bold: true,
                size: 26,
                color: "0f172a",
              }),
            ],
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.match(/^([A-Z0-9\s—–-]{3,}):/)) {
        // Section headers like "KEY SCRIPTURES:", "CENTRAL THEME:", "PROPHETIC DECREE:"
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                bold: true,
                size: 24,
                color: "1e293b",
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
        // Bullet item
        const textAfterBullet = line.replace(/^[•\-\*]\s*/, "");
        contentParagraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: textAfterBullet,
                size: 22,
              }),
            ],
            spacing: { after: 80 },
          })
        );
      } else if (line.startsWith("[") && line.includes("]")) {
        // Timestamped live note, e.g. "[10:24 AM] Pastor: ..."
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                italics: true,
                color: "334155",
                size: 21,
              }),
            ],
            spacing: { after: 90 },
          })
        );
      } else {
        // Normal paragraph
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 22,
                color: "1e293b",
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }

    // Closing Footer
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "_________________________________________________________________________________",
            color: "94a3b8",
          }),
        ],
        spacing: { before: 300, after: 160 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "The Brook Church • Calabar, Nigeria • Live Online Sanctuary Feed",
            italics: true,
            size: 18,
            color: "64748b",
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: contentParagraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    triggerBrowserDownload(blob, filename);
  } catch (err) {
    console.error("Error generating Word DOCX with docx library:", err);
    // Fallback: Generate Microsoft Word compatible HTML (.doc)
    fallbackWordExport(data, filename.replace(".docx", ".doc"));
  }
}

/**
 * Resilient fallback that generates Microsoft Word compatible document format (.doc)
 */
function fallbackWordExport(data: SermonNotesExportData, filename: string) {
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${data.title}</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; padding: 20px; }
        h1 { color: #1e3a8a; font-size: 20pt; margin-bottom: 4px; }
        h2 { color: #334155; font-size: 14pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px; }
        .meta { color: #64748b; font-size: 9.5pt; margin-bottom: 20px; }
        .church { font-size: 13pt; font-weight: bold; color: #0284c7; text-align: center; }
        .tagline { font-size: 9pt; font-style: italic; color: #64748b; text-align: center; margin-bottom: 25px; }
        p { margin: 6px 0; }
        ul { margin: 6px 0; padding-left: 20px; }
        li { margin-bottom: 4px; }
        hr { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0; }
        .footer { text-align: center; font-size: 8.5pt; color: #94a3b8; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="church">THE BROOK CHURCH &bull; CALABAR SANCTUARY</div>
      <div class="tagline">Official Live Sanctuary Broadcast Sermon Notes</div>
      <h1>${data.title}</h1>
      <div class="meta">
        <strong>Date:</strong> ${data.date || new Date().toDateString()} &nbsp;|&nbsp;
        <strong>Minister:</strong> ${data.preacher || "The Brook Church"} &nbsp;|&nbsp;
        <strong>Service:</strong> Live Stream
      </div>
      <hr/>
      <div>${data.content
        .split("\n")
        .map((line) => {
          if (!line.trim()) return "<br/>";
          if (line.startsWith("#")) return `<h2>${line.replace(/^#+\s*/, "")}</h2>`;
          if (line.startsWith("• ") || line.startsWith("- ")) return `<li>${line.replace(/^[•\-]\s*/, "")}</li>`;
          return `<p>${line}</p>`;
        })
        .join("")}
      </div>
      <hr/>
      <div class="footer">The Brook Church &bull; Calabar, Nigeria &bull; Live Online Sanctuary Transmission</div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  triggerBrowserDownload(blob, filename);
}

/**
 * Export Sermon Notes to PDF (.pdf)
 */
export async function exportToPdf(data: SermonNotesExportData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const dateStr = data.date || new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const preacherStr = data.preacher || "Pastor & Ministers of The Brook Church";
  const filename = `TBC-Sermon-Notes-${data.title.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;

  // Function to check page overflow and add new page
  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      cursorY = margin + 5;
      // Add subtle top running header on subsequent pages
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text("The Brook Church — Live Sanctuary Sermon Notes", margin, cursorY);
      cursorY += 8;
    }
  };

  // Header Banner styling
  doc.setFillColor(15, 23, 42); // deep slate/navy
  doc.roundedRect(margin, cursorY, contentWidth, 24, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("THE BROOK CHURCH — CALABAR", margin + 6, cursorY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253); // sky light
  doc.text("Live Sanctuary Broadcast Sermon Notes & Study Guide", margin + 6, cursorY + 16);

  cursorY += 32;

  // Sermon Title
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(data.title, contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 7 + 4;

  // Metadata block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`DATE: ${dateStr.toUpperCase()}  |  MINISTER: ${preacherStr.toUpperCase()}`, margin, cursorY);
  cursorY += 5;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 8;

  // Body content lines
  const rawLines = parseContentToLines(data.content);

  for (const rawLine of rawLines) {
    if (!rawLine.trim()) {
      cursorY += 4;
      continue;
    }

    // Check for Major Heading
    if (rawLine.startsWith("#") || rawLine.match(/^([A-Z0-9\s—–-]{3,}):/)) {
      checkPageBreak(14);
      const headingText = rawLine.replace(/^#+\s*/, "");
      cursorY += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138); // blue
      doc.text(headingText, margin, cursorY);
      cursorY += 6;
      continue;
    }

    // Bullet points
    if (rawLine.startsWith("• ") || rawLine.startsWith("- ") || rawLine.startsWith("* ")) {
      const bulletText = rawLine.replace(/^[•\-\*]\s*/, "");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 8);
      checkPageBreak(splitBullet.length * 5 + 3);

      doc.circle(margin + 2, cursorY - 1, 0.7, "F");
      doc.text(splitBullet, margin + 6, cursorY);
      cursorY += splitBullet.length * 5 + 2;
      continue;
    }

    // Timestamps or quotes
    if (rawLine.startsWith("[") && rawLine.includes("]")) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const splitTime = doc.splitTextToSize(rawLine, contentWidth);
      checkPageBreak(splitTime.length * 4.5 + 2);
      doc.text(splitTime, margin, cursorY);
      cursorY += splitTime.length * 4.5 + 2;
      continue;
    }

    // Standard Body Paragraph
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const splitBody = doc.splitTextToSize(rawLine, contentWidth);
    checkPageBreak(splitBody.length * 5 + 3);
    doc.text(splitBody, margin, cursorY);
    cursorY += splitBody.length * 5 + 2;
  }

  // Footer on each page
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${totalPages}  •  The Brook Church Online Sanctuary`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  doc.save(filename);
}

/**
 * Print friendly trigger for instant browser printing
 */
export function printSermonNotes(data: SermonNotesExportData): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.title} - The Brook Church Sermon Notes</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 30px auto; padding: 20px; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
        .church { font-size: 18px; font-weight: bold; color: #0284c7; }
        h1 { margin: 10px 0 6px 0; font-size: 26px; color: #0f172a; }
        .meta { color: #64748b; font-size: 13px; margin-bottom: 15px; }
        pre, .content { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
        @media print {
          body { margin: 10mm; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="church">THE BROOK CHURCH &bull; CALABAR SANCTUARY</div>
        <div style="font-size: 12px; color: #64748b;">Live Broadcast Sermon Notes</div>
      </div>
      <h1>${data.title}</h1>
      <div class="meta">
        <strong>Date:</strong> ${data.date || new Date().toDateString()} | 
        <strong>Minister:</strong> ${data.preacher || "The Brook Church"}
      </div>
      <div class="content">${data.content}</div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
