'use strict'



window.onload = () => {

	var paper = Raphael(10, 50, 1000, 1000);

	var newSet = paper.importSVG( document.getElementById('leftL') );

	//let newSet = paper.importSVG('<svg><rect x="50" y="50" fill="#FF00FF" width="100" height="100" /></svg>');

	// Creates circle at x = 50, y = 40, with radius 10
	var circle = paper.circle(500, 40, 50);
	// Sets the fill attribute of the circle to red (#f00)
	circle.attr("fill", "#f00");

	// Sets the stroke attribute of the circle to white
	circle.attr("stroke", "#fff");
}

