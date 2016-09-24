var myData = [
	{
		a: 1,
		b: 2,
		c: "hello"
	},
	{
		a: 3,
		b: 2,
		c: "yes"
	},
	{
		a: 4,
		b: 1,
		c: "hello"
	},
	{
		a: 10,
		b: -3,
		c: "wow"
	}
];

var myPCP = new VersatilePCP()
	.data(myData)
	.target("#myDiv")
	.size({
		width: 1000,
		height: 300
	})
	.color("red")
	.draw();

console.log(myPCP);
