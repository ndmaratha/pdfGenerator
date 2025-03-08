const express = require("express");
const { PDFDocument, rgb } = require("pdf-lib");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const allData = require("./data.js");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/generate-pdf", async (req, res) => {
	try {
		const { centerName } = req.body;
		if (!centerName) {
			throw new Error("Missing required field: centerName");
		}

		const sanitizedCenterName = centerName.replace(/[^a-zA-Z0-9]/g, "_");
		const filename = `${sanitizedCenterName}_Associate_Center.pdf`;

		const doc = await PDFDocument.create();
		const pageWidth = 595.28;
		const pageHeight = 841.89;
		const helveticaFont = await doc.embedFont("Helvetica");

		const imagePath = "D:\\pdfGenerator\\images\\logo2.jpg";
		const vibgyorColors = [
			rgb(0.56, 0, 1),
			rgb(0.29, 0, 0.51),
			rgb(0, 0, 1),
			rgb(0, 1, 0),
			rgb(1, 1, 0),
			rgb(1, 0.65, 0),
			rgb(1, 0, 0),
		];

		const sanitizeText = (text) => {
			return (text || "").replace(/[^\x00-\xFF\n]/g, "?");
		};

		const addPageDecorations = async (page, pageNum, headerText) => {
			const colorIndex = (pageNum - 1) % vibgyorColors.length;
			const currentColor = vibgyorColors[colorIndex];

			page.drawRectangle({
				x: 0,
				y: pageHeight - 50,
				width: pageWidth,
				height: 50,
				color: currentColor,
			});
			const imageBytes = await fs.readFile(imagePath).catch(() => null);
			if (imageBytes) {
				const image = await doc.embedJpg(imageBytes);
				page.drawImage(image, {
					x: 13,
					y: pageHeight - 45,
					width: 40,
					height: 35,
				});
			}
			page.drawText(sanitizeText(headerText), {
				x: 210,
				y: pageHeight - 35,
				size: 22,
				font: helveticaFont,
				color: rgb(1, 1, 1),
				maxWidth: pageWidth - 60,
			});

			page.drawRectangle({
				x: 0,
				y: 0,
				width: pageWidth,
				height: 50,
				color: currentColor,
			});
			page.drawText(sanitizeText(centerName), {
				x: 210,
				y: 25,
				size: 15,
				font: helveticaFont,
				color: rgb(1, 1, 1),
				maxWidth: pageWidth - 60,
			});

			const circleRadius = 14;
			const circleX = pageWidth - circleRadius - 16;
			page.drawCircle({
				x: circleX,
				y: 25,
				size: circleRadius,
				color: rgb(1, 0.65, 0),
				borderColor: rgb(0, 0, 0),
				borderWidth: 0.5,
			});
			page.drawText(`${pageNum}`, {
				x: circleX - circleRadius + 9,
				y: 19,
				size: 12,
				font: helveticaFont,
				color: rgb(0, 0, 0),
			});

			page.drawRectangle({
				x: 4.25,
				y: 4.25,
				width: pageWidth - 8.5,
				height: pageHeight - 8.5,
				borderColor: rgb(1, 1, 0),
				borderWidth: 8.5,
			});
		};

		const splitTextIntoLines = (text, maxWidth, font, size) => {
			const cleanText = sanitizeText(text);
			const paragraphs = cleanText.split("\n");
			const lines = [];

			for (let i = 0; i < paragraphs.length; i++) {
				const paragraph = paragraphs[i].trim();
				if (paragraph) {
					const words = paragraph.split(" ");
					let currentLine = "";
					for (const word of words) {
						const testLine = currentLine ? `${currentLine} ${word}` : word;
						if (font.widthOfTextAtSize(testLine, size) < maxWidth) {
							currentLine = testLine;
						} else {
							if (currentLine) lines.push(currentLine);
							currentLine = word;
						}
					}
					if (currentLine) lines.push(currentLine);
				}
				if (i < paragraphs.length - 1) {
					lines.push(""); // Paragraph break marker
				}
			}
			return lines;
		};

		const generateTable = (
			page,
			data,
			x,
			y,
			columnWidths,
			rowHeight,
			isRightTable = false,
			leftTableLength = 0
		) => {
			const headers = ["Content", "PageNo"];
			let currentY = y;

			headers.forEach((header, j) => {
				const cellX = x + (j === 1 ? columnWidths[0] : 0);
				page.drawRectangle({
					x: cellX,
					y: currentY,
					width: columnWidths[j],
					height: rowHeight,
					borderColor: rgb(0, 0, 0),
					borderWidth: 1,
				});
				page.drawText(header, {
					x: cellX + 8,
					y: currentY + 8,
					size: 12,
					font: helveticaFont,
				});
			});

			data.forEach((item, i) => {
				currentY = y - (i + 1) * rowHeight;
				const rowData = [sanitizeText(item.title), item.pageNumber];
				rowData.forEach((text, j) => {
					const cellX = x + (j === 1 ? columnWidths[0] : 0);
					page.drawRectangle({
						x: cellX,
						y: currentY,
						width: columnWidths[j],
						height: rowHeight,
						borderColor: rgb(0, 0, 0),
						borderWidth: 1,
					});
					const lines = splitTextIntoLines(
						text,
						columnWidths[j] - 10,
						helveticaFont,
						12
					);
					page.drawText(lines[0] || "", {
						x: cellX + 8,
						y: currentY + 8,
						size: 12,
						font: helveticaFont,
					});
				});
			});

			if (isRightTable && leftTableLength > data.length) {
				const extraRows = leftTableLength - data.length;
				for (let i = 0; i < extraRows; i++) {
					currentY = y - (data.length + i + 1) * rowHeight;
					columnWidths.forEach((width, j) => {
						const cellX = x + (j === 1 ? columnWidths[0] : 0);
						page.drawRectangle({
							x: cellX,
							y: currentY,
							width,
							height: rowHeight,
							borderColor: rgb(0, 0, 0),
							borderWidth: 1,
						});
					});
				}
			}
		};

		const renderTextWithItalics = (
			page,
			text,
			x,
			y,
			size,
			font,
			maxWidth,
			color
		) => {
			const parts = text.split(/(\*[^*]+\*)/);
			let currentX = x;
			parts.forEach((part) => {
				if (part.startsWith("*") && part.endsWith("*")) {
					const italicText = part.slice(1, -1);
					const textWidth = font.widthOfTextAtSize(italicText, size);
					page.drawText(italicText, {
						x: currentX,
						y,
						size,
						font,
						color,
						maxWidth,
					});
					page.drawLine({
						start: { x: currentX, y: y - 2 },
						end: { x: currentX + textWidth, y: y - 2 },
						thickness: 0.5,
						color,
					});
					currentX += textWidth;
				} else {
					const textWidth = font.widthOfTextAtSize(part, size);
					page.drawText(part, {
						x: currentX,
						y,
						size,
						font,
						color,
						maxWidth,
					});
					currentX += textWidth;
				}
			});
			return currentX;
		};

		const tocEntries = [];
		let pageCounter = 2;
		const contentWidth = pageWidth - 100;
		const bottomLimit = 70;

		for (const item of allData) {
			let page = doc.addPage();
			const cleanTitle = sanitizeText(item.title || "Untitled");
			await addPageDecorations(page, pageCounter, cleanTitle);
			tocEntries.push({
				title: cleanTitle,
				pageNumber: pageCounter.toString(),
			});

			page.drawText(cleanTitle, {
				x: 50,
				y: pageHeight - 100,
				size: 18,
				font: helveticaFont,
				color: rgb(0, 0, 0),
			});

			let currentY = pageHeight - 150;
			const contentLines = splitTextIntoLines(
				item.content || "",
				contentWidth,
				helveticaFont,
				15
			);
			const textHeight = helveticaFont.heightAtSize(15);
			const subheadingHeight = helveticaFont.heightAtSize(18);
			const lineSpacing = 8; // Increased for better paragraph separation

			for (let i = 0; i < contentLines.length; i++) {
				let line = contentLines[i];
				if (currentY - textHeight < bottomLimit) {
					page = doc.addPage();
					pageCounter++;
					await addPageDecorations(page, pageCounter, cleanTitle);
					currentY = pageHeight - 100;
				}

				if (line === "") {
					currentY -= textHeight + lineSpacing; // Consistent paragraph break
				} else if (line.startsWith("###")) {
					const subheadingText = line.replace("###", "").trim();
					page.drawText(subheadingText, {
						x: 50,
						y: currentY,
						size: 18,
						font: helveticaFont,
						color: rgb(0, 0, 0),
						maxWidth: contentWidth,
					});
					currentY -= subheadingHeight + lineSpacing * 1.5; // Slightly more spacing after subheadings
				} else if (line.startsWith("-")) {
					const bulletText = line.replace("-", "").trim();
					page.drawText("•", {
						x: 50,
						y: currentY,
						size: 15,
						font: helveticaFont,
						color: rgb(0, 0, 0),
					});
					renderTextWithItalics(
						page,
						bulletText,
						65,
						currentY,
						15,
						helveticaFont,
						contentWidth - 15,
						rgb(0, 0, 0)
					);
					currentY -= textHeight + lineSpacing;
				} else {
					renderTextWithItalics(
						page,
						line,
						50,
						currentY,
						15,
						helveticaFont,
						contentWidth,
						rgb(0, 0, 0)
					);
					currentY -= textHeight + lineSpacing;
				}
			}

			if (currentY - 220 > bottomLimit) {
				const imageBytes = await fs.readFile(imagePath).catch(() => null);
				if (imageBytes) {
					const image = await doc.embedJpg(imageBytes);
					page.drawImage(image, {
						x: (pageWidth - 200) / 2,
						y: currentY - 200,
						width: 200,
						height: 200,
					});
				}
			}
			pageCounter++;
		}

		const maxRowsPerPage = Math.floor((pageHeight - 210) / 40);
		const entriesPerPage = maxRowsPerPage * 2;
		const totalTocPages = Math.ceil(tocEntries.length / entriesPerPage);
		const tableConfig = {
			x1: 18,
			x2: 298,
			y: pageHeight - 110,
			rowHeight: 30,
			columnWidths: [220, 55],
		};

		for (let i = 0; i < totalTocPages; i++) {
			const tocPage = doc.insertPage(i);
			await addPageDecorations(tocPage, i + 1, "Table of Contents");

			const start = i * entriesPerPage;
			const end = Math.min(start + entriesPerPage, tocEntries.length);
			const pageEntries = tocEntries.slice(start, end);

			const leftTableData = pageEntries.filter((_, idx) => idx % 2 === 0);
			const rightTableData = pageEntries.filter((_, idx) => idx % 2 === 1);

			generateTable(
				tocPage,
				leftTableData,
				tableConfig.x1,
				tableConfig.y,
				tableConfig.columnWidths,
				tableConfig.rowHeight
			);
			generateTable(
				tocPage,
				rightTableData,
				tableConfig.x2,
				tableConfig.y,
				tableConfig.columnWidths,
				tableConfig.rowHeight,
				true,
				leftTableData.length
			);
		}

		const pdfBytes = await doc.save();
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		res.send(Buffer.from(pdfBytes));
	} catch (error) {
		console.error("PDF Generation Error:", error.message, error.stack);
		if (!res.headersSent) {
			res.status(error.message.includes("Missing") ? 400 : 500).json({
				error: error.message || "Internal server error",
			});
		}
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
