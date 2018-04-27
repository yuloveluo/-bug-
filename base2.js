//封装一个对象
var $ = function (args) {
	return new Base(args);
}

//基础库
function Base (args) {
	//创建一个数组，存放节点和节点组
    this.elements = [];
    if (typeof args == 'string') {
    	var elements = args.split(' ');
    	var node = [];
    	var childElemments = []
    	if (node.length == 0) node.push(document);
    	for (var i = 0; i < elements.length ; i ++) {
    		switch (elements[i].charAt(0)) {
    			case '#' :
					childElemments = [];
					childElemments.push(this.getId(elements[i].substring(1)));
					node = childElemments;
					break;
				case '.' :
					childElemments = [];
					for (var j = 0; j < node.length; j ++) {
						var temps = this.getClass(elements[i].substring(1) , node[j]);
						for (var k = 0; k < temps.length ; k ++) {
							childElemments.push(temps[k]);
						}
					}
					node = childElemments;
					break;
				default :
					childElemments = [];
					for (var j = 0; j < node.length; j ++) {
						var temps = this.getTagName(elements[i] , node[j]);
						for (var k = 0; k < temps.length ; k ++) {
							childElemments.push(temps[k]);
						}
					}
					node = childElemments;
    		}
    	} 
    	this.elements = childElemments;
    } else if (typeof args == 'object') {
    	if (args != undefined) {
    		this.elements[0] = args;
    	}
    } else if (typeof args == 'function') {
    	this.ready(args);
    }
    return this; 
}

//设置DOM加载方法
Base.prototype.ready = function (fn) {
	addDomLoaded(fn);
}

//获取ID节点
Base.prototype.getId = function (id) {
	return document.getElementById(id);
};

//获取标签节点组
Base.prototype.getTagName = function (tag , parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for (var i = 0; i < tags.length ; i ++) {
		temps.push(tags[i]);
	}
	return temps;
};

//获取节点className的节点组
Base.prototype.getClass = function (className , parentNode) {
	var node = null;
    var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}

	var all = node.getElementsByTagName('*');
	for (var i = 0; i < all.length ; i ++) {
		if (all[i].className == className) {
			temps.push(all[i]);
		}
	}
	return temps;
};

//获取单个的元素节点，并返回这个节点
Base.prototype.ge = function (num) {
    return this.elements[num];
	
};

//获取该首个节点，并返回节点对象
Base.prototype.first = function () {
	return this.elements[0];
}

//获取该最后一个节点，并返回节点对象
Base.prototype.first = function () {
	return this.elements[this.elements.length - 1];
}

//获取某一个节点，并返回base
Base.prototype.eq = function (num) {
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
}

//获取和设置元素的html节点
Base.prototype.html = function (str) {
	for (var i = 0; i < this.elements.length ; i ++) {
		if (typeof str == 'undefined') {
			return this.elements[i].innerHTML;
		} else {
			this.elements[i].innerHTML = str;
		}
	}
	return this;
};

//获取和设置元素的css
Base.prototype.css = function (attr , value) {
	for (var i = 0; i < this.elements.length ; i ++) {
		 if (arguments.length == 1) {
		 	return getStyle(this.element[i] , attr);
		 } 
		this.elements[i].style[attr] = value;
	}
	return this;
};


//设置点击事件

Base.prototype.click = function (fn) {
	for (var i = 0; i < this.elements.length ; i ++) {
		 this.elements[i].onclick = fn;
	}
	return this;
};

//创建className
Base.prototype.addClass = function (className) {
	for (var i = 0; i < this.elements.length ; i ++) {
		if (!this.elements[i].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
			this.elements[i].className += ' ' +className;
		}
	}
	return this;
};

//移除className
Base.prototype.removeClass = function (className) {
	for (var i = 0; i < this.elements.length ; i ++) {
		if (this.elements[i].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)') , '');
		}
	}
	return this;
};

//跨平台获取style，并且转化为数值
function getStyle (element , attr) {
	var value;
	if (typeof window.getComputedStyle != 'undefined') {
		value = window.getComputedStyle(element , null)[attr];
	} else if (typeof element.currentStyle != 'undefined') { //ie
		value = element.currentStyle[attr];
 	} 
 	return value;
}

//封装隐藏
Base.prototype.hide = function () {
	for (var i = 0; i < this.elements.length ; i ++) {
		this.elements[i].style.display = 'none';
	}
	return this;
};

//设置显示
Base.prototype.show = function () {
	for (var i = 0; i < this.elements.length ; i ++) {
		this.elements[i].style.display = 'block';
	}
	return this;
}


