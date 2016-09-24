var myData = [
	{
		a: 1,
		b: 2
	},
	{
		a: 3,
		b: 2
	},
	{
		a: 4,
		b: 1
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
