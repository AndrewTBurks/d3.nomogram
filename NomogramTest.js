/* global Nomogram */

let myData = [
	{
		Thing1: 1,
		Thing2: 2,
		Word1: "hello",
		Thing3: 6
	},
	{
		Thing1: 3,
		Thing2: 2,
		Word1: "yes",
		Thing3: 4
	},
	{
		Thing1: 4,
		Thing2: 1,
		Word1: "hello",
		Thing3: 2
	},
	{
		Thing1: 10,
		Thing2: -3,
		Word1: "wow",
		Thing3: -1
	},
	{
		Thing1: 8,
		Thing2: -4,
		Word1: "Chihua",
		Thing3: 5
	}
];

let myNomogram = new Nomogram()
	.data(myData)
	.target("#myDiv")
	.size({
		width: 1000,
		height: 400
	})
	.setAxes([
		{
			name: "Thing1",
			// domain: [2, 5]
			rangeShrink: [0, 0.5]
		},
		{
			name: "Word1",
			rangeShrink: [0.5, 0.9]
		}
	],
	// "reduce")
	"alter", "shrinkAxis")
	.margins({
		top: 50,
		bottom: 20,
		left: 30,
		right: 30
	})
	.color("red")
	.opacity(0.6)
	.filteredOpacity(0.2)
	.strokeWidth(5)
	.brushable(true)
	.draw();
