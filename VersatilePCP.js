// Parallel coordinate plot library on top of d3.js
// To keep similar to d3.js style, all methods return "this"
//
// Author: Andrew Burks <andrewtburks@gmail.com>
// GitHub: https://github.com/AndrewTBurks

// require variables to be declared
"use strict";

/* global d3 */

/**
  * @class VersatilePCP
  * @constructor
  */

function VersatilePCP() {
	this.plotData = null;

	this.colorFunc = "lightblue";
	this.defaultOpacity = 1;
	this.strokeSize = 1;

	this.plotAxes = null;
	this.customAxesMode = null;

	this.isBrushable = false;
	this.filters = {}; // filters used if brushing is enabled
	this.filteredItemOpacity = 0.1;

	this.plotTarget = "body";
	this.svg = null;

	this.axes = null;
	this.lines = null;

	this.plotSize = null;

	this.plotMargins = null;
}

/**
  * Draw the parallel coordinate plots
  */
VersatilePCP.prototype.draw = function() {
	let _this = this;

	let width, height;

	let margin = this.plotMargins || {
		top: 50,
		bottom: 20,
		left: 30,
		right: 30
	};

	let axesSpec = [];
	let axesScales = {};

	let axisSpacing;

	if (!this.plotSize) {
		// get size from target element
		width = d3.select(this.plotTarget).node().clientWidth;
		height = d3.select(this.plotTarget).node().clientHeight;
	} else {
		// use specified size
		width = this.plotSize.width;
		height = this.plotSize.height;
	}

		// if drawing for first time, create svg
	if (!this.svg) {
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

		if (this.customAxesMode === "reduce" && this.plotAxes) {
			// use the custom axes
			axesSpec = this.plotAxes.map((el) => {
				let obj = {};

				obj.name = el.name; // must have a name
				obj.type = el.type || getAxisScaleType(this.plotData[0][obj.name]);
				obj.domain = el.domain || calculateAxisExtent(this.plotData.map(el => el[obj.name]), obj.type);
				// range used to shrink ordinal scales to be smaller than the
				obj.rangeShrink = el.rangeShrink || [0, 1];

				return obj;
			});
		} else {
			// define all axes
			let props = Object.keys(this.plotData[0]);

			props.forEach((key) => {
				let axisObject = {
					name: key,
					type: getAxisScaleType(this.plotData[0][key])
				};

				axisObject.domain = calculateAxisExtent(this.plotData.map(el => el[key]), axisObject.type);
				axisObject.rangeShrink = [0, 1];
				axesSpec.push(axisObject);
			});

			if (this.plotAxes && this.customAxesMode === "alter") {
				this.plotAxes.forEach((el) => {
					let index = axesSpec.findIndex((el2) => {
						return el2.name === el.name;
					});

					if (index !== -1) {
						axesSpec[index].type = el.type ||
							getAxisScaleType(this.plotData[0][axesSpec[index].name]); // default value
						axesSpec[index].domain = el.domain ||
							calculateAxisExtent(this.plotData.map(el => el[axesSpec[index].name]), axesSpec[index].type); // default value
						// range used to shrink ordinal scales to be smaller than the
						axesSpec[index].rangeShrink = el.rangeShrink || [0, 1];

					}
				});
			}

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
			return data.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
		}
	}

	function drawAxes(axes) {
		axes.forEach((el) => {
			let scale;

			if (el.type === "linear") {
				// alter domain based on rangeShrink to give full axis
				let domainSize = (el.domain[1] - el.domain[0]) / (el.rangeShrink[1] - el.rangeShrink[0]);
				let newDomainStart = el.domain[0] - (domainSize * el.rangeShrink[0]);


				scale = d3.scaleLinear()
					.domain([newDomainStart, newDomainStart + domainSize])
					.range([(height - margin.bottom), margin.top]);

				el.axisCall = d3.axisLeft(scale)
					.ticks(10);

			} else if (el.type === "ordinal") {
				let start = (height - margin.bottom) - (height - margin.bottom - margin.top) * (el.rangeShrink[0] - 0);
				let end = margin.top + (height - margin.bottom - margin.top) * (1 - el.rangeShrink[1]);

				let range = el.domain.map((d, i) => {
					return start - (i * (start - end) / (el.domain.length - 1));
				});

				// if there is a custom range then add dummy elements to domain to shift the scale
				if (el.rangeShrink[0] > 0) {
					el.domain.unshift("");
					range.unshift(height - margin.bottom);
				}
				if (el.rangeShrink[1] < 1) {
					el.domain.push("");
					range.push(margin.top);
				}


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
				d3.select(nodes[i]).append("text")
					.text(d.name)
					.attr("y", margin.top - 12)
					.attr("class", "axis-title")
					.style("font-size", 12)
					.style("font-family", "sans-serif")
					.style("text-anchor", "middle")
					.style("fill", "black");

				d.axisCall(d3.select(nodes[i]));
			});

		if (_this.isBrushable) {

			_this.axes.selectAll(".brush")
				.data(axesSpec).enter()
			.append("g")
				.attr("class", "Vbrush")
				.each((d, i, nodes) => {
					d3.brushY()
						.on("brush", brushed)
						.on("end", brushended)
						.extent([
							[(margin.left + axisSpacing * i) - 10, margin.top],
							[(margin.left + axisSpacing * i) + 10, height - margin.bottom]
						])(d3.select(nodes[i]));
				});
		}

		function brushed(d) {
			// TODO: Create brushing filtering and update lines
			let extent = d3.event.selection;

			_this.filters[d.name] = extent;

			_this.lines.selectAll(".dataPath")
				.style("stroke-opacity", (d) => dataInFilter(d));
		}

		function brushended(d) {
			// TODO: Create brushing filtering and update lines
			if (!d3.event.selection) {
				// clear this filter
				delete _this.filters[d.name];

				_this.lines.selectAll(".dataPath")
					.style("stroke-opacity", (d) => dataInFilter(d));
			}

		}

		function dataInFilter(d) {
			let accepted = true;

			// return the opacity of the line based on whether or not the data is filtered out
			Object.keys(_this.filters).forEach((el) => {

				if (axesScales[el](d[el]) > _this.filters[el][1] || axesScales[el](d[el]) < _this.filters[el][0]) {
					accepted = false;
				}
			});

			return accepted ? _this.defaultOpacity : _this.filteredItemOpacity;
		}
	}

	function filterDataByDomains(data) {
		return data.filter((el) => {
			let inFilter = true;

			axesSpec.forEach((s) => {
				let domain = s.domain;

				if (s.type === "linear") {
					if (el[s.name] < domain[0] || el[s.name] > domain[1]) {
						inFilter = false;
					}
				} else if (s.type === "ordinal") {
					if (domain.indexOf(el[s.name]) === -1) {
						inFilter = false;
					}
				}
			});

			return inFilter;
		});
	}

	function drawLines() {
		let paths = _this.lines.selectAll(".dataPath")
			.data(filterDataByDomains(_this.plotData));

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
			.attr("d", calculatePath)
			.style("stroke-linecap", "round")
			.style("stroke", _this.colorFunc)
			.style("stroke-width", _this.strokeSize)
			.style("stroke-opacity", _this.defaultOpacity)
			.style("fill", "none");
	}

	function calculatePath(d) {
		let points = Object.keys(axesScales).map((el, i) => {
			return "" + (margin.left + axisSpacing * i) + "," + axesScales[el](d[el]);
		});

		return "M" + points.join("L");
	}

	return this;
};

/**
  * Set the data that will be used in the plots
  *
  * @param {array} data - The data to be used in the plots
  */
VersatilePCP.prototype.data = function(data) {
	this.plotData = data;

	return this;
};

/**
  * Set the axes of the data that will be drawn
  *
  * @param {array} [axes = null] - An array of axes to be used
	* @param {string} [mode = reduce] - The mode which the custom axes is using "alter" or "reduce"
  */
VersatilePCP.prototype.setAxes = function(axes, mode) {
	// axes must be array of objects of this type
	/* OBJECT: [] := optional items
		{
			name: (name of property)
			[, type: (type of scale, linear or ordinal)]
			[, domain: (the domain of the data -- custom domain can be used for linear scale shifts)]
			[, rangeShrink: (extent inside [0,1] with which to shrink the scale -- for ordinal scale shifts)]
		}
	*/

	this.plotAxes = axes || null;

	// "alter" changes specified axes, "reduce" only draws specified axes
	this.customAxesMode = mode || "reduce";

	return this;
};

/**
  * Set the target element which the SVG will be appended to for drawing
  *
  * @param {string} [targetID = body] - The ID of the pcp drawing target location
  */
VersatilePCP.prototype.target = function(targetID) {
	let oldTarget = this.plotTarget;

	this.plotTarget = targetID || "body";

	if (this.svg && oldTarget !== this.plotTarget) {
		// if the target has changed, remove the svg from the old location
		this.svg.remove();

		this.svg = null;
	}

	return this;
};

/**
  * Set a specific size for the pcp
  *
  * @param {object} [size] - The size of the plots
  * @param {object} size.width - The width for the plots
  * @param {object} size.height - The height for the plots
  */
VersatilePCP.prototype.size = function(size) {
	this.plotSize = size || null;

	return this;
};

/**
  * Set brushable flag deciding if the pcp should be brushable or not
  *
	* @param {boolean} brushable -	true/false if the pcp will be brushable
  */
VersatilePCP.prototype.brushable = function(brushable) {
	this.isBrushable = brushable;

	return this;
};

/**
  * Set a method or color value for each pcp line based on data and
	* index of line
  *
	* @param {function} [color = "lightblue"] - Function defining how to color each line
  */
VersatilePCP.prototype.color = function(color) {
	this.colorFunc = color || "lightblue";

	return this;
};

/**
  * Set a method or width for each pcp line stroke-width based on data and
	* index of line
  *
	* @param {number} [width = 1] - Value or function defining how wide each line is
  */
VersatilePCP.prototype.strokeWidth = function(width) {
	if (width) {
		this.strokeSize = width;
	} else {
		this.strokeSize = 1;
	}

	return this;
};

/**
  * Set a method or value for each pcp line opacity based on data and
	* index of line
  *
	* @param {number} [opacity = 1] - Value or function [0,1] defining how opaque each line is
  */
VersatilePCP.prototype.opacity = function(opacity) {
	if (opacity || opacity === 0) {
		this.defaultOpacity = opacity;
	} else {
		this.defaultOpacity = 1;
	}

	return this;
};

/**
  * Set a method or value for each pcp line opacity based on data and
	* index of line when filter is applied to lines
	* This is the opacity of lines which are outside of the filter
  *
	* @param {number} [opacity = 0.1]	- Value or function [0,1] defining how opaque each line is when filter applied
  */
VersatilePCP.prototype.filteredOpacity = function(opacity) {
	if (opacity || opacity === 0) {
		this.filteredItemOpacity = opacity;
	} else {
		this.filteredItemOpacity = 0.1;
	}

	return this;
};

/**
  * Set the margins around the pcp within the drawing space
  *
	* @param {object} [margins = null] - Object specifying margins
	* @param {number} margins.top = 50 - Top Margin
	* @param {number} margins.bottom = 20 - Bottom Margin
	* @param {number} margins.left = 30 - Left Margin
	* @param {number} margins.right = 30 - Right Margin
  */
VersatilePCP.prototype.margins = function(margins) {
	if (margins) {
		this.plotMargins = margins;
	} else {
		this.plotMargins = null;
	}

	return this;
};
