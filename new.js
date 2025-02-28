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
		header: "Table of Contents",
		title: "Table of Contents",
		content: "A structured overview of key topics covered in this document.",
	},
	{
		name: "SomeOne",
		header: "Understanding Human Traits and Talent Development",
		title: "Understanding Human Traits and Talent Development",
		content:
			"Human nature and individual traits are deeply rooted in our biology, particularly in genetics and neuroscience. Traits such as creativity, bravery, sensitivity, and impulsiveness are often influenced by innate biology. The concept of 'innate traits' is closely linked with genetic influences, as 'innate' and 'genetic' are frequently used interchangeably. But how is human nature encoded in the human genome?\n\n" +
			"The human genome acts as a blueprint, shaping typical human characteristics while allowing individual variations due to differences in genetic coding. Just as genetics determine an average height, variations in genetic programs result in diverse human traits and abilities.",
	},
	{
		name: "SomeOne",
		header: "Francoys Gagné’s Differentiated Model of Giftedness and Talent",
		title:
			"Francoys Gagné’s Differentiated Model of Giftedness and Talent (DMGT)",
		content:
			"Francoys Gagné’s model differentiates between 'gifts' (natural abilities) and 'talents' (skills systematically developed from these natural abilities). According to Gagné, talents emerge through structured learning processes influenced by both internal and external catalysts.\n\n" +
			"**1. Natural Abilities (Gifts):**\n" +
			"   - **Intellectual Abilities:** Reasoning, memory, observation, judgment, and metacognition.\n" +
			"   - **Creative Abilities:** Inventiveness, imagination, originality, and fluency.\n" +
			"   - **Socio-affective Abilities:** Perceptiveness, empathy, tact, and influence.\n" +
			"   - **Sensorimotor Abilities:** Sensory sensitivity, strength, endurance, and coordination.\n\n" +
			"**2. Talents:**\n" +
			"   Talents are developed in various domains, such as:\n" +
			"   - Academics\n" +
			"   - Arts\n" +
			"   - Business\n" +
			"   - Leisure\n" +
			"   - Social Affection\n" +
			"   - Sports\n" +
			"   - Technology",
	},
	{
		name: "SomeOne",
		header: "Talent Development Processes",
		title: "Talent Development Processes",
		content:
			"**3. Developmental Processes:**\n" +
			"   - Natural abilities do not automatically become talents; they require structured learning.\n" +
			"   - **Informal Learning:** Example – A child learning their first language.\n" +
			"   - **Formal Learning:** Example – Structured academic education.\n\n" +
			"**4. Intrapersonal Catalysts:**\n" +
			"   These are personal factors that influence learning, including:\n" +
			"   - **Physical Characteristics:** Health and physical endurance.\n" +
			"   - **Motivation & Volition:** The drive to learn and grow.\n" +
			"   - **Self-Management:** Discipline, time management, and adaptability.\n" +
			"   - **Personality:** Traits such as self-esteem, resilience, and flexibility.\n\n" +
			"**5. Environmental Catalysts:**\n" +
			"   External factors play a major role in shaping talent. These include:\n" +
			"   - **Milieu:** Cultural and familial influences.\n" +
			"   - **Persons:** Mentors, teachers, and role models.\n" +
			"   - **Provisions:** Access to structured programs, activities, and services.\n" +
			"   - **Events:** Life experiences that shape an individual's abilities and skills.",
	},
	{
		name: "SomeOne",
		header: "The Role of Chance in Talent Development",
		title: "The Role of Chance in Talent Development",
		content:
			"**6. Chance:**\n" +
			"   - Chance influences both natural abilities and environmental factors.\n" +
			"   - Random genetic recombination affects the type and extent of giftedness a child inherits.\n" +
			"   - Unexpected opportunities or events shape how talents develop over time.\n\n" +
			"**Key Takeaways:**\n" +
			"   - **Innate Traits and Genetics:**\n" +
			"     - Traits like creativity, bravery, and sensitivity have a biological basis rooted in genetics.\n" +
			"     - The human genome provides a blueprint, but individual variations arise naturally.\n" +
			"   - **Gifts vs. Talents:**\n" +
			"     - Gifts are natural abilities, while talents require learning and practice.\n" +
			"     - Internal (motivation, personality) and external (environment, opportunities) factors influence talent development.\n" +
			"   - **Role of Chance:**\n" +
			"     - Chance plays a major role in shaping both natural abilities and environmental influences.\n" +
			"   - **Holistic Development:**\n" +
			"     - Developing talents requires a balance of natural abilities, structured learning, and a supportive environment.\n\n" +
			"By understanding the interplay between genetics, innate abilities, and environmental influences, we can better appreciate the complexity of human nature and the pathways to developing individual talents.",
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
			const imagePath = "D:\\pdfGenerator\\images\\logo2.jpg"; // Nayan
			//const imagePath = "C:\\Users\\manoj\\Desktop\\Mumbai\\pdfGenerator\\images\\logo2.jpg";// Manoj

			doc.image(imagePath, 13, 10, {
				width: 40,
				height: 35,
			});

			// Header text
			doc
				.fontSize(20)
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
				const imagePath = "D:\\pdfGenerator\\images\\logo2.jpg"; //Nayan
				//const imagePath =
				//("C:\\Users\\manoj\\Desktop\\Mumbai\\pdfGenerator\\images\\logo2.jpg"); //Manoj
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
}); //hhh
