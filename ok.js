const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const allData = [
	{
		name: "Nayan",
		header: "Header 1",
		title: "Page 1 Title",
		content:
			"Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100e of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100e of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100e of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100e of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100e of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100Table of Content lorem*100",
	},
	{
		name: "SomeOne",
		header: "Header 1",
		title: "The 21st-Century Student - Navigating the Academic Maze",
		content: "Content goes here...",
	},
	{
		name: "SomeOne",
		header: "Header 3",
		title: "The 21st-Century Student - Navigating the Academic Maze",
		content: "Content goes here...",
	},
	{
		name: "SomeOne",
		header: "Header 4",
		title: "The 21st-Century Student - Navigating the Academic Maze",
		content: "Content goes here...",
	},
	{
		name: "SomeOne",
		header: "Header 5",
		title: "The 21st-Century Student - Navigating the Academic Maze",
		content: "Content goes here...",
	},
];

app.post("/generate-pdf", (req, res) => {
	try {
		const { centerName } = req.body;
		if (!centerName) {
			return res
				.status(400)
				.json({ error: "Missing required field: centerName" });
		}

		const sanitizedCenterName = centerName.replace(/[^a-zA-Z0-9]/g, "_");
		const filename = `${sanitizedCenterName}_Associate_Center.pdf`;

		const doc = new PDFDocument({
			size: "A4",
			margins: { top: 25, bottom: 12, left: 10, right: 10 },
			info: { Title: `${centerName} Associate Center Report` },
			autoFirstPage: false,
		});

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		doc.pipe(res);

		// Add first page
		doc.addPage();

		const pageWidth = doc.page.width;
		const pageHeight = doc.page.height;

		const mmToPt = (mm) => mm * 2.83465;
		const borderWidth = mmToPt(3);
		const headerHeight = mmToPt(25);
		const footerHeight = mmToPt(12);

		const addPageDecorations = (pageNum, headerText) => {
			// Page dimensions
			const pageWidth = doc.page.width;
			const pageHeight = doc.page.height;
			const headerHeight = 50;
			const footerHeight = 50;
			const borderWidth = 8.5;

			// VIBGYOR colors array
			const vibgyorColors = [
				"#8F00FF", // Violet
				"#4B0082", // Indigo
				"#0000FF", // Blue
				"#00FF00", // Green
				"#FFFF00", // Yellow
				"#FFA500", // Orange
				"#FF0000", // Red
			];

			// Determine color index
			const colorIndex = (pageNum - 1) % vibgyorColors.length;
			const currentColor = vibgyorColors[colorIndex];

			// Header with VIBGYOR color
			doc.rect(0, 0, pageWidth, headerHeight).fill(currentColor);

			// Add image in the left corner of the header
			const imagePath = "D:\\pdfGenerator\\images\\logo2.jpg"; // Use correct Windows path
			doc.image(imagePath, 13, 10, {
				width: 40,
				height: 35,
			});

			// Header text
			doc
				.fontSize(22)
				.fillColor("white")
				.text(headerText, 50, 20, { align: "center", width: pageWidth - 60 });

			// Footer with VIBGYOR color
			const footerY = pageHeight - footerHeight;
			doc.rect(0, footerY, pageWidth, footerHeight).fill(currentColor);

			// Center name
			doc
				.fontSize(15)
				.fillColor("white")
				.text(`${centerName}`, 10, footerY + 15, {
					align: "center",
					width: pageWidth - 60,
				});

			// Circle and page number at right corner
			const circleRadius = 14;
			const circleX = pageWidth - circleRadius - 16;
			const circleY = footerY + footerHeight / 2.3;

			doc
				.fillColor("#FFA500")
				.lineWidth(0.5)
				.strokeColor("black")
				.circle(circleX, circleY, circleRadius)
				.fillAndStroke();

			doc
				.fontSize(12)
				.fillColor("black")
				.text(`${pageNum}`, circleX - circleRadius, circleY - 6, {
					width: circleRadius * 1.8,
					align: "center",
				});

			// Page border
			doc
				.lineWidth(borderWidth)
				.strokeColor("yellow")
				.rect(
					borderWidth / 2,
					borderWidth / 2,
					pageWidth - borderWidth,
					pageHeight - borderWidth
				)
				.stroke();
		};
		const generateTable = (doc, data, x, y, columnWidths, rowHeight) => {
			// Ensure columnWidths is defined and has correct length
			if (!Array.isArray(columnWidths) || columnWidths.length !== 2) {
				throw new Error(
					"columnWidths must be an array with exactly 2 elements"
				);
			}

			// Define table headers
			const headers = ["Content", "PageNo"];

			// Draw header row
			let rowY = y;
			for (let j = 0; j < headers.length; j++) {
				let cellX = x + columnWidths.slice(0, j).reduce((a, b) => a + b, 0);
				doc.lineWidth(0.5);
				doc
					.rect(cellX, rowY, columnWidths[j], rowHeight)
					.strokeColor("black")
					.stroke();

				doc.fontSize(10).text(headers[j], cellX + 8, rowY + 8, {
					width: columnWidths[j] - 10,
					align: "left",
				});
			}

			// Draw data rows with content and incremental page numbers
			for (let i = 0; i < data.length; i++) {
				rowY = y + (i + 1) * rowHeight; // Start after header row
				const rowData = [data[i].title, (i + 2).toString()]; // PageNo starts from 2

				for (let j = 0; j < rowData.length; j++) {
					let cellX = x + columnWidths.slice(0, j).reduce((a, b) => a + b, 0);
					doc.lineWidth(0.5);
					doc
						.rect(cellX, rowY, columnWidths[j], rowHeight)
						.strokeColor("black")
						.stroke();

					doc.fontSize(10).text(rowData[j], cellX + 8, rowY + 8, {
						width: columnWidths[j] - 10,
						align: "left",
					});
				}
			}
		};

		// In the app.post("/generate-pdf") route:
		let pageCounter = 1;
		addPageDecorations(pageCounter++, "Table of Contents");

		// Table settings
		const tableX1 = 20,
			tableX2 = 300;
		const tableY = 80;
		const rowHeight = 40,
			columnWidths = [230, 50]; // Define columnWidths here

		const leftTableData = allData.slice(0, allData.length - 1);
		const rightTableData = allData.slice(1);

		generateTable(doc, leftTableData, tableX1, tableY, columnWidths, rowHeight);
		generateTable(
			doc,
			rightTableData,
			tableX2,
			tableY,
			columnWidths,
			rowHeight
		);

		const splitTextIntoLines = (doc, text, maxWidth) => {
			const words = text.split(" ");
			let lines = [];
			let currentLine = "";

			for (let word of words) {
				let testLine = currentLine.length > 0 ? currentLine + " " + word : word;
				if (doc.widthOfString(testLine) < maxWidth) {
					currentLine = testLine;
				} else {
					lines.push(currentLine);
					currentLine = word;
				}
			}

			if (currentLine.length > 0) {
				lines.push(currentLine);
			}

			return lines;
		};

		for (const { header, title, content } of allData) {
			doc.addPage();
			addPageDecorations(pageCounter++, header);

			doc.fontSize(18).fillColor("black").text(title, 50, 100);

			const contentX = 50;
			let contentY = 150;
			const contentWidth = pageWidth - 100;
			const availableHeight = pageHeight - headerHeight - footerHeight - 20;
			const bottomLimit = pageHeight - footerHeight - 20;

			doc.fontSize(15);

			let remainingText = content;
			let lines = splitTextIntoLines(doc, remainingText, contentWidth);

			for (let i = 0; i < lines.length; i++) {
				let textHeight = doc.heightOfString(lines[i]);

				// If the line doesn't fit, start a new page
				if (contentY + textHeight > bottomLimit) {
					doc.addPage();
					addPageDecorations(pageCounter++, header);
					contentY = 100;
				}

				doc.text(lines[i], contentX, contentY, {
					width: contentWidth,
					align: "left",
				});
				contentY += textHeight + 5; // Move Y down for next line
			}

			// Add image if space is available
			const contentBottom = doc.y;
			if (contentBottom + 220 < bottomLimit) {
				const imagePath = "D:\\pdfGenerator\\images\\logo2.jpg";
				const imageX = (pageWidth - 200) / 2;
				doc.image(imagePath, imageX, contentBottom + 20, {
					width: 200,
					height: 200,
				});
			}
		}

		doc.end();
	} catch (error) {
		console.error("Error generating PDF:", error);
		if (!res.headersSent) {
			res.status(500).json({ error: "Internal server error" });
		}
		res.end();
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
