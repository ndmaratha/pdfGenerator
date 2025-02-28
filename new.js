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
	  title: "Francoys Gagné’s Differentiated Model of Giftedness and Talent (DMGT)",
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

		// ✅ ADD FIRST PAGE BEFORE ACCESSING doc.page.width
		doc.addPage();

		// Now, `doc.page` is defined
		const pageWidth = doc.page.width;
		const pageHeight = doc.page.height;

		const mmToPt = (mm) => mm * 2.83465;
		const borderWidth = mmToPt(3);
		const headerHeight = mmToPt(25);
		const footerHeight = mmToPt(12);

		const addPageDecorations = (pageNum, headerText) => {
			// Assuming these variables are defined elsewhere in your code
			const pageWidth = doc.page.width; // Default A4: 595.28
			const pageHeight = doc.page.height; // Default A4: 841.89
			const headerHeight = 50; // Adjust as needed
			const footerHeight = 50; // Adjust as needed
			const borderWidth = 8.5; // ~3mm in points (1mm ≈ 2.83 points)

			// Header (unchanged)
			doc.rect(0, 0, pageWidth, headerHeight).fill("#FF0000");
			doc
				.fontSize(22)
				.fillColor("white")
				.text(headerText, 10, 20, { align: "center", width: pageWidth - 20 });

			// Footer
			const footerY = pageHeight - footerHeight;
			doc.rect(0, footerY, pageWidth, footerHeight).fill("#FF0000");

			// Center name (positioned at left or center, adjusted to not overlap circle)
			doc
				.fontSize(15)
				.fillColor("white")
				.text(`${centerName}`, 10, footerY + 15, {
					align: "center", // Changed to left to avoid overlap
					width: pageWidth - 60, // Reduced width to leave space for circle
				});

			// Circle and page number at right corner
			const circleRadius = 14;
			const circleX = pageWidth - circleRadius - 16; // 10 points from right edge
			const circleY = footerY + footerHeight / 2.3; // Vertically centered in footer

			// Draw orange circle
			doc
				.fillColor("#FFA500")
				.lineWidth(0.5)
				.strokeColor("black") // Orange border to match footer
				.circle(circleX, circleY, circleRadius)
				.fillAndStroke();

			// Add page number centered in the circle
			doc
				.fontSize(12)
				.fillColor("black")
				.text(`${pageNum}`, circleX - circleRadius, circleY - 6, {
					width: circleRadius * 1.8, // Matches circle diameter
					align: "center", // Centers text horizontally
				});

			// Page border (unchanged)
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
					// ✅ Your original table border settings
					doc
						.rect(cellX, rowY, columnWidths[j], rowHeight)
						.strokeColor("black")
						.stroke();

					// Add text inside the cell
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

		// ✅ Uses the correct table border settings
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

		// ✅ Generate individual pages for each entry
		for (const { header, title, content } of allData) {
			doc.addPage();
			addPageDecorations(pageCounter++, header);

			doc.fontSize(18).fillColor("black").text(title, 50, 100);
			doc.fontSize(15).text(content, 50, 150, { width: pageWidth - 100 });
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
