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
	this.plotAxes = null;

	this.isBrushable = false;

	this.plotTarget = "body";
	this.svg = null;
	this.plotSize = null;
}

/**
  * Draw the parallel coordinate plots
  *
  * @method draw
  */
VersatilePCP.prototype.draw = function() {
	let width, height;

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
	}

	this.svg
		.attr("width", width)
		.attr("height", height);

	// draw pcp
	if (this.plotData && this.plotData.length > 0) {
		// don't draw if there is no data...
		let axesSpec = [];

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


			console.log(axesSpec);

		} else {
			// use the custom axes
		}

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

	function drawAxes() {

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

	if (!axes) {
		// if the new axes aren't specified, revert back to all axes
		this.plotAxes = null;
	} else {
		// otherwise set plotAxes to be axes specified
		this.plotAxes = axes;
	}

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

	if (!targetID) {
		// if new targetID is not specified, default to body
		this.plotTarget = "body";
	} else {
		// otherwise set target to be new targetID
		this.plotTarget = targetID;
	}

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
	if (!size) {
		this.plotSize = null;
	} else {
		this.plotSize = size;
	}

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
	if (!color) {
		// if new targetID is not specified, default to body
		this.colorFunc = function(d, i) { return "lightblue"; };
	} else {
		// otherwise set target to be new targetID
		this.colorFunc = color;
	}

	return this;
}
