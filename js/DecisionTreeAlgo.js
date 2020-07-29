function uniqueVals(data, col) {
	/*
	Find the unique values for a column in a dataset
	input  :data in row format (array of arrays)
					column index
	output :array of unique values in a column
	*/
	let row = [];
	data.forEach((element) => {
		if (!row.includes(element[col])) {
			row.push(element[col]);
		}
	});
	return row;
}

function classCounts(data) {
	/* 
	Counts the number of each type of example in a dataset
	input  :data in row format (array of arrays)
	output :dict for frequency of labels
	*/
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
	/* 
	A Question is used to partition a dataset.
	This class just records a 'column number' and a 'column value'. 
	The 'match' method is used to compare 
	the feature value in an example to the feature value stored in the question
	*/
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

	repr(features) {
		let condition = "==";
		if (isNumeric(this.val)) {
			condition = ">=";
		}
		return `Is ${features[this.col]} ${condition} ${this.val}?`;
	}
}

//Data  :: Array of Arrays, Each Array corresponds to single row
function partition(data, question) {
	/* 
	For each row in the dataset, check if it matches the question. If
	so, add it to 'true rows', otherwise, add it to 'false rows'
	input  :data in row format (array of arrays)
					question as the object of Question
	output :array[0] rows that satisfy the condition
					array[1] rows that do not satisfy the condtion
	*/
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
	/* 
	Calculate the Gini Impurity for a list of rows
	input  :data in row format (array of arrays)
	output :number
	*/
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

	for (let col = 0; col < numFeatures; col++) {
		values = uniqueVals(data, col);

		for (let j = 0; j < values.length; j++) {
			let question = new Question(col, values[j]);
			let [trueRows, falseRows] = [[], []];
			[trueRows, falseRows] = partition(data, question);
			if (trueRows.length === 0 || falseRows.length === 0) {
				continue;
			}
			let gain = infoGain(trueRows, falseRows, currentUncertainity);
			if (gain >= bestGain) {
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
	if (!gain) {
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

function printTree(node, features, spacing = "") {
	if (node instanceof Leaf) {
		console.log(spacing + "Predict", node.predictions);
		return;
	}

	console.log(spacing + node.question.repr(features));
	console.log(spacing + "--> True:");
	printTree(node.trueBranch, features, spacing + "  ");

	console.log(spacing + "--> False:");
	printTree(node.falseBranch, features, spacing + "  ");
}

function initiate(data, features) {
	let myTree;
	myTree = buildTree(data);
	printTree(myTree, features);
	return myTree;
}

function predictRow(testRow, tree) {
	if (tree instanceof Leaf) {
		let maxPred = 0;
		let predictions = tree.predictions;
		let prediction = [];
		Object.keys(predictions).forEach((key) => {
			if (predictions[key] >= maxPred) {
				prediction.push(key);
			}
		});
		return prediction;
	}

	return (testRow[tree.question.col] >= tree.question.val) ?
		predictRow(testRow, tree.trueBranch) : predictRow(testRow, tree.falseBranch);
}

function predict(testData, tree) {
	let predictions = [];
	testData.forEach(testRow => {
		predictions.push(predictRow(testRow, tree));
	});
	return predictions;
}

let trainingHeader = ["color", "diameter", "label"];
let trainingData = [
	["Green", 3, "Apple"],
	["Yellow", 3, "Apple"],
	["Red", 1, "Grape"],
	["Red", 1, "Grape"],
	["Yellow", 3, "Lemon"],
];
let testingData = [
	['Green', 3, 'Apple'],
	['Yellow', 4, 'Apple'],
	['Red', 2, 'Grape'],
	['Red', 1, 'Grape'],
	['Yellow', 3, 'Lemon'],
];


