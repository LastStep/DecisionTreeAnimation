function parse(text, delimiter) {
	let columns = [];
	let arr = text.split("\r\n");
	arr = arr.filter(function (el) {
		return el != "";
	});
	for (let i = 1; i < arr.length; i++) {
		arr[i] = arr[i].split(delimiter);
		for (let j = 0; j < arr[i].length; j++) {
			try {
				columns[j].push(arr[i][j]);
			} catch (TypeError) {
				columns[j] = [arr[i][j]];
			}
		}
	}
	let features = arr[0].split(",");
	// return [features, columns]
	return [features, arr.slice(1)];
}

readTextFile = async (file, delimiter) => {
	const response = await fetch(file);
	const text = await response.text();
	parseData(text, delimiter);
};

function parseData(text, delimiter) {
	[features, csvData] = parse(text, delimiter);
}

/*
Features :: Array of Column Names

Columns  :: Array of Arrays,
					  Each Array contains the whole Column

					  Index is the Column Number

Data     :: data parameter in any function is in similar form as columns
*/
