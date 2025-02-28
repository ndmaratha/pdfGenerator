function generateTable(doc, data, x, y, columnWidths, rowHeight) {
	for (let i = 0; i < data.length; i++) {
		let rowY = y + i * rowHeight;

		for (let j = 0; j < data[i].length; j++) {
			let cellX = x + columnWidths.slice(0, j).reduce((a, b) => a + b, 0);
			doc.lineWidth(0.5);
			// Draw cell border
			doc.rect(cellX, rowY, columnWidths[j], rowHeight).stroke();

			// Add text inside the cell
			doc.text(data[i][j], cellX + 5, rowY + 5, {
				width: columnWidths[j] - 10,
				align: "left",
			});
		}
	}
}
