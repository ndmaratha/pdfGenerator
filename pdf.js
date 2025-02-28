const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const app = express();
const PORT = 3000; // Changed from 8080 to avoid conflicts

// Middleware
app.use(express.json()); // Parse JSON bodies for POST requests
app.use(cors()); // Enable CORS if needed

// Debugging middleware to log requests
app.use((req, res, next) => {
	console.log(
		`Request Method: ${req.method}, URL: ${req.url}, Body:`,
		req.body
	);
	next();
});

// Sample data

const colors = [
	"#cc0000",
	"#cc6600",
	"#00cc00",
	"#0000cc",
	"#660066",
	"#6600cc",
];

const generatePDF = async () => {
	try {
		const pdfPath = path.join(__dirname, "homepage.pdf");
		const doc = new PDFDocument({ size: "A4" });
		const stream = fs.createWriteStream(pdfPath);
		doc.pipe(stream);

		// Homepage (Page 1)
		doc.rect(0, 0, doc.page.width, doc.page.height).fill("#06140d");
		doc
			.font("Helvetica-Bold")
			.fontSize(20)
			.fillColor("yellow")
			.text("Sai Global Gurukul", { align: "center", y: 40 });
		doc.fontSize(30).text("SCAN REPORT", { align: "center", y: 70 });

		const logoPath = path.join(__dirname, "images", "logo.png");
		if (!fs.existsSync(logoPath))
			throw new Error("Logo file not found at: " + logoPath);
		doc.image(logoPath, 20, 10, { width: 70, height: 70 });

		doc
			.lineWidth(11)
			.strokeColor("yellow")
			.rect(0, 0, doc.page.width, doc.page.height)
			.stroke();

		// Table of Contents (Page 2)
		doc.addPage({ size: "A4" });
		doc.rect(0, 0, doc.page.width, 40).fill("#8B0000");
		doc
			.font("Helvetica-Bold")
			.fontSize(16)
			.fillColor("white")
			.text("Table of Contents", 50, 17, { align: "center" });

		const tableTop = 100,
			tableLeft = 50,
			colWidth = (doc.page.width - 100) / 2,
			rowHeight = 25;
		doc
			.rect(tableLeft - 10, tableTop - 5, colWidth * 2 + 20, rowHeight)
			.fill("white");
		doc
			.font("Helvetica-Bold")
			.fontSize(12)
			.fillColor("black")
			.text("Content", tableLeft, tableTop, { width: colWidth, align: "left" })
			.text("Page No.", tableLeft + colWidth, tableTop, {
				width: colWidth,
				align: "right",
			});

		doc.font("Helvetica").fontSize(10).fillColor("black");
		for (let i = 0; i < allData.length; i++) {
			const yPos = tableTop + (i + 1) * rowHeight;
			doc
				.rect(tableLeft - 10, yPos - 5, colWidth * 2 + 20, rowHeight)
				.fill("white");
			doc.text(allData[i].header, tableLeft, yPos, {
				width: colWidth,
				align: "left",
			});
			doc.text((i + 2).toString(), tableLeft + colWidth, yPos, {
				width: colWidth,
				align: "right",
			});
		}

		// Content Pages
		for (let i = 0; i < allData.length; i++) {
			doc.addPage({ size: "A4" });
			const item = allData[i],
				color = colors[i % colors.length];

			doc.rect(0, 0, doc.page.width, 60).fill(color);
			doc.image(logoPath, 12, 10, { width: 50, height: 50 });
			doc
				.font("Helvetica-Bold")
				.fontSize(16)
				.fillColor("white")
				.text(item.header, { align: "center", y: 20 });

			doc
				.font("Helvetica-Bold")
				.fontSize(12)
				.fillColor("black")
				.text(item.title, 20, 80);
			doc
				.font("Helvetica")
				.fontSize(9)
				.fillColor("black")
				.text(item.content, 20, 100, { width: doc.page.width - 40 });

			doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill(color);
			doc
				.font("Helvetica")
				.fontSize(14)
				.fillColor("white")
				.text(`SGG-Scan Report of ${item.name}`, 20, doc.page.height - 40)
				.text(`Page ${i + 2}`, doc.page.width - 50, doc.page.height - 40, {
					align: "right",
				});

			doc
				.lineWidth(11)
				.strokeColor("yellow")
				.rect(0, 0, doc.page.width, doc.page.height)
				.stroke();
		}

		doc.end();
		return new Promise((resolve, reject) => {
			stream.on("finish", () => resolve(pdfPath));
			stream.on("error", reject);
		});
	} catch (error) {
		console.error("Error Generating PDF:", error);
		return null;
	}
};

