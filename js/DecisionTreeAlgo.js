// let data = [];

// Grab CSV Data
// d3.csv("data/iris.csv").then(function(csvData){
//     csvData.forEach(function(d){
//         data.push(d);
//     });
// });

class DataColumns {

	constructor(node, value) {
		this.node = node;
		this.value.push(value);
	}
}

// function readcsv(publicSpreadsheetUrl) {
// 	Tabletop.init( { key: publicSpreadsheetUrl,
// 											callback: showInfo,
// 											simpleSheet: true } )
// }

// function showInfo(data, tabletop) {
// 	console.log(data);
// }

// readcsv('https://docs.google.com/spreadsheets/d/1pct_LvoU40u6hu4GvuNXeMkJtCAWT-lgJNW_pgiOPg8');