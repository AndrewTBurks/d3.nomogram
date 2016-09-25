// Parallel coordinate plot library on top of d3.js
// To keep similar to d3.js style, all methods return "this"
//
// Author: Andrew Burks <andrewtburks@gmail.com>
// GitHub: https://github.com/AndrewTBurks

// require variables to be declared
"use strict";

/**
  * @class VersatilePCP
  * @constructor
  */

function VersatilePCP() {
	this.plotData = null;

	this.colorFunc = function(d, i) { return "lightblue"; };
	this.defaultOpacity = 1;
	this.strokeSize = 1;

	this.plotAxes = null;

	this.isBrushable = false;
	this.filters = {}; // filters used if brushing is enabled
	this.filteredItemOpacity = 0.1;

	this.plotTarget = "body";
	this.svg = null;

	this.axes = null;
	this.lines = null;

	this.plotSize = null;
}

/**
  * Draw the parallel coordinate plots
  *
  * @method draw
  */
VersatilePCP.prototype.draw = function() {
	let _this = this;

	let width, height;

	let margin = {
		top: 50,
		bottom: 20,
		left: 20,
		right: 20
	};

	let axesSpec = [];
	let axesScales = {};

	let axisSpacing;

	if(!this.plotSize) {
		// get size from target element
		width = d3.select(this.plotTarget).node().clientWidth;
		height = d3.select(this.plotTarget).node().clientHeight;
	} else {
		// use specified size
		width = this.plotSize.width;
		height = this.plotSize.height;
	}

		// if drawing for first time, create svg
	if(!this.svg) {
		this.svg = d3.select(this.plotTarget)
			.append("svg")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("class", "VersatilePCP.svg");

		this.lines = this.svg.append("g");
		this.axes = this.svg.append("g");
	}

	this.svg
		.attr("width", width)
		.attr("height", height);

	// draw pcp
	if (this.plotData && this.plotData.length > 0) {
		// don't draw if there is no data...

		if(!this.plotAxes) {
			// define all axes
			let props = Object.keys(this.plotData[0]);

			props.forEach((key) => {
				let axisObject = {
					name: key,
					type: getAxisScaleType(this.plotData[0][key])
				};

				axisObject.domain = calculateAxisExtent(this.plotData.map(el => el[key]), axisObject.type);

				axesSpec.push(axisObject);
			});

		} else {
			// use the custom axes
			axesSpec = this.plotAxes;
		}

		drawAxes(axesSpec);
		drawLines();

	} else {
		throw "VersatilePCP: Data not found";
	}

	function getAxisScaleType(val) {
		if (typeof val === "number") {
			return "linear";
		} else if (typeof val === "string") {
			return "ordinal";
		}
	}

	function calculateAxisExtent(data, type) {
		if (type === "linear") {
			return d3.extent(data);
		} else if (type === "ordinal") {
			return data.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
		}
	}

	function drawAxes(axes) {
		axes.forEach((el) => {
			let scale;

			if (el.type === "linear") {
				scale = d3.scaleLinear()
					.domain(el.domain)
					.range([height - margin.bottom, margin.top])

				el.axisCall = d3.axisLeft(scale)
					.ticks(10);

			} else if (el.type === "ordinal") {
				let range = el.domain.map((d, i) => {
					return (height - margin.bottom) - (i * (height - margin.bottom - margin.top) / (el.domain.length - 1));
				});

				scale = d3.scaleOrdinal()
					.domain(el.domain)
					.range(range);

				el.axisCall = d3.axisLeft(scale);
					// .ticks(el.domain.length);
			}

			axesScales[el.name] = scale;
		});

		axisSpacing = (width - margin.left - margin.right) / (axes.length - 1);

	 	_this.axes.selectAll(".pcp-axis")
			.data(axes).enter()
		.append("g")
			.attr("class", "pcp-axis")
			.attr("transform", (d, i) => {
				return "translate(" + (margin.left + axisSpacing * i) + ", 0)";
			})
			.each((d, i, nodes) => {
				d.axisCall(d3.select(nodes[i]));
			});

		if(_this.isBrushable) {
			console.log("Creating Brushes");

			_this.axes.selectAll(".brush")
				.data(axesSpec).enter()
			.append("g")
				.attr("class", "Vbrush")
				.each((d, i, nodes) => {
					d3.brushY()
						.on("brush", brushed)
						.extent([
							[(margin.left + axisSpacing * i) - 10, margin.top],
							[(margin.left + axisSpacing * i) + 10, height - margin.bottom]
						])(d3.select(nodes[i]));
				});
		}

		function brushed(d) {
			// TODO: Create brushing filtering and update lines
		}
	}

	function drawLines() {
		let paths = _this.lines.selectAll(".dataPath")
			.data(_this.plotData);

		// exit
		paths.exit().remove();

		// update
		_this.lines.selectAll(".dataPath")
		.attr("d", (d) => {
			let points = Object.keys(axesScales).map((el, i) => {
				return "" + (margin.left + axisSpacing * i) + "," + axesScales[el](d[el]);
			});

			return "M" + points.join("L");
		})
		.style("stroke", _this.colorFunc)
		.style("stroke-width", _this.strokeSize)
		.style("stroke-opacity", _this.defaultOpacity)
		.style("fill", "none");

		// enter
		paths.enter()
		.append("path")
			.attr("class", "dataPath")
			.attr("d", (d) => {
				let points = Object.keys(axesScales).map((el, i) => {
					return "" + (margin.left + axisSpacing * i) + "," + axesScales[el](d[el]);
				});

				return "M" + points.join("L");
			})
			.style("stroke", _this.colorFunc)
			.style("stroke-width", _this.strokeSize)
			.style("stroke-opacity", _this.defaultOpacity)
			.style("fill", "none");
	}

	function calculatePath(d) {
		let points = Object.keys(axesScales).map((el, i) => {
			return "" + (margin.left + axisSpacing * i) + "," + axesScales[el](d[el]);
		});

		console.log(points);

		return "M" + points.join("L") + "Z";
	}

	return this;
};

