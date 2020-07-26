function parse(text, delimiter) {
	let columns = []
	let arr = text.split("\n");
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
	return [columns, features]
	// let data = arr.filter(function(el) { return el != ""; });
	// document.getElementById('result').textContent = JSON.stringify(data, null, 2);
}

readTextFile = async (file, delimiter) => {
	const response = await fetch(file)
	const text = await response.text()
	parseData(text, delimiter)
}

function parseData(data, delimiter) {
	Data = parse(data, delimiter);
	console.log(Data);
}

