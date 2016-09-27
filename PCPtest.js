/* global VersatilePCP */

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

let myPCP = new VersatilePCP()
	.data(myData)
	.target("#myDiv")
	.size({
		width: 1000,
		height: 400
	})
	.setAxes([
		{
			name: "Thing1",
			rangeShrink: [0.25, 0.5]
		},
		{
			name: "Word1",
			rangeShrink: [0.5, 0.9]
		}
	],
	"alter")
	.margins({
		top: 100,
		bottom: 0,
		left: 60,
		right: 10
	})
	// "reduce")
	.color("red")
	.opacity(0.6)
	.filteredOpacity(0.2)
	.strokeWidth(5)
	.brushable(true)
	.draw();
