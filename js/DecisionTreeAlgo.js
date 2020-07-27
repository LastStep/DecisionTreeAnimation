//Data  :: Array of Arrays, Each Array contains the whole Column
function getRow(data, index) {
	let row = [];
	data.forEach((element) => {
		row.push(element[index]);
	});
	return row;
}

//Data  :: Array of Arrays, Each Array contains the whole Column
function getRows(data, startIndex, endIndex) {
	let rows = [];
	for (let i = startIndex; i < endIndex; i++) {
		rows.push(getRow(data, i));
	}
	return rows;
}

//Data  :: Array of Arrays, Each Array corresponds to single row
function uniqueVals(data, col) {
	let row = [];
	data.forEach((element) => {
		if (!row.includes(element[col])) {
			row.push(element[col]);
		}
	});
	return row;
}

//Data  :: Array of Arrays, Each Array corresponds to single row
function classCounts(data) {
	let counts = {};
	data.forEach((row) => {
		label = row.slice(-1)[0];
		if (!(label in counts)) {
			counts[label] = 0;
		}
		counts[label] += 1;
	});
	return counts;
}

function isNumeric(num) {
	return !isNaN(num);
}

class Question {
	constructor(col, val) {
		this.col = col;
		this.val = val;
	}

	match(row) {
		let val = row[this.col];
		if (isNumeric(val)) {
			return val >= this.val;
		} else {
			return val == this.val;
		}
	}
}

//Data  :: Array of Arrays, Each Array corresponds to single row 
function partition(data, question) {
	let [trueRows, falseRows] = [[], []];
	for (let i = 0; i < data.length; i++) {
		let row = data[i];
		if (question.match(row)) {
			trueRows.push(row);
		} else {
			falseRows.push(row);
		}
	}
	return [trueRows, falseRows];
}

function gini(data) {
	let counts = classCounts(data);
	let impurity = 1;
	let numOfRows = data.length;
	Object.keys(counts).forEach((key) => {
		impurity -= Math.pow(counts[key] / numOfRows, 2);
	});
	return impurity;
}

function infoGain(left, right, currentUncertainity) {
	let p = left.length / (left.length + right.length);
	return currentUncertainity - p * gini(left) - (1 - p) * gini(right);
}

let trainingData = [
	["Green", 3, "Apple"],
	["Yellow", 3, "Apple"],
	["Red", 1, "Grape"],
	["Red", 1, "Grape"],
	["Yellow", 3, "Lemon"],
];
