/**
 @version 1.0.0
 @author gangli
 @deprecated 移动端触摸事件库
 */
(function () {
    "use strict";
    var util = {
        $: function (selector) {
            return document.querySelector(selector);
        },
        getEventInfo: function (e) {
            var _e = {};
            _e.pageX = e.changedTouches[0].pageX;
            _e.pageY = e.changedTouches[0].pageY;
            _e.target = e.target;
            return _e;
        }
    };
    var _tap = function (callback) {
        this.addEventListener('touchstart', function (e) {
            var _e = util.getEventInfo(e);
            _e.type = 'tap';
            callback.call(this, _e);
        }, false);
    };
    var _longtap = function (callback) {
        var interval = 800 , s , e , timer , el;
        this.addEventListener('touchstart', function (e) {
            var _e = util.getEventInfo(e);
            el = _e.target;
            s = Date.now();
            timer = setTimeout(function () {
                _e.type = 'longtap';
                callback.call(el, _e);
            }, interval);
        }, false);
        this.addEventListener('touchend', function (e) {
            clearTimeout(timer);
        }, false);
    };
    var _swipe = function (callback) {
        var s = {}, e = {}, d = {}, distance = 50,
            angle = 0,
            type;
        this.addEventListener('touchstart', function (evt) {
            var _e = util.getEventInfo(evt);
            s.x = _e.pageX;
            s.y = _e.pageY;
            evt.preventDefault();
        }, false);
        this.addEventListener('touchend', function (evt) {
            var _e = util.getEventInfo(evt);
            e.x = _e.pageX;
            e.y = _e.pageY;
            d.x = e.x - s.x;
            d.y = e.y - s.y;
            if (Math.abs(d.x) < distance && Math.abs(d.y) < distance) return false;
            angle = Math.abs(Math.atan((e.y - s.y) / (e.x - s.x)) / Math.PI * 180);
            if (angle > 45) {
                type = d.y < 0 ? 'swipe-up' : 'swipe-down';
            } else {
                type = d.x < 0 ? 'swipe-left' : 'swipe-right';
            }
            callback.call(this, {
                type: type,
                start: s,
                end: e,
                distance: d,
                target: _e.target
            });
            evt.preventDefault();
        }, false);
    }
    var _drag = function (callback) {
        var dragStart = false, s = {}, e = {}, o = {};
        this.addEventListener('touchstart', function (evt) {
            dragStart = true;
            var _e = util.getEventInfo(evt);
            s.x = _e.pageX;
            s.y = _e.pageY;
            evt.preventDefault();
        }, false);
        this.addEventListener('touchmove', function (evt) {
            if (!dragStart) return;
            var _e = util.getEventInfo(evt);
            o.x = _e.pageX - s.x;
            o.y = _e.pageY - s.y;
            callback.call(this, {
                type: "drag-move",
                start: s,
                offset: o,
                target: _e.target
            });
        }, false);
        this.addEventListener('touchend', function (evt) {
            dragStart = false;
            var _e = util.getEventInfo(evt);
            e.x = _e.pageX;
            e.y = _e.pageY;
            callback.call(this, {
                type: "drag-end",
                start: s,
                offset: o,
                end: e,
                target: _e.target
            });
        }, false);
    }
    var eventMap = {
        tap: _tap,
        swipe: _swipe,
        longtap: _longtap,
        drag: _drag
    }
    var ktouch = {
        ver: '1.0.0',
        on: function (el, type, fn) {
            try {
                var el = util.$(el);
                eventMap[type].call(el, fn);
                return this;
            } catch (e) {
                console.error('type error : %s is not allowed', type);
            }
        }
    }
    window.ktouch = ktouch;
})();
