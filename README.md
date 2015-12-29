# iElevator.js
[![npm version](https://badge.fury.io/js/ielevator.svg)](https://badge.fury.io/js/ielevator)
[![Bower version](https://badge.fury.io/bo/ielevator.svg)](https://badge.fury.io/bo/ielevator)

this is a jQuery plugin for elevator, lightweight, easy to use and with some extra features
## install
`npm install ielevator` or `bower install ielevator`
## Features
- **UMD** support(AMD, CMD, Globals)
- Flexible HTML structure
- Provide several method of configuration
- Compatible with **IE6+**, **Chrome**, **Firefox**, **Safari**
- Extra functions

## Dependencies
this is a **jQuery** plugin, So jQuery is required,

### configuration
In order to ensure the plugin work normally, you provide at least one of `“cBacktop”` , `"cFloors + cBtns"` or `"cFloors + cBtns + cBacktop"`
### Default Options
```javascript
_defaults = {
    floors: null,
    btns: null,
    backtop: null,
    selected: '',
    visible: {isHide: 'no', numShow: 0},
    speed: 400,
    show: function (me) {
    	me.element.show();
    },
    hide: function (me) {
    	me.element.hide();
    }
  }
```
##### 'floors' option
- (selector)select all elements with the given class, each represents a floor module. the default is null.
```javascript
	$('#elevator').({
  	floors: $('js-floor')
  });
```

##### 'btns' option
- (selector)select all elements with the given class, each represents a focus button. the default is null.
```javascript
	$('#elevator').({
  	floors: $('js-btn')
  });
```

##### 'backtop' option
- (selector)select all elements with the given class, each represents back-to-top button. thed default is null.
```javascript
	$('#elevator').({
  	floors: $('js-backtop')
  });
```

##### 'selected' option
- (css)selected refers to style of **[btns option]** selected or hover,
```javascript
	$('#elevator').({
		selected: '',
  });
```

##### 'visible' option
- control **elevator** visibility, and contain isHide, numShow properties
- isHide: `yes`|`no`. 
if yes, elevator is visible on initialization, and vice versa. ***NOTE:*** if no,however set any value to numShow, numShow doesn't make sense.
- numShow:`Number`. 
when scrollTop is greater than number, elevator will be visible. and vice versa
```javascript
	$('#elevator').({
    visible: {isHide: 'no', numShow: 0}
  });
```

##### 'speed' option
- control the speed of slider bar of window
```javascript
	$('#elevator').({
 		speed: 400
  });
```

##### 'show' option
- override show function
```javascript
    show: function (me) {
    	me.element.show();
    },
```

##### 'hide' option
- override hide function
```javascript
hide: function (me) {
  me.element.hide();
}
```

## Usage
it is easy to use, only you ovrride default options to meet your requirements what you want. the following three example to illustrate the plugin how to use.
#### 1. back to top
#####-------------------------------------------------------------------------------**[Refer to expample](http://zhansingsong.github.io/back2top)**
HTML structure:
```javascript
    <div class="elevator elevator-backtop" id="backtop" >
        <a href="javascript:;" class="js-backtop">TOP</a>
    </div>
```
Javascript:
```javascript
    $('#backtop').ielevator({
        backtop: $('#backtop .js-backtop')
    });
```
the example is very easy, only to get the "back to top" reference, and then [back to top] works

#### 2. simulate elelvator
#####-------------------------------------------------------------------------------**[Refer to expample](http://zhansingsong.github.io/iElevator)**
HTML structure:  

```javascript
    <div class="elevator" id="elevator" data-elevator-options='{"selected": "custome-selected"}'>
        <ul>
            <li><a href="javascript:;" class="custome-selected js-btn">floor1</a></li>
            <li><a href="javascript:;" class="js-btn">floor2</a></li>
            <li><a href="javascript:;" class="js-btn">floor3</a></li>
            <li><a href="javascript:;" class="js-btn">floor4</a></li>
            <li><a href="javascript:;" class="js-btn">floor5</a></li>
            <li><a href="javascript:;" class="js-btn">floor6</a></li>
            <li><a href="javascript:;" class="js-btn">floor7</a></li>
        </ul>
    </div>
```
Javascript:
```javascript
    $('#elevator').ielevator({
        floors: $('.js-floor'),
        btns: $('#elevator .js-btn'),
        selected: 'selected',
        visible: {isHide: 'yes', numShow: 400},
        show: function() {
            $('#elevator').slideDown(400);
        },
        hide: function() {
            $('#elevator').slideUp(400);
        }
    });
```
##### <font color=#d22> NOTE: **`data-ielevator-options='{"selected": "custome-selected"}'`** is the highest priority. therefore, `'custome-selected'` will overwrite `'selected' in configuration object` </font>
#### 3. simulate elevator + back to top
#####-------------------------------------------------------------------------------**[Refer to expample](http://zhansingsong.github.io/iElevator-back2top)**
HTML structure:
```javascript
    <div class="elevator" id="elevator" data-elevator-options=''>
        <ul>
            <li><a href="javascript:;" class="custome-selected js-btn">floor1</a></li>
            <li><a href="javascript:;" class="js-btn">floor2</a></li>
            <li><a href="javascript:;" class="js-btn">floor3</a></li>
            <li><a href="javascript:;" class="js-btn">floor4</a></li>
            <li><a href="javascript:;" class="js-btn">floor5</a></li>
            <li><a href="javascript:;" class="js-btn">floor6</a></li>
            <li><a href="javascript:;" class="js-btn">floor7</a></li>
            <li><a href="javascript:;" class="js-backtop">TOP</a></li>
        </ul>
    </div>
```
Javascript:
```javascript
    $('#elevator').ielevator({
        floors: $('.js-floor'),
        btns: $('#elevator .js-btn'),
        backtop: $('#elevator .js-backtop'),
        selected: 'selected',
        visible: {isHide: 'yes', numShow: 400},
        show: function() {
            $('#elevator').slideDown(400);
        },
        hide: function() {
            $('#elevator').slideUp(400);
        }
    });
```
#### 4. require.js example
##### [demo_AMD](http://zhansingsong.github.io/demo_AMD)



## License
iElevator.js is covered by the **MIT** License.