// GET Route for static PDF generation
app.get("/generate-pdf", async (req, res) => {
	const pdfPath = await generatePDF();
	if (pdfPath) {
		res.download(pdfPath, "homepage.pdf", (err) => {
			if (err) console.error("Error sending PDF:", err);
			fs.unlink(pdfPath, (unlinkErr) => {
				if (unlinkErr) console.error("Error deleting file:", unlinkErr);
			});
		});
	} else {
		res.status(500).send("Error generating PDF");
	}
});

// POST Route for dynamic PDF generation
app.post("/generate-pdf", (req, res) => {
	const { chapters } = req.body || {};
	if (!chapters || !Array.isArray(chapters)) {
		return res
			.status(400)
			.send("Invalid or missing chapters data in request body.");
	}

	const filePath = path.join(__dirname, "output.pdf");
	const doc = new PDFDocument({
		size: "A4",
		margins: { top: 30, bottom: 30, left: 30, right: 30 },
	});
	const stream = fs.createWriteStream(filePath);
	doc.pipe(stream);

	let currentPage = 1;
	const tableOfContents = chapters.map((ch, index) => ({
		title: ch.title,
		page: currentPage + index,
	}));

	generateTOCPage(doc, tableOfContents);
	currentPage++;

	chapters.forEach((chapter) => {
		generateChapterPage(doc, chapter.title, chapter.content, currentPage);
		currentPage++;
		if (currentPage <= chapters.length + 1) doc.addPage();
	});

	doc.end();

	stream.on("finish", () => {
		res.download(filePath, "output.pdf", (err) => {
			if (err) console.error("Error sending PDF:", err);
			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) console.error("Error deleting file:", unlinkErr);
			});
		});
	});

	stream.on("error", (err) => {
		console.error("Stream error:", err);
		res.status(500).send("Error generating PDF");
	});
});

// Helper Functions
function generateTOCPage(doc, toc) {
	doc.addPage();
	doc.fillColor("white").rect(30, 30, 535, 50).fill("#B22222");
	doc
		.fillColor("white")
		.fontSize(20)
		.text("Table Of Contents", 200, 45, { align: "center" });

	doc.moveDown(2);
	doc.fillColor("black").fontSize(12);
	toc.forEach((item, index) => {
		doc.text(`${index + 1}. ${item.title} ............. ${item.page}`, {
			indent: 50,
		});
		doc.moveDown(0.5);
	});
}

function generateChapterPage(doc, title, content, pageNumber) {
	doc.rect(20, 20, 555, 802).lineWidth(3).stroke("#FFD700");
	doc.fillColor("white").rect(23, 23, 549, 25).fill("#1E90FF");
	doc.fillColor("white").fontSize(14).text(title, 30, 30, { align: "center" });

	doc.fillColor("white").rect(23, 800, 549, 12).fill("#FF8C00");
	doc
		.fillColor("white")
		.fontSize(10)
		.text(`Page ${pageNumber} | My Report`, 30, 805, { align: "center" });

	doc.fillColor("black").fontSize(12).text(content, 40, 70, { width: 500 });
}

// Start Server
app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