//设置鼠标移动隐藏和显示
Base.prototype.hover = function (over , out) {
	for (var i = 0; i < this.elements.length ; i ++) {
		addEvent(this.elements[i] , 'mouseover' , over);
		addEvent(this.elements[i] , 'mouseout' , out);
	}
	return this;
};

//设置物体的水平垂直中心
Base.prototype.center = function (width , height) {
	for (var i = 0; i < this.elements.length ; i ++) {
		this.elements[i].style.top = (getInner().height - height) / 2 +'px'; 
		this.elements[i].style.left = (getInner().width - width) / 2 +'px';
	}
	return this;
};

//物体随可视框的变动而变动
Base.prototype.resize = function (fn) {
	for (var i = 0; i < this.elements.length ; i ++) {
		var element = this.elements[i];
		addEvent(window , 'resize' , function () {
			fn();	
			if (element.offsetLeft > getInner().width - element.offsetWidth) {
				element.style.left = getInner().width - element.offsetWidth + 'px';
			}

			if (element.offsetTop > getInner().height - element.offsetHeight) {
				element.style.top = getInner().height - element.offsetHeight + 'px';
			}
		});
	}
	return this;
}

//封装一个浏览器可视窗口大小
function getInner () {
	if (window.innerWidth) { //兼容低配版火狐
		return {
			width : window.innerWidth ,
			height : window.innerHeight
		}
	} else {
		return {
			width : document.documentElement.clientWidth , 
			height : document.documentElement.clientHeight
		}
	}
}

//封装弹出框锁屏功能
Base.prototype.lock = function () {
	for (var i = 0; i < this.elements.length ; i ++) {
		this.elements[i].style.width = getInner().width + 'px';
		this.elements[i].style.height = getInner().height + 'px';
		this.elements[i].style.display = 'block';
		document.documentElement.style.overflow = 'hidden';

		//防止其他方式移动滚动条
		addEvent(window , 'scroll' , scr);
	}
	return this;
};

// 防止其他方式滚动条函数
function scr () {
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}

//删除锁屏功能
Base.prototype.unlock = function () {
	for (var i = 0; i < this.elements.length ; i ++) {
		this.elements[i].style.display = 'none';
		document.documentElement.style.overflow = 'auto';

		//删除锁屏同时让滚动条可以移动
		removeEvent(window , 'scroll' , scr);
	}
	return this;
}

//插件入口
Base.prototype.extend = function (name , fn) {
	Base.prototype[name] = fn;
};

//去除空格
function trim (str) {
	return str.replace(/(^\s *) | (\s * $)/g , '');
};

//事件绑定
function addEvent (obj , type , fn) {
	if (typeof obj.addEventListener != 'undefined') {
		//wsc现代事件绑定
		obj.addEventListener(type , fn , false);
	} else {
		//第一次执行 并且按照js一切皆为对象
		//放置事件的对象
		if (! obj.events) obj.events = {};
		//放置事件处理函数的对象
		if (! obj.events[type]) {
			obj.events[type] = fn;
			//减少函数执行次数
			if (obj['on' + type]) {
				obj.events[type][0] = fn;
			}
		} else {
			if (addEvent.arry(obj.events[type] , fn)) {
				return false;
			}
		}
		
		
		//第二次开始添加事件处理函数
		obj.events[type][addEvent.ID ++] = fn;
		//触发事件处理函数
		obj['on' + type] = addEvent.exec;
	}
}
//给每个事件添加一个计时器
addEvent.ID = 1

//触发事件函数的对象
addEvent.exec = function (e) {
	var e = e || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for (var i in es) {
		es[i].call(this , e);
	}
}

//是否为同一函数 是的话就屏蔽掉
addEvent.arry = function (es , fn) {
	for (var i in es) {
		if (es[i] == fn) return true;		
	}
	return false;
}

//兼容默认行为和冒泡行为
addEvent.fixEvent = function (event) {
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopProtagation = addEvent.fixEvent.stopProtagation;
	event.target = event.srcElement;
	return event;
}

//ie阻止默认
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
}

//ie阻止冒泡
addEvent.fixEvent.stopProtagation = function () {
	this.cancelBubble = true;
}

//跨浏览器删除事件
function removeEvent (obj , type , fn) {
	if(typeof removeEventListener != 'undefined') {
		obj.removeEventListener(type , fn);
	} else {
		var es = obj.events[type];
		for (var i in es) {
			if (es[i] = fn) {
				delete obj.events[type][i];
			}
		}
	}
}

