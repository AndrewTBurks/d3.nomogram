// Nomogram library on top of d3.js
// To keep similar to d3.js style, all methods return "this"
//
// Author: Andrew Burks <andrewtburks@gmail.com>
// GitHub: https://github.com/AndrewTBurks

// require variables to be declared
"use strict";

/* global d3 */

/**
  * @class Nomogram
  * @constructor
  */

function Nomogram() {
	this.plotData = null;

	this.colorFunc = "lightblue";
	this.defaultOpacity = 1;
	this.strokeSize = 1;

	this.plotAxes = null;
	this.customAxesMode = "reduce";
	this.rangeShrinkMode = "shrinkAxis";
	this.axisTitlePosition = "top";
	this.axisTitleFontSize = 10;
	this.axisTickFontSize = 8;


	this.isBrushable = false;
	this.filters = {}; // filters used if brushing is enabled
	this.filtersPercent = {};
	this.dataFilteringFunction = null;

	this.filteredItemOpacity = 0.1;

	this.onMouseOutFunc = null;
	this.onMouseOverFunc = null;

	this.plotTarget = "body";
	this.svg = null;

	this.axes = null;
	this.lines = null;

	this.plotSize = null;

	this.plotMargins = null;
}

/**
  * Draw the nomogram
  */
Nomogram.prototype.draw = function() {
	let _this = this;

	let width, height;
	let svgWidth, svgHeight;

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
        svgWidth = d3.select(this.plotTarget).node().clientWidth;

		// if it is an element with 0 width, give it a default width of 500
        svgWidth = svgWidth || 500;

        svgHeight = d3.select(this.plotTarget).node().clientHeight;

		// if it is an element with 0 height, give it a starting height proportial
		// to width
        svgHeight = svgHeight || svgWidth * 0.4;
	} else {
		// use specified size
        svgWidth = this.plotSize.width;
        svgHeight = this.plotSize.height;
	}

	// if drawing for first time, create svg
  if (!this.svg) {
      this.svg = d3.select(this.plotTarget)
          .append("svg")
          .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
          .attr("class", "Nomogram.svg");

      this.lines = this.svg.append("g");
      this.axes = this.svg.append("g");

      width = svgWidth;
      height = svgHeight;
  } else {
      let box = this.svg.attr("viewBox").split(" ").map((d) => parseInt(d));

      width = box[2];
      height = box[3];
  }

	this.svg
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// draw nomogram
	if (this.plotData && this.plotData.length > 0) {
		// don't draw if there is no data...

		if (this.customAxesMode === "reduce" && this.plotAxes) {
			// use the custom axes
			axesSpec = this.plotAxes.map((el) => {
				let obj = {};

				obj.name = el.name; // must have a name
				obj.label = el.label || el.name; // defaults to name
				obj.type = el.type || getAxisScaleType(this.plotData[0][obj.name]);
				obj.domain = el.domain || calculateAxisExtent(this.plotData.map(el => el[obj.name]), obj.type);
				// range used to shrink ordinal scales to be smaller than the
				obj.rangeShrink = el.rangeShrink || [0, 1];
				obj.tickValues = el.tickValues || null;

				if (allValuesSame(this.plotData.map(d => d[obj.name])) && !el.domain) {
					if (obj.type === "linear") {
						obj.domain = [0, 2 * this.plotData[0][obj.name]];
					} else if (obj.type === "ordinal") {
						obj.domain = ["", this.plotData[0][obj.name], ""];
					}
				}

				return obj;
			});
		} else {
			// define all axes
			let props = Object.keys(this.plotData[0]);

			props.forEach((key) => {
				let axisObject = {
					name: key,
					label: key,
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
						axesSpec[index].label = el.label;
						axesSpec[index].type = el.type ||
							getAxisScaleType(this.plotData[0][axesSpec[index].name]); // default value
						axesSpec[index].domain = el.domain ||
							calculateAxisExtent(this.plotData.map(el => el[axesSpec[index].name]), axesSpec[index].type); // default value
						// range used to shrink ordinal scales to be smaller than the
						axesSpec[index].rangeShrink = el.rangeShrink || [0, 1];
						axesSpec[index].tickValues = el.tickValues || null;

					}
				});
			}

			props.forEach(key => {
				if ((allValuesSame(this.plotData.map((d) => d[key])) &&
					!axesSpec[axesSpec.findIndex(a => a.name === key)]) ||
					axesSpec[axesSpec.findIndex(a => a.name === key)].domain.length === 1) {
					let index = axesSpec.findIndex((el) => {
						return el.name === key;
					});

					if (axesSpec[index].type === "linear") {
						axesSpec[index].domain = [0, 2 * this.plotData[0][axesSpec[index].name]];
					} else if (axesSpec[index].type === "ordinal") {
						axesSpec[index].domain = ["", this.plotData[0][axesSpec[index].name], ""];
					}
				}
			});

		}

		drawAxes(axesSpec);
		drawLines();

	} else {
		throw "d3.nomogram: Data not found";
	}

	function allValuesSame(arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] !== arr[0]) {
				return false;
			}
		}

		return true;
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

				let axisHeight = height - margin.bottom - margin.top;

				scale = d3.scaleLinear();

				if (_this.rangeShrinkMode === "shrinkAxis") {
					scale
						.domain(el.domain)
						.range([((height - margin.bottom) - axisHeight * el.rangeShrink[0]), ((height - margin.bottom) - axisHeight * el.rangeShrink[1])]);

				} else if (_this.rangeShrinkMode === "shrinkRange") {
					scale
						.domain([newDomainStart, newDomainStart + domainSize])
						.range([(height - margin.bottom), margin.top]);
				}


				el.axisCall = d3.axisLeft(scale);

				if (el.tickValues) {
					el.axisCall.tickValues(el.tickValues);
				} else {
					el.axisCall.ticks(10);
				}

			} else if (el.type === "ordinal") {
				let start = (height - margin.bottom) - (height - margin.bottom - margin.top) * (el.rangeShrink[0] - 0);
				let end = margin.top + (height - margin.bottom - margin.top) * (1 - el.rangeShrink[1]);

				let range = el.domain.map((d, i) => {
					return start - (i * (start - end) / (el.domain.length - 1));
				});

				// if there is a custom range then add dummy elements to domain to shift the scale
				if (_this.rangeShrinkMode === "shrinkRange") {
					if (el.rangeShrink[0] > 0) {
						el.domain.unshift("");
						range.unshift(height - margin.bottom);
					}
					if (el.rangeShrink[1] < 1) {
						el.domain.push("");
						range.push(margin.top);
					}
				} else if (_this.rangeShrinkMode === "shrinkAxis") {
					// leave range and domain unchanged
				}

				scale = d3.scaleOrdinal()
					.domain(el.domain)
					.range(range);

				el.axisCall = d3.axisLeft(scale);

				// support tickValues specification
				if (el.tickValues) {
					el.axisCall.tickValues(el.tickValues);
				}
					// .ticks(el.domain.length);
			}

			axesScales[el.name] = scale;
		});

		axisSpacing = (width - margin.left - margin.right) / (axes.length - 1);

		_this.axes.selectAll(".nomogram-axis").remove();

		_this.axes.selectAll(".nomogram-axis")
			.data(axes).enter()
		.append("g")
			.attr("class", "nomogram-axis")
			.attr("transform", (d, i) => {
				return "translate(" + (margin.left + axisSpacing * i) + ", 0)";
			})
			.each(function(d) {
				d.axisCall(d3.select(this));
			})
		.selectAll("text")
			.style("font-size", _this.axisTickFontSize);

		_this.axes.selectAll(".nomogram-axis")
			.each((d, i, nodes) => {
				d3.select(nodes[i]).append("g")
					.attr("transform", () => {
						let dy;

						if (_this.axisTitlePosition === "bottom") {
							dy = height - margin.bottom + _this.axisTitleFontSize + 10;
						} else {
							dy = margin.top - _this.axisTitleFontSize;
						}

						return "translate(0," + dy + ")";
					})
				.append("text")
					.text(d.label || d.name)
					.attr("transform", "rotate(" + _this.axisTitleRotation + ")")
					.attr("class", "axis-title")
					.style("font-size", _this.axisTitleFontSize)
					.style("font-family", "sans-serif")
					.style("text-anchor", "middle")
					.style("fill", "black");
				});

		if (_this.isBrushable) {

			_this.axes.selectAll(".brush").remove();

			_this.axes.selectAll(".brush")
				.data(axesSpec).enter()
			.append("g")
				.attr("class", "brush")
				.each(function (d, i) {
					let brush = d3.brushY()
						.on("brush", brushed)
						.on("end", brushended)
						.extent([
							[(margin.left + axisSpacing * i) - 10, d3.extent(axesScales[d.name].range())[0]],
							[(margin.left + axisSpacing * i) + 10, d3.extent(axesScales[d.name].range())[1]]
						]);

						var g = d3.select(this);

						g.call(brush);

						if (_this.filters[d.name]) {
							let axisLength = axesScales[d.name].range()[1] - axesScales[d.name].range()[0];

							let newBrushRange = [
								(_this.filtersPercent[d.name][0] * axisLength) + axesScales[d.name].range()[0],
								(_this.filtersPercent[d.name][1] * axisLength) + axesScales[d.name].range()[0]
							];

							// g.call(brush.move, _this.filters[d.name]);
							g.call(brush.move, newBrushRange);
						}
				});
		}

		function brushed(d) {
			let extent = d3.event.selection;
			let axisLength = axesScales[d.name].range()[1] - axesScales[d.name].range()[0];

			let extentPercent = [
				(extent[0] - axesScales[d.name].range()[0]) / axisLength,
				(extent[1] - axesScales[d.name].range()[0]) / axisLength
			];

			_this.filters[d.name] = extent;
			_this.filtersPercent[d.name] = extentPercent;

			_this.lines.selectAll(".dataPath")
				.style("stroke-opacity", (d) => {
					return _this.dataFilteringFunction(d) ? _this.defaultOpacity : _this.filteredItemOpacity;
				});
		}

		function brushended(d) {
			if (!d3.event.selection) {
				// clear this filter
				delete _this.filters[d.name];
				delete _this.filtersPercent[d.name];

				_this.lines.selectAll(".dataPath")
					.style("stroke-opacity", (d) => {
						return _this.dataFilteringFunction(d) ? _this.defaultOpacity : _this.filteredItemOpacity;
					});
			}

		}

		_this.dataFilteringFunction = function (d) {
			let accepted = true;

			// return the opacity of the line based on whether or not the data is filtered out
			Object.keys(_this.filters).forEach((el) => {

				if (axesScales[el](d[el]) > _this.filters[el][1] || axesScales[el](d[el]) < _this.filters[el][0]) {
					accepted = false;
				}
			});

			return accepted;
		};
	}

	function filterDataByDomains(data) {
		return data.filter((el) => {
			let inFilter = true;

			axesSpec.forEach((s) => {
				let domain = d3.extent(s.domain);

				if (s.type === "linear") {
					if (el[s.name] < domain[0] || el[s.name] > domain[1]) {
						inFilter = false;
					}
				} else if (s.type === "ordinal") {
					if (s.domain.indexOf(el[s.name]) === -1) {
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
		.style("stroke-opacity", (d) => {
			return _this.dataFilteringFunction(d) ? _this.defaultOpacity : _this.filteredItemOpacity;
		})
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
			.style("fill", "none")
			.on("mouseover", _this.onMouseOverFunc)
			.on("mouseout", _this.onMouseOutFunc);
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
  * Resize the nomogram based on either the specific size in plotSize, or target
  */
Nomogram.prototype.resize = function() {
	let width, height;

	if (!this.plotSize) {
		// get size from target element
		width = d3.select(this.plotTarget).node().clientWidth;

		// if it is an element with 0 width, give it a default width of 500
		width = width || 500;

		height = d3.select(this.plotTarget).node().clientHeight;

		// if it is an element with 0 height, give it a starting height proportial
		// to width
		height = height || width * 0.4;
	} else {
		// use specified size
		width = this.plotSize.width;
		height = this.plotSize.height;
	}

	this.svg.attr("width", width)
		.attr("height", height);

	return this;
};

/**
  * Set the data that will be used in the plots
  *
  * @param {array} data - The data to be used in the plots
  */
Nomogram.prototype.data = function(data) {
	this.plotData = data;

	return this;
};

/**
  * Set the axes of the data that will be drawn
  *
  * @param {array} [axes = null] - An array of axes to be used
	* @param {string} [axesMode = reduce] - The mode which the custom axes is using "alter" or "reduce"
	* @param {string} [shrinkMode = shrinkAxis] - The mode which the custom axes is using "shrinkAxis" or "shrinkRange"
  */
Nomogram.prototype.setAxes = function(axes, axesMode, shrinkMode) {
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

	// delete filters which aren't in the set of axes
	let newFilters = {};

	if (this.plotAxes) {
		for (let axis of this.plotAxes) {
			if (this.filters[axis.name]) {
				newFilters[axis.name] = this.filters[axis.name];
			}
		}
	}

	this.filters = newFilters;

	// "alter" changes specified axes, "reduce" only draws specified axes
	this.customAxesMode = axesMode || "reduce";
	this.rangeShrinkMode = shrinkMode || "shrinkAxis";

	return this;
};

/**
  * Set the target element which the SVG will be appended to for drawing
  *
  * @param {string} [targetID = body] - The ID of the nomogram drawing target location
  */
Nomogram.prototype.target = function(targetID) {
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
  * Set a specific size for the nomogram
  *
  * @param {object} [size] - The size of the plots
  * @param {object} size.width - The width for the plots
  * @param {object} size.height - The height for the plots
  */
Nomogram.prototype.size = function(size) {
	this.plotSize = size || null;

	return this;
};

/**
  * Set brushable flag deciding if the nomogram should be brushable or not
  *
	* @param {boolean} brushable -	true/false if the nomogram will be brushable
  */
Nomogram.prototype.brushable = function(brushable) {
	this.isBrushable = brushable;

	return this;
};

/**
  * Set a method or color value for each nomogram line based on data and
	* index of line
  *
	* @param {function} [color = "lightblue"] - Function defining how to color each line
  */
Nomogram.prototype.color = function(color) {
	this.colorFunc = color || "lightblue";

	return this;
};

/**
  * Set a method or width for each nomogram line stroke-width based on data and
	* index of line
  *
	* @param {number} [width = 1] - Value or function defining how wide each line is
  */
Nomogram.prototype.strokeWidth = function(width) {
	if (width) {
		this.strokeSize = width;
	} else {
		this.strokeSize = 1;
	}

	return this;
};

/**
  * Set a method or value for each nomogram line opacity based on data and
	* index of line
  *
	* @param {number} [opacity = 1] - Value or function [0,1] defining how opaque each line is
  */
Nomogram.prototype.opacity = function(opacity) {
	if (opacity || opacity === 0) {
		this.defaultOpacity = opacity;
	} else {
		this.defaultOpacity = 1;
	}

	return this;
};

/**
  * Set a method or value for each nomogram line opacity based on data and
	* index of line when filter is applied to lines
	* This is the opacity of lines which are outside of the filter
  *
	* @param {number} [opacity = 0.1]	- Value or function [0,1] defining how opaque each line is when filter applied
  */
Nomogram.prototype.filteredOpacity = function(opacity) {
	if (opacity || opacity === 0) {
		this.filteredItemOpacity = opacity;
	} else {
		this.filteredItemOpacity = 0.1;
	}

	return this;
};

/**
  * Set the margins around the nomogram within the drawing space
  *
	* @param {object} [margins = {top: 50, bottom: 20, left: 30, right: 30}] - Object specifying margins
  */
Nomogram.prototype.margins = function(margins) {
	if (margins) {
		this.plotMargins = margins;
	} else {
		this.plotMargins = null;
	}

	return this;
};

/**
  * Set the location of axis titles
  *
	* @param {string} [position = top] - Position of titles "top", or "bottom"
  */
Nomogram.prototype.titlePosition = function(position) {
	this.axisTitlePosition = position || "top";

	return this;
};

/**
  * Set the location of axis titles
  *
	* @param {string} preset - Choice of a preset function or custom
	* @param {function} [fnc] - Function defining behavior on "mouseover" of lines
  */
Nomogram.prototype.onMouseOver = function(preset, fnc) {

	let _this = this;

	let presetFunctions = {};

	// hide-other function
	presetFunctions["hide-other"] = function() {

		if (_this.dataFilteringFunction(d3.select(this).datum())) {
			_this.lines.selectAll(".dataPath")
				.style("stroke-opacity", d => {
					return _this.dataFilteringFunction(d) ? d3.select(this).style("stroke-opacity") * 0.25 : _this.filteredItemOpacity;
				}
				);

			d3.select(this)
				.style("stroke-opacity", 1);

		}
	};

	if (preset) {
		if (preset === "custom") {
			_this.onMouseOverFunc = fnc;
		} else {
			_this.onMouseOverFunc = presetFunctions[preset];
		}
	} else {
		_this.onMouseOverFunc = null;
	}

	return this;
};

/**
  * Set the location of axis titles
  *
	* @param {string} preset - Choice of a preset function or custom
	* @param {function} [fnc] - Function defining behavior on "mouseout" of lines
  */
Nomogram.prototype.onMouseOut = function(preset, fnc) {

	let _this = this;

	let presetFunctions = {};

	// reset-paths function
	presetFunctions["reset-paths"] = function() {
		_this.lines.selectAll(".dataPath")
			.style("stroke-linecap", "round")
			.style("stroke", _this.colorFunc)
			.style("stroke-width", _this.strokeSize)
			.style("stroke-opacity", (d) => {
				return _this.dataFilteringFunction(d) ? _this.defaultOpacity : _this.filteredItemOpacity;
			})
			.style("fill", "none");
	};

	if (preset) {
		if (preset === "custom") {
			_this.onMouseOutFunc = fnc;
		} else {
			_this.onMouseOutFunc = presetFunctions[preset];
		}
	} else {
		_this.onMouseOutFunc = null;
	}

	return this;
};

/**
  * Set the title font size for the axes
  *
	* @param {number} [size = 10] - Size of axis title font
  */
Nomogram.prototype.titleFontSize = function(size) {
	if (size) {
		this.axisTitleFontSize = size;
	} else {
		this.axisTitleFontSize = 10;
	}

	return this;
};

/**
  * Set the axis title rotation
  *
	* @param {number} [size = 10] - Size of axis title font
  */
Nomogram.prototype.titleRotation = function(theta) {
	if (theta) {
		this.axisTitleRotation = theta;
	} else {
		this.axisTitleRotation = 10;
	}

	return this;
};

/**
  * Set the tick font size for the axes
  *
	* @param {number} [size = 8] - Size of axis tick font
  */
Nomogram.prototype.tickFontSize = function(size) {
	if (size) {
		this.axisTickFontSize = size;
	} else {
		this.axisTickFontSize = 8;
	}

	return this;
};
