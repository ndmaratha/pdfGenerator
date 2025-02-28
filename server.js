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
		header: "Page 6",
		title: "Page 1 Title",
		content: "Table of Content",
	},
	{
		name: "SomeOne",
		header: "Table of Content2",
		title: "The 21st-Century Student - Navigating the Academic Maze",
		content: `
In the hyper-competitive world of the 21st century, academic success has become a critical determinant of survival, especially for India's middle-class population. The relentless pressure to excel in academics and competitive exams has created a high-stakes environment, impacting not only students but also their families and the broader education system. This pressure, combined with the increasing complexity of modern education, has led to rising academic stress and a noticeable decline in student performance.
Seven Key Factors Driving This Alarming Trend:
1. Declining Grasping Power: In an era of information overload, students are bombarded with excessive data, leading to shorter attention spans and difficulties in understanding and retaining new concepts. This often results in slower learning and challenges in mastering complex topics compared to peers.
2. Fading Memory Power: The constant influx of information overwhelms cognitive resources, impairing memory retention. Students frequently forget what they've learned and struggle to connect ideas during exams, affecting their overall performance.
3. Weakening Perception Power: The ability to interpret and analyze information is crucial for academic success. However, excessive exposure to digital media and instant gratification has eroded critical thinking and analytical skills, leading to misinterpretation of exam questions and difficulties with abstract concepts.
4. Erosion of Emotional Stability: The immense pressure to succeed, coupled with constant scrutiny from parents, peers, and society, takes a toll on students' emotional well-being. Exam anxiety, panic attacks, and difficulty concentrating during preparation are common outcomes of this stress.
5. Declining Intellectual Power: The overemphasis on rote learning and memorization neglects the development of higher-order thinking skills like critical analysis, problem-solving, and creativity. This leaves students ill-equipped to tackle complex problems, especially in subjects requiring logical reasoning.
6. Blurred Career Goals: Without clear career aspirations, students often lack direction and purpose. This confusion leads to misplaced priorities, wasted effort on irrelevant activities, and a general lack of motivation to excel academically.
7. Neglect of Physical and Mental Well-being: The relentless pursuit of academic excellence often comes at the cost of physical and mental health. Poor sleep, inadequate nutrition, and lack of exercise negatively impact cognitive function, energy levels, and overall academic performance.
Addressing the Challenges: A Multi-Pronged Approach
To tackle these issues, a holistic and proactive approach is essential:
1. Shift the Focus: Move away from rote learning and prioritize the development of critical thinking, problem-solving, and creative skills.
2. Personalized Learning: Adopt tailored teaching methods that cater to individual learning styles and paces.
3. Emotional Well-being Support: Schools and families must prioritize mental health by providing resources and support systems to help students manage stress and anxiety.
4. Career Guidance: Integrate comprehensive career counseling into the education system to help students explore their interests and make informed career decisions.
5. Promote Holistic Development: Encourage physical activity, healthy eating, and mindfulness practices to ensure students' overall well-being.
By addressing these challenges and fostering a supportive, nurturing learning environment, we can empower students to navigate the academic maze with confidence and unlock their full potential.
`,
	},
	// Add more data objects as needed...
];
/**
 * Express route to generate a PDF document for an associate center report.
 * Handles POST requests with center details and table of contents data.
 */