/**
  * Set the data that will be used in the plots
  *
  * @method data
  * @param data       The data to be used in the plots
  */
VersatilePCP.prototype.data = function(data) {
	this.plotData = data;

	return this;
};

/**
  * Set the axes of the data that will be drawn
  *
  * @method axes
  * @param axes       An array of axes to be used
  */
VersatilePCP.prototype.axes = function(axes) {
	// axes must be array of data structure of this type

	this.plotAxes = axes || null;

	return this;
};

/**
  * Set the target element which the SVG will be appended to for drawing
  *
  * @method target
  * @param targetID			The ID of the pcp drawing target location
  */
VersatilePCP.prototype.target = function(targetID) {
	let oldTarget = this.plotTarget;

	this.plotTarget = targetID || "body";

	if(this.svg && oldTarget !== this.plotTarget) {
		// if the target has changed, remove the svg from the old location
		this.svg.remove();

		this.svg = null;
	}

	return this;
};

/**
  * Set a specific size for the pcp
  *
  * @method size
  * @param size			The {width: w, height: h} for the plots
  */
VersatilePCP.prototype.size = function(size) {
	this.plotSize = size || null;

	return this;
}

/**
  * Set brushable flag deciding if the pcp should be brushable or not
  *
  * @method brushable
	* @param brushable		true/false if the pcp will be brushable
  */
VersatilePCP.prototype.brushable = function(brushable) {
	this.isBrushable = brushable;

	return this;
};

/**
  * Set a method or color value for each pcp line based on data and
	* index of line
  *
  * @method color
	* @param color 			Function defining how to color each line
  */
VersatilePCP.prototype.color = function(color) {
	this.colorFunc = color || function(d, i) { return "lightblue"; };

	return this;
}

/**
  * Set a method or width for each pcp line stroke-width based on data and
	* index of line
  *
  * @method strokeWidth
	* @param width			Value or function defining how wide each line is
  */
VersatilePCP.prototype.strokeWidth = function(width) {
	if (width) {
		this.strokeSize = width;
	} else {
		this.strokeSize = 1;
	}

	return this;
}

/**
  * Set a method or value for each pcp line opacity based on data and
	* index of line
  *
  * @method opacity
	* @param opacity			Value or function defining how opaque each line is
  */
VersatilePCP.prototype.opacity = function(opacity) {
	if (opacity) {
		this.defaultOpacity = opacity;
	} else {
		this.defaultOpacity = 1;
	}

	return this;
}

/**
  * Set a method or value for each pcp line opacity based on data and
	* index of line when filter is applied to lines
	* This is the opacity of lines which are outside of the filter
  *
  * @method opacity
	* @param opacity			Value or function defining how opaque each line is when filter applied
  */
VersatilePCP.prototype.filteredOpacity = function(opacity) {
	if (opacity) {
		this.filteredItemOpacity = opacity;
	} else {
		this.filteredItemOpacity = 0.1;
	}

	return this;
}
