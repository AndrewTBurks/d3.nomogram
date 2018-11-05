/* global Nomogram */
// /* global d3 */

let myData = [
	{
		Thing1: 1,
		Thing2: "2",
		Word1: "hello",
		Thing3: 6
	},
	{
		Thing1: 3,
		Thing2: "2",
		Word1: "yes",
		Thing3: 4
	},
	{
		Thing1: 4,
		Thing2: "2",
		Word1: "hello",
		Thing3: 2
	},
	{
		Thing1: 10,
		Thing2: "2",
		Word1: "wow",
		Thing3: -1
	},
	{
		Thing1: 8,
		Thing2: "2",
		Word1: "word",
		Thing3: 5
	}
];

// when binding resize listener, call resize method of Nomogram
window.addEventListener("resize", function() {
	myNomogram.resize();
});

// set up basic nomogram with data, target, size and margins defined
let myNomogram = new Nomogram()
	.data(myData)
	.target("#myDiv")
	// .size({
	// 	width: 1000,
	// 	height: 400
	// })
	.margins({
		top: 20,
		bottom: 50,
		left: 30,
		right: 30
	});

// customize axes of nomogram
myNomogram
	.setAxes([
		{
			name: "Thing1",
			label: "Label",
			rangeShrink: [0, 0.5],
			tickValues: [1, 10],
			// domain: [2, 5]
		},
		{
			name: "Thing2",
			domain: ["2", "5"]
		},
		{
			name: "Word1",
			label: "I Am A Custom Label",
			rangeShrink: [0.5, 0.9]
		}
	], "alter", "shrinkAxis")
	.titlePosition("bottom")
	.strokeWidth(5)
	.titleFontSize(20)
	.titleRotation(-30)
	.tickFontSize(15);

// set style of nomogram (color and opacity of lines)
myNomogram
	.color("red")
	.opacity(0.6);

// set up brushing of nomogram
myNomogram
	.filteredOpacity(0)
	.brushable(true);

// set mouseover and mouseout functions for nomogram (using premade functions)
myNomogram
	.onMouseOver("hide-other")
	.onMouseOut("reset-paths");


// draw Nomogram with all of the custom settings
myNomogram
	.draw();
