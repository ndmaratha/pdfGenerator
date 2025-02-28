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
		header: "Header",
		title: "Page 1 Title",
		content: "Table of Content",
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
			for (let i = 0; i < data.length; i++) {
				let rowY = y + i * rowHeight;

				for (let j = 0; j < data[i].length; j++) {
					let cellX = x + columnWidths.slice(0, j).reduce((a, b) => a + b, 0);
					doc.lineWidth(0.5);
					doc
						.rect(cellX, rowY, columnWidths[j], rowHeight)
						.strokeColor("black")
						.stroke();

					doc.fontSize(10).text(data[i][j], cellX + 8, rowY + 8, {
						width: columnWidths[j] - 10,
						align: "left",
					});
				}
			}
		};

		let pageCounter = 1;
		addPageDecorations(pageCounter++, "Table of Contents");

		// Table settings
		const tableX1 = 50,
			tableX2 = 300;
		const tableY = 100;
		const rowHeight = 40,
			columnWidth = 200;

		const leftTableData = allData
			.slice(0, allData.length - 1)
			.map((d) => [d.title]);
		const rightTableData = allData.slice(1).map((d) => [d.title]);

		generateTable(
			doc,
			leftTableData,
			tableX1,
			tableY,
			[columnWidth],
			rowHeight
		);
		generateTable(
			doc,
			rightTableData,
			tableX2,
			tableY,
			[columnWidth],
			rowHeight
		);

		// // Generate individual pages
		// for (const { header, title, content } of allData) {
		// 	doc.addPage();
		// 	addPageDecorations(pageCounter++, header);

		// 	doc.fontSize(18).fillColor("black").text(title, 50, 100);
		// 	doc.fontSize(15).text(content, 50, 150, { width: pageWidth - 100 });
		// }
		// Individual pages with content and conditional image
		for (const { header, title, content } of allData) {
			doc.addPage();
			addPageDecorations(pageCounter++, header);

			// Add content
			doc.fontSize(18).fillColor("black").text(title, 50, 100);
			doc.fontSize(15).text(content, 50, 150, { width: pageWidth - 100 });

			// Calculate content height and available space
			const contentBottom = doc.y; // Current y-position after adding content
			const availableHeight = pageHeight - headerHeight - footerHeight; // ~737 points
			const contentHeight = contentBottom - headerHeight; // Height used by content

			// Check if content uses less than half the available space
			if (contentHeight < availableHeight / 2) {
				// Add image in remaining space
				const imagePath = "D:\\pdfGenerator\\images\\logo2.jpg";
				const imageX = (pageWidth - 200) / 2; // Center horizontally (image width = 200)
				const imageY = contentBottom + 20; // 20 points below content
				doc.image(imagePath, imageX, imageY, {
					width: 200, // Larger image for remaining space
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
