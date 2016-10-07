<a name="Nomogram"></a>

## Nomogram
Nomogram

**Kind**: global class  

* [Nomogram](#Nomogram)
    * [.draw()](#Nomogram+draw)
    * [.data(data)](#Nomogram+data)
    * [.setAxes([axes], [axesMode], [shrinkMode])](#Nomogram+setAxes)
    * [.target([targetID])](#Nomogram+target)
    * [.size([size])](#Nomogram+size)
    * [.brushable(brushable)](#Nomogram+brushable)
    * [.color([color])](#Nomogram+color)
    * [.strokeWidth([width])](#Nomogram+strokeWidth)
    * [.opacity([opacity])](#Nomogram+opacity)
    * [.filteredOpacity([opacity])](#Nomogram+filteredOpacity)
    * [.margins([margins])](#Nomogram+margins)
    * [.titlePosition([position])](#Nomogram+titlePosition)

<a name="Nomogram+draw"></a>

### nomogram.draw()
Draw the nomogram

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  
<a name="Nomogram+data"></a>

### nomogram.data(data)
Set the data that will be used in the plots

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | The data to be used in the plots |

<a name="Nomogram+setAxes"></a>

### nomogram.setAxes([axes], [axesMode], [shrinkMode])
Set the axes of the data that will be drawn

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [axes] | <code>array</code> | <code></code> | An array of axes to be used |
| [axesMode] | <code>string</code> | <code>&quot;reduce&quot;</code> | The mode which the custom axes is using "alter" or "reduce" |
| [shrinkMode] | <code>string</code> | <code>&quot;shrinkAxis&quot;</code> | The mode which the custom axes is using "shrinkAxis" or "shrinkRange" |

<a name="Nomogram+target"></a>

### nomogram.target([targetID])
Set the target element which the SVG will be appended to for drawing

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [targetID] | <code>string</code> | <code>&quot;body&quot;</code> | The ID of the nomogram drawing target location |

<a name="Nomogram+size"></a>

### nomogram.size([size])
Set a specific size for the nomogram

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [size] | <code>object</code> | The size of the plots |
| size.width | <code>object</code> | The width for the plots |
| size.height | <code>object</code> | The height for the plots |

<a name="Nomogram+brushable"></a>

### nomogram.brushable(brushable)
Set brushable flag deciding if the nomogram should be brushable or not

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Description |
| --- | --- | --- |
| brushable | <code>boolean</code> | true/false if the nomogram will be brushable |

<a name="Nomogram+color"></a>

### nomogram.color([color])
Set a method or color value for each nomogram line based on data and
index of line

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [color] | <code>function</code> | <code>&quot;lightblue&quot;</code> | Function defining how to color each line |

<a name="Nomogram+strokeWidth"></a>

### nomogram.strokeWidth([width])
Set a method or width for each nomogram line stroke-width based on data and
index of line

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [width] | <code>number</code> | <code>1</code> | Value or function defining how wide each line is |

<a name="Nomogram+opacity"></a>

### nomogram.opacity([opacity])
Set a method or value for each nomogram line opacity based on data and
index of line

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>1</code> | Value or function [0,1] defining how opaque each line is |

<a name="Nomogram+filteredOpacity"></a>

### nomogram.filteredOpacity([opacity])
Set a method or value for each nomogram line opacity based on data and
index of line when filter is applied to lines
This is the opacity of lines which are outside of the filter

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>0.1</code> | Value or function [0,1] defining how opaque each line is when filter applied |

<a name="Nomogram+margins"></a>

### nomogram.margins([margins])
Set the margins around the nomogram within the drawing space

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [margins] | <code>object</code> | <code>{top: 50, bottom: 20, left: 30, right: 30}</code> | Object specifying margins |

<a name="Nomogram+titlePosition"></a>

### nomogram.titlePosition([position])
Set the location of axis titles

**Kind**: instance method of <code>[Nomogram](#Nomogram)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [position] | <code>string</code> | <code>&quot;top&quot;</code> | Position of titles "top", or "bottom" |

