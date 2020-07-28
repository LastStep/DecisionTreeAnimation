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

	repr() {
		let condition = "==";
		if (isNumeric(this.val)) {
			condition = ">=";
		}
		return `Is ${header[this.col]} ${condition} ${this.val}`;
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

function findBestSplit(data) {
	let bestGain = 0;
	let bestQuestion = null;
	let currentUncertainity = gini(data);
	let numFeatures = data[0].length - 1; // Excluding the label column
	for (let i = 0; i < numFeatures; i++) {
		values = uniqueVals(data, i);
		for (let j = 0; j < values.length; j++) {
			let question = new Question(i, values[j]);
			let [trueRows, falseRows] = [[], []];
			[trueRows, falseRows] = partition(data, question);
			if (trueRows.length === 0 || falseRows.length === 0) {
				continue;
			}
			let gain = infoGain(trueRows, falseRows, currentUncertainity);
			if (gain > bestGain) {
				[bestGain, bestQuestion] = [gain, question];
			}
		}
	}
	return [bestGain, bestQuestion];
}

class Leaf {
	constructor(data) {
		this.predictions = classCounts(data);
	}
}

class DecisionNode {
	constructor(question, trueBranch, falseBranch) {
		this.question = question;
		this.trueBranch = trueBranch;
		this.falseBranch = falseBranch;
	}
}

function buildTree(data) {
	let gain;
	let question;
	[gain, question] = findBestSplit(data);

	// Base case: no further info gain
	// Since we can ask no further questions, we'll return a leaf.
	if (gain == 0) {
		return new Leaf(data);
	}

	// If we reach here, we have found a useful feature / value to partition on.
	let [trueRows, falseRows] = [[], []];
	[trueRows, falseRows] = partition(data, question);

	let [trueBranch, falseBranch] = [[], []];
	trueBranch = new buildTree(trueRows);
	falseBranch = new buildTree(falseRows);

	return new DecisionNode(question, trueBranch, falseBranch);
}

function printTree(node, spacing = "") {
	if (node instanceof Leaf) {
		console.log(spacing + "Predict", node.predictions);
		return;
	}

	console.log(spacing + node.question.repr());
	console.log(spacing + "--> True:");
	printTree(node.trueBranch, spacing + "  ");

	console.log(spacing + "--> False:");
	printTree(node.falseBranch, spacing + "  ");
}

function initiate(data, features) {
	let myTree;
	header = features;
	myTree = buildTree(data);
	printTree(myTree);
}

let trainingHeader = ["color", "diameter", "label"];
let trainingData = [
	["Green", 3, "Apple"],
	["Yellow", 3, "Apple"],
	["Red", 1, "Grape"],
	["Red", 1, "Grape"],
	["Yellow", 3, "Lemon"],
];