//浏览器检测
(function () {
	window.sys = {}; //可以让外部访问，保持浏览器信息对象
	var ua = navigator.userAgent.toLowerCase(); //获取浏览器信息字符串
	var s; //保存浏览器的版本号

	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] : 
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
	(s = ua.mach(/opera.*version\/([\d.]+)/)) ? sys.opera = s[1] :
	(s = ua.mach(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

	if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1]
})()

//DOM加载
function addDomLoaded (fn) {
	var isReady = false;
	var timer = null;
	function doReady () {
		if (isReady) return;
		isReady = true;
		if (timer) clearInterval(timer);
		fn();
	}
	if ((sys.webkit && sys.webkit < 525) || (sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3)) {
		timer = setInterval(function () {//低版本
			if (/complete|loaded/.test(document.readState)) {
				doReady();		
			}
		} , 1)
	} else if (window.addEventListener) { //W3C
		addEvent (document , 'DOMContentLoaded' , function () {
			doReady();
			removeEvent (document , 'DOMContentLoaded' , arguments.callee);
		});
	} else if (sys.ie && sys.ie < 9) { //IE
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left');
				doReady();
			} catch (e) {};
		})
	}
}

//动画封装
Base.prototype.animate = function (obj) {
	for (var i = 0; i < this.elements.length ; i ++) {
		var element = this.elements[i];
		// 可选 默认方向为左
		var attr = obj['attr'] == 'x' ? 'left' :  obj['attr'] == 'y' ? 'top' :
				   obj['attr'] =='w' ? 'width' : obj['attr'] == 'h' ? 'height' :
				   obj['attr'] == 'o' ? 'opacity' : 'left'; 
		// 可选 默认开始位置为元素所在位置
		var start = obj['start'] != undefined ? obj['start'] : 
								 attr == 'opacity' ? parseFloat(getStyle(element , attr)) * 100 :
													 parseInt(getStyle(element , attr));
		//可选  默认时间为50ms;
		var t = obj['t'] != undefined ? obj['t'] : 50;
		//可选 默认速度为10；
		var step = obj['step'] != undefined ? obj['step'] : 10;
		//可选 默认缓冲值为6
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;
		//可选 默认模式为变速 constant是英语的匀速
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';
        
		var target = obj['target'];
		var alter = obj['alter'];
        if (alter != undefined && target== undefined) {
        	target = alter + start;
        } else if (alter == undefined && target == undefined) {
        	throw new Error('alter和target必须传一个值');
        }
        if (step > target) step = -step; //判断方向

		if (attr != 'opacity') element.style[attr] = start + 'px'; //每次运行在初始化一下起始点

		clearInterval(window.timer); //清理多余的计时
		var timer = setInterval(function () {
            //判断匀速还是变速
			if (type == 'buffer') {
			var temp = attr == 'opacity' ? 
						(target - parseFloat(getStyle(element , attr)) * 100) / speed :
						(target - parseInt(getStyle(element , attr))) / speed;
			step = step > 0 ? Math.ceil(temp) : Math.floor(temp);
			}

			if (attr == 'opacity') {
				var temp = parseFloat(getStyle(element , attr)) * 100;
				if (step == 0) {
			    	getOpacity();
			    } else if (step > 0 && Math.abs(parseFloat(getStyle(element , attr)) * 100 - target) <= step) { 
					getOpacity();
				} else if (step < 0 && parseFloat(getStyle(element , attr)) * 100 - target <= Math.abs(step)) {
					getOpacity();
				} else {
					element.style[attr] = parseInt(temp + step) / 100;
					element.style.filter = 'alpha(opacity=' +  parseInt(temp + step) + ')';
				}
				
			} else {
			    // 不会让元素的目标值在叠加的时候多几个像素或者小几个像素而产生突兀
			    if (step == 0) {
			    	getStep();
			    } else if (step > 0 && Math.abs((parseInt(getStyle(element , attr)) - target)) <= step) { 
					getStep();
				} else if (step < 0 && parseInt(getStyle(element , attr)) - target <= Math.abs(step)) {
					getStep();
				} else {
					element.style[attr] = parseInt(getStyle(element , attr)) + step + 'px';
				}
			}
		} , t);

		function getStep () {
			element.style[attr] = target + 'px';
			clearInterval(timer);
		}

		function getOpacity () {
			element.style[attr] = target / 100;
			element.style.filter = 'alpha(opacity=' +  target + ')';
			clearInterval(timer);
		}
	}
	return this;
}