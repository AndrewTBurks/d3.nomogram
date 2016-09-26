<a name="VersatilePCP"></a>

## VersatilePCP
VersatilePCP

**Kind**: global class  

* [VersatilePCP](#VersatilePCP)
    * [.draw()](#VersatilePCP+draw)
    * [.data(data)](#VersatilePCP+data)
    * [.setAxes([axes], [mode])](#VersatilePCP+setAxes)
    * [.target([targetID])](#VersatilePCP+target)
    * [.size([size])](#VersatilePCP+size)
    * [.brushable(brushable)](#VersatilePCP+brushable)
    * [.color([color])](#VersatilePCP+color)
    * [.strokeWidth([width])](#VersatilePCP+strokeWidth)
    * [.opacity([opacity])](#VersatilePCP+opacity)
    * [.filteredOpacity([opacity])](#VersatilePCP+filteredOpacity)

<a name="VersatilePCP+draw"></a>

### versatilePCP.draw()
Draw the parallel coordinate plots

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  
<a name="VersatilePCP+data"></a>

### versatilePCP.data(data)
Set the data that will be used in the plots

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>array</code> | The data to be used in the plots |

<a name="VersatilePCP+setAxes"></a>

### versatilePCP.setAxes([axes], [mode])
Set the axes of the data that will be drawn

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [axes] | <code>array</code> | <code></code> | An array of axes to be used |
| [mode] | <code>string</code> | <code>&quot;reduce&quot;</code> | The mode which the custom axes is using "alter" or "reduce" |

<a name="VersatilePCP+target"></a>

### versatilePCP.target([targetID])
Set the target element which the SVG will be appended to for drawing

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [targetID] | <code>string</code> | <code>&quot;body&quot;</code> | The ID of the pcp drawing target location |

<a name="VersatilePCP+size"></a>

### versatilePCP.size([size])
Set a specific size for the pcp

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [size] | <code>object</code> | The size of the plots |
| size.width | <code>object</code> | The width for the plots |
| size.height | <code>object</code> | The height for the plots |

<a name="VersatilePCP+brushable"></a>

### versatilePCP.brushable(brushable)
Set brushable flag deciding if the pcp should be brushable or not

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Description |
| --- | --- | --- |
| brushable | <code>boolean</code> | true/false if the pcp will be brushable |

<a name="VersatilePCP+color"></a>

### versatilePCP.color([color])
Set a method or color value for each pcp line based on data and
index of line

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [color] | <code>function</code> | <code>&quot;lightblue&quot;</code> | Function defining how to color each line |

<a name="VersatilePCP+strokeWidth"></a>

### versatilePCP.strokeWidth([width])
Set a method or width for each pcp line stroke-width based on data and
index of line

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [width] | <code>number</code> | <code>1</code> | Value or function defining how wide each line is |

<a name="VersatilePCP+opacity"></a>

### versatilePCP.opacity([opacity])
Set a method or value for each pcp line opacity based on data and
index of line

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>1</code> | Value or function [0,1] defining how opaque each line is |

<a name="VersatilePCP+filteredOpacity"></a>

### versatilePCP.filteredOpacity([opacity])
Set a method or value for each pcp line opacity based on data and
index of line when filter is applied to lines
This is the opacity of lines which are outside of the filter

**Kind**: instance method of <code>[VersatilePCP](#VersatilePCP)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>0.1</code> | Value or function [0,1] defining how opaque each line is when filter applied |