app.post("/generate-pdf", (req, res) => {
	try {
		// Predefined data for the report
		const predefinedData = {
			companyName: "Minimum Marks 99 (MM99)",
		};

		// Extract request body data
		const { centerName, tableOfContents } = req.body;

		// Validate required fields
		if (!centerName) {
			return res.status(400).json({
				error:
					"Missing required fields: centerName, tehsil, contactEmail, contactPhone, and tableOfContents are required",
			});
		}

		// Sanitize centerName for filename
		const sanitizedCenterName = centerName.replace(/[^a-zA-Z0-9]/g, "_");
		const filename = `${sanitizedCenterName}_Associate_Center.pdf`;

		// Initialize PDF document with A4 size and specific margins
		const doc = new PDFDocument({
			size: "A4",
			margins: { top: 25, bottom: 12, left: 10, right: 10 },
			info: { Title: `${centerName} Associate Center Report` },
			autoFirstPage: false,
		});

		// Set response headers for PDF download
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		doc.pipe(res);

		// Convert millimeters to points for PDFKit
		const mmToPt = (mm) => mm * 2.83465;
		const borderWidth = mmToPt(3); // 3mm border width
		const headerHeight = mmToPt(25); // 25mm header height
		const footerHeight = mmToPt(12); // 12mm footer height

		// Add page counter variable at the top of the route handler
		let pageCounter = 0;

		/**
		 * Adds decorative elements (header, footer, border) to a PDF page.
		 * @param {number} pageNum - Current page number
		 * @param {number} totalPages - Total number of pages in the document
		 * @param {string} headerText - Text to display in the header
		 * @param {number} pageWidth - Width of the page
		 * @param {number} pageHeight - Height of the page
		 */
		const addPageDecorations = (
			pageNum,
			totalPages,
			headerText,
			pageWidth,
			pageHeight
		) => {
			const borderOffset = borderWidth / 2;
			const safeWidth = pageWidth - borderWidth;
			const safeHeight = pageHeight - borderWidth;

			// Draw red header
			doc
				.rect(
					borderOffset + 1,
					borderOffset + 1,
					safeWidth - 2,
					headerHeight - 1
				)
				.fill("#FF0000");
			doc
				.fontSize(18)
				.fillColor("white")
				.text(headerText || "", borderOffset + 10, borderOffset + 5, {
					align: "center",
					width: safeWidth - 20,
				});

			// Draw orange footer
			const footerY = pageHeight - footerHeight - borderOffset;
			doc
				.rect(borderOffset + 1, footerY + 1, safeWidth - 2, footerHeight - 1)
				.fill("#FFA500");
			doc
				.fontSize(10)
				.fillColor("black")
				.text(
					`${centerName} | Page ${pageNum} of ${totalPages}`,
					borderOffset + 10,
					footerY + 4,
					{ align: "center", width: safeWidth - 20 }
				);

			// Draw yellow border
			doc
				.lineWidth(borderWidth)
				.strokeColor("000000")
				.rect(borderOffset, borderOffset, safeWidth, safeHeight)
				.stroke();
		};

		// Update the table generation code
		const generateTable = () => {
			doc.addPage();
			pageCounter++;
			const pageWidth = doc.page.width;
			const pageHeight = doc.page.height;

			addPageDecorations(
				pageCounter,
				allData.length + 1,
				"Table of Contents",
				pageWidth,
				pageHeight
			);

			const tableTop = headerHeight + 20;
			const tableLeft = 30;
			const tableRight = pageWidth - 30;
			const maxTableHeight = pageHeight - footerHeight - tableTop - 30; // Reduced height for safety

			// Calculate table dimensions
			const tableWidth = tableRight - tableLeft;
			const col1Width = Math.floor(tableWidth * 0.85); // 85% for content
			const col2Width = tableWidth - col1Width; // Remaining for page numbers
			const minRowHeight = 20; // Increased minimum height for better readability
			const maxEntries = Math.floor(maxTableHeight / minRowHeight);

			// Draw table headers
			doc.font("Helvetica-Bold").fontSize(12);

			// Header row
			doc
				.fillColor("black")
				.rect(tableLeft, tableTop, tableWidth, minRowHeight)
				.stroke()
				.text("Content", tableLeft + 5, tableTop + 5, {
					width: col1Width - 10,
					align: "center",
				})
				.text("Page", tableLeft + col1Width + 5, tableTop + 5, {
					width: col2Width - 10,
					align: "center",
				});

			// Content rows
			let yPos = tableTop + minRowHeight;
			doc.font("Helvetica").fontSize(10);

			allData.slice(0, maxEntries).forEach((entry, index) => {
				// Draw row borders
				doc.rect(tableLeft, yPos, tableWidth, minRowHeight).stroke();

				// Draw content
				doc
					.text(entry.title || entry.header, tableLeft + 5, yPos + 5, {
						width: col1Width - 10,
						align: "left",
					})
					.text((index + 2).toString(), tableLeft + col1Width + 5, yPos + 5, {
						width: col2Width - 10,
						align: "center",
					});

				// Draw vertical lines for columns
				doc
					.moveTo(tableLeft + col1Width, yPos)
					.lineTo(tableLeft + col1Width, yPos + minRowHeight)
					.stroke();

				yPos += minRowHeight;

				// Check if we're approaching page bottom
				if (yPos > pageHeight - footerHeight - minRowHeight) {
					console.warn(
						`Table truncated at ${index + 1} entries due to page limit`
					);
					return false; // Exit the forEach loop
				}
			});
		};

		// Replace the existing table generation code with a call to this function
		generateTable();

		/**
		 * Adds content to a PDF page, handling overflow by continuing on new pages with the same header.
		 * @param {string} headerText - Header text for the content page
		 * @param {string} title - Title of the content
		 * @param {string} content - Content text to add
		 */
		const addContentWithOverflow = (headerText, title, content) => {
			doc.addPage();
			pageCounter++;

			// Add page dimensions inside the function
			const pageWidth = doc.page.width;
			const pageHeight = doc.page.height;

			addPageDecorations(
				pageCounter,
				allData.length + 1,
				headerText,
				pageWidth,
				pageHeight
			);
			doc
				.fontSize(16)
				.fillColor("black")
				.text(title, 20, headerHeight + 20, { align: "center" })
				.moveDown();

			let remainingContent = content.trim();
			const maxY = pageHeight - footerHeight - 20;

			while (remainingContent.length > 0) {
				const availableHeight = maxY - doc.y;
				const options = {
					align: "left",
					width: pageWidth - 40,
					height: availableHeight,
				};

				doc.fontSize(12).text(remainingContent, 20, doc.y, options);

				if (doc.y >= maxY && remainingContent.length > 0) {
					const renderedText = remainingContent.substring(
						0,
						Math.floor((availableHeight / 12) * (pageWidth - 40) * 0.1)
					);
					remainingContent = remainingContent
						.substring(renderedText.length)
						.trim();

					if (remainingContent.length > 0) {
						doc.addPage();
						pageCounter++;
						addPageDecorations(
							pageCounter,
							allData.length + 1,
							headerText,
							pageWidth,
							pageHeight
						);
						doc.y = headerHeight + 20;
					}
				} else {
					remainingContent = "";
				}
			}
		};

		// Add all content pages
		allData.forEach((dataEntry) => {
			if (
				dataEntry &&
				dataEntry.header &&
				dataEntry.title &&
				dataEntry.content
			) {
				addContentWithOverflow(
					dataEntry.header,
					dataEntry.title,
					dataEntry.content
				);
			}
		});

		// Finalize and send the PDF
		doc.end();
	} catch (error) {
		console.error("Error generating PDF:", error);
		// Ensure response is sent only if headers haven’t been sent yet
		if (!res.headersSent) {
			res.status(500).json({ error: "Internal server error" });
		}
		res.end(); // Close the response stream to prevent further errors
	}
});

/**
 * Start the Express server on the specified port.
 */
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
