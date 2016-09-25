var myData = [
	{
		a: 1,
		b: 2,
		c: "hello",
		d: 6
	},
	{
		a: 3,
		b: 2,
		c: "yes",
		d: 4
	},
	{
		a: 4,
		b: 1,
		c: "hello",
		d: 2
	},
	{
		a: 10,
		b: -3,
		c: "wow",
		d: -1
	},
	{
		a: 8,
		b: -4,
		c: "Chihua",
		d: 5
	}
];

var myPCP = new VersatilePCP()
	.data(myData)
	.target("#myDiv")
	.size({
		width: 1000,
		height: 400
	})
	.setAxes([
		{
			name: "a",
			rangeShrink: [0.25, 0.5]
		},
		{
			name: "c",
			rangeShrink: [0.5, 0.9]
		}
	],
	"alter")
	// "reduce")
	.color("red")
	.opacity(0.6)
	.filteredOpacity(0.2)
	.strokeWidth(5)
	.brushable(true)
	.draw();

console.log(myPCP);
