// UMD support
;
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        root.Requester = factory(root.$);
    }
}(this, function($) {
    'use strict';
    // IE6 support
    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function(item) {
            for (var i = this.length - 1; i >= 0; i--) {
                if (this[i] === item) {
                    return i;
                }
            }
        }
    }
    // detection IE6
    function IETest(version) {
        var b = document.createElement('b');
        b.innerHTML = '<!--[if IE ' + version + ']><i></i><![endif]-->';
        return b.getElementsByTagName('i').length === 1;
    }
    /**
     * iElevator constructor
     * @param {object} options  configuration
     * @param {DOM}    element  DOM node
     */
    function iElevator(options, element) {
        // cache for context
        this.element = $(element);
        this.namespace = 'iElevator';

        // defaults
        var _defaults = {
                floors: null,
                btns: null,
                backtop: null,
                selected: '',
                sticky: -1,
                visible: {
                    isHide: 'no',
                    numShow: 0
                },
                speed: 400,
                show: function(me) {
                    me.element.show();
                },
                hide: function(me) {
                    me.element.hide();
                }
            },
            meta = this.element.data('ielevator-options') || {};
        // configurations extended,  priority: _defaults < options < meta
        this.settings = $.extend({}, _defaults, options, meta);
        this.init(options);
    }

    iElevator.prototype = (function() {
        // caching scrollTop(value) of each module
        var _scrollTopArr = [],
            _STARR,
            _refArr;

        /**
         * lazy definition visible
         * @private _visible
         */
        var _visible = function(_sTop) {
                var _parent = _getSettings.call(this, 'visible'),
                    _isHide = _parent.isHide.toLowerCase(),
                    _numShow = _parent.numShow;
                if (_isHide === 'yes') {
                    this.element.hide();
                    this.numShow = _numShow;
                } else {
                    _numShow = 0;
                }
                _visible = function(_sTop) {
                    if (_sTop >= _numShow) {
                        _ielevatorShow.call(this);
                    } else {
                        _ielevatorHide.call(this);
                    }
                }
            },
            _supportIE6 = (function () {
                if(IETest(6)){
                  // Anti-shake
                  $('html').css({
                    "backgroundImage": "url(about:blank)",
                    "backgroundAttachment": "fixed"
                  });
                  return function (_sTop, _currentTop) {
                    if(this.element[0].currentStyle.position === 'fixed'){
                      this.element.css('position', 'absolute');
                    }
                    this.element.css('top', parseInt(_sTop, 10)  + _currentTop + 'px');
                    _supportIE6 = function (_sTop, _currentTop) {
                        this.element.css('top', parseInt(_sTop, 10)  + _currentTop + 'px');
                    }
                  }
                }
            })();

        function _initPattern(options) {
            var _patternFields = {
                floors: ('floors' in options),
                btns: ('btns' in options),
                backtop: ('backtop' in options)
            };

            if (_patternFields.floors) {
                this.floors = _getSettings.call(this, 'floors');
                this.floors.each(function() {
                    _scrollTopArr.push($(this).offset().top | 0);
                });
                this.btns = _patternFields.btns ? _getSettings.call(this, 'btns') : null;
            }

            if (_patternFields.backtop) {
                this.backtop = _getSettings.call(this, 'backtop');
                // _scrollTopArr.push(0);
            }

            if (this.btns) {
                if (this.backtop) {
                    _refArr = this.btns.add(this.backtop);
                } else {
                    _refArr = this.btns;
                }
            } else {
                _refArr = this.backtop;
            }

            _STARR = _scrollTopArr.slice();
            _STARR.push(0);

            // support 3 patterns
            if (!(_patternFields.floors && _patternFields.btns && _patternFields.backtop) && !(_patternFields.floors && _patternFields.btns) && !(_patternFields.backtop)) {
                $.error('you provide at least one of "cBacktop" , "cFloors + cBtns" or "cFloors + cBtns + cBacktop"')
            }
        }
        // automatically load css script
        function _loadStyleString(css) {
            var _style = document.createElement('style'),
                _head = document.getElementsByTagName('head')[0];
            _style.type = 'text/css';
            try{
                _style.appendChild(document.createTextNode(css));
            } catch (ex) {
                // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
                _style.styleSheet.cssText = css;
            }
            _head.appendChild(_style);
            return _style;
        }
        // sticky position
        var _setSticky = function(_sTop) {
            var _fixedTop = +_getSettings.call(this, 'sticky'),
                _currentTop = this.element.offset().top,
                _CSSSTR = '.fixed{position: fixed; top: ' + _fixedTop + 'px;}';
            if (_fixedTop < 0) return;
            _loadStyleString(_CSSSTR);
            if (_sTop - _fixedTop > _currentTop) {
                this.element.addClass('fixed');
            } else {
                this.element.removeClass('fixed');
            }

            _setSticky = function(_sTop) {
                if (_sTop + _fixedTop > _currentTop) {
                    this.element.addClass('fixed');
                } else {
                    this.element.removeClass('fixed');
                }
            }
        }

        function _getSettings(key) {
            // to verify whether settings contains key or not
            if (key in this.settings) {
                var _value = this.settings[key],
                    requiredKey = {
                        cFloors: true,
                        cBtns: true,
                        cBacktop: true
                    };
                if (!_value && requiredKey[key]) {
                    $.error('the "' + key + '" is required, not ' + _value);
                } else {
                    return _value;
                }
            } else {
                $.error('the settings contains no such "' + key + '"option!');
            }
        }

        function _ielevatorShow() {
            _getSettings.call(this, 'show')(this);
        }

        function _ielevatorHide() {
            _getSettings.call(this, 'hide')(this);
        }

        function _getLocation(num) {
            var _num = parseInt(num, 10),
                _index = _scrollTopArr.indexOf(_num);
            if (_index > -1) {
                return _index;
            }
            _scrollTopArr.push(_num);
            _scrollTopArr.sort(function(A, B) {
                return A - B;
            });
            _index = _scrollTopArr.indexOf(_num);
            _scrollTopArr.splice(_index, 1);
            return (_index - 1);
        }

        function _setLocation(index, _speed) {
            if (index === -1) {
                return;
            }
            // $(window).scrollTop(_scrollTopsP[index]);
            $('html, body').animate({
                scrollTop: _STARR[index]
            }, _speed);
        }

        function _setBtns(index) {
            var _selected = _getSettings.call(this, 'selected');
            // this.btns && this.btns.removeClass(_selected).eq(index).addClass(_selected);
            _refArr && _refArr.removeClass(_selected).eq(index).addClass(_selected);
        }
        // update functionality from _setBtns to _setSelected
        function _setSelected(index) {
            // _selected : [String] represents a class name; $selected: [jQuery Object] represents a jQuery Object
            var _temp = _getSettings.call(this, 'selected'),
                _selected, 
                $selected;
                
            if(!_temp) return;
            typeof _temp === 'string' ? _selected =  _temp : $selected = _temp;
            _selected && _refArr && _refArr.removeClass(_selected).eq(index).addClass(_selected);
            
            if ($selected) {
                var _top = _refArr.eq(index).position().top,
                    _height = _refArr.eq(index).height();
                if(index < 0) return;
                // $selected.animate({'top': _top + 'px'}); //there is costly network latency, suggest using CSS3 transition to implement
                $selected.css({'top': _top + 'px', 'height': _height + 'px'});
            }
        }

        function _bindEvents() {
            var _me = this,
                _speed = _getSettings.call(this, 'speed'),
                // _currentTop = this.element.offset().top,
                _len = _STARR.length;
            _refArr.on('click.' + this.namespace, function(e) {
                var _index = _refArr.index($(this));
                _setLocation.call(_me, _index, _speed);
            });

            $(window).on('scroll.' + this.namespace, function() {
                var _sTop = $(this).scrollTop();
                var _index = _getLocation.call(_me, _sTop);
                _supportIE6 && _supportIE6.call(_me, _sTop, _me.numShow);
                _visible.call(_me, _sTop);
                _setSelected.call(_me, _index);
                _setSticky.call(_me, _sTop);
            });
        }

        function _unbindEvents() {
            this.element.off('.' + this.namespace);
            $(window).off('.' + this.namespace);
        }

        function _destory() {
            _unbindEvents.call(this);
            // clear cache data
            $.removeData(this);
        }

        function _init(options) {
            _initPattern.call(this, options);
            _visible.call(this);
            _bindEvents.call(this);
        }

        return {
            // ensure constructor point to iElevator(constuctor === iElevator)
            constructor: iElevator,
            init: function(options) {
                this._(_init)(options);
            },
            destory: function() {
                console.log('destory');
                this._(_destory)();
            },
            getSettings: function(key) {
                return this._(_getSettings)(key);
            },
            _: function(callback) {
                //cache this
                var self = this;
                return function( /*argument*/ ) {
                    return callback.apply(self, arguments);
                }
            }
        }

    })();

    $.fn.ielevator = function(options) {
        var PLUGIN_NS = "ielevatorPlugin",
            args,
            returnVal;

        if (typeof options === 'string') {
            args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var pluginInstance = $.data(this, PLUGIN_NS);

                if (!pluginInstance) {
                    $.error("The plugin has not been initialised yet when you tried to call this method: " + options);
                    return;
                }
                if (!$.isFunction(pluginInstance[options])) {
                    $.error("The plugin contains no such method: " + options);
                    return;
                } else {
                    returnVal = pluginInstance[options].apply(pluginInstance, args);
                }
            });
            if (returnVal !== undefined) {
                // If the method returned a value, return the value.
                return returnVal;
            } else {
                // Otherwise, returning 'this' preserves chainability.
                return this;
            }

        } else {
            return this.each(function() {

                var pluginInstance = $.data(this, PLUGIN_NS);
                if (pluginInstance) {
                    pluginInstance.option(options);
                } else {
                    $.data(this, PLUGIN_NS, new iElevator(options, this));
                }
            });
        }
    };
}));
