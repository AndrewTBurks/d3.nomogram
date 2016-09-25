## Classes

<dl>
<dt><a href="#VersatilePCP">VersatilePCP</a></dt>
<dd><p>VersatilePCP</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#draw">draw()</a></dt>
<dd><p>Draw the parallel coordinate plots</p>
</dd>
<dt><a href="#data">data(data)</a></dt>
<dd><p>Set the data that will be used in the plots</p>
</dd>
<dt><a href="#setAxes">setAxes([axes], [mode])</a></dt>
<dd><p>Set the axes of the data that will be drawn</p>
</dd>
<dt><a href="#target">target([targetID])</a></dt>
<dd><p>Set the target element which the SVG will be appended to for drawing</p>
</dd>
<dt><a href="#size">size([size])</a></dt>
<dd><p>Set a specific size for the pcp</p>
</dd>
<dt><a href="#brushable">brushable(brushable)</a></dt>
<dd><p>Set brushable flag deciding if the pcp should be brushable or not</p>
</dd>
<dt><a href="#color">color([color])</a></dt>
<dd><p>Set a method or color value for each pcp line based on data and
index of line</p>
</dd>
<dt><a href="#strokeWidth">strokeWidth([width])</a></dt>
<dd><p>Set a method or width for each pcp line stroke-width based on data and
index of line</p>
</dd>
<dt><a href="#opacity">opacity([opacity])</a></dt>
<dd><p>Set a method or value for each pcp line opacity based on data and
index of line</p>
</dd>
<dt><a href="#filteredOpacity">filteredOpacity([opacity])</a></dt>
<dd><p>Set a method or value for each pcp line opacity based on data and
index of line when filter is applied to lines
This is the opacity of lines which are outside of the filter</p>
</dd>
</dl>

<a name="VersatilePCP"></a>

## VersatilePCP
VersatilePCP

**Kind**: global class  
<a name="draw"></a>

## draw()
Draw the parallel coordinate plots

**Kind**: global function  
<a name="data"></a>

## data(data)
Set the data that will be used in the plots

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | The data to be used in the plots |

<a name="setAxes"></a>

## setAxes([axes], [mode])
Set the axes of the data that will be drawn

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [axes] | <code>array</code> | <code></code> | An array of axes to be used |
| [mode] | <code>string</code> | <code>&quot;reduce&quot;</code> | The mode which the custom axes is using "alter" or "reduce" |

<a name="target"></a>

## target([targetID])
Set the target element which the SVG will be appended to for drawing

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [targetID] | <code>string</code> | <code>&quot;body&quot;</code> | The ID of the pcp drawing target location |

<a name="size"></a>

## size([size])
Set a specific size for the pcp

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [size] | <code>object</code> | The size of the plots |
| size.width | <code>object</code> | The width for the plots |
| size.height | <code>object</code> | The height for the plots |

<a name="brushable"></a>

## brushable(brushable)
Set brushable flag deciding if the pcp should be brushable or not

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| brushable | <code>boolean</code> | true/false if the pcp will be brushable |

<a name="color"></a>

## color([color])
Set a method or color value for each pcp line based on data andindex of line

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [color] | <code>function</code> | <code>&quot;lightblue&quot;</code> | Function defining how to color each line |

<a name="strokeWidth"></a>

## strokeWidth([width])
Set a method or width for each pcp line stroke-width based on data andindex of line

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [width] | <code>number</code> | <code>1</code> | Value or function defining how wide each line is |

<a name="opacity"></a>

## opacity([opacity])
Set a method or value for each pcp line opacity based on data andindex of line

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>1</code> | Value or function [0,1] defining how opaque each line is |

<a name="filteredOpacity"></a>

## filteredOpacity([opacity])
Set a method or value for each pcp line opacity based on data andindex of line when filter is applied to linesThis is the opacity of lines which are outside of the filter

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>0.1</code> | Value or function [0,1] defining how opaque each line is when filter applied |

