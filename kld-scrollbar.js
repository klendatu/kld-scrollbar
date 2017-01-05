+(function($, global){
	
	"use strict";  
	  
	var ScrollBar = function($container, options){
		
		this.options 			= this.jsonExtend(options, ScrollBar.defaults);
						
		// Selector
		this.scrollBarClass		= this.options.mainClassName;
		this.scrollBarSelector	= '.'+this.scrollBarClass;
				
		// DOM component
		this.$container 		= $container;
		this.$content	 		= this.$container.find(this.scrollBarSelector + '-content');
		this.$scrollbar 		= this.$container.find(this.scrollBarSelector + '-bar');
		this.$cursor 			= this.$scrollbar.find(this.scrollBarSelector + '-cursor');
			
		this.wheelActive		= true;		
		this.mousedown			= false;	
				
		this.cursorHeight		= parseInt(this.$cursor.height());
		this.cursorRange		= parseInt(this.$scrollbar.height());
		this.cursorRangeMax 	= parseInt(this.$scrollbar.height()) - parseInt(this.$cursor.height());
		this.cursorTop			= 0;	
			
		this.scrollRange		= this.$content.get(0).scrollHeight;	// Distance verticale qu'il est possible de scroller
		this.scrollRangeMax		= parseInt(this.scrollRange) - parseInt(this.$content.height());
		this.scrollTop			= this.options.scrollTop;
		this.cursorWheelDelta	= this.options.cursorWheelDelta;
			
		this.init();		
		
		/*
		console.log('this.$content.height() '+this.$content.height())
		console.log('this.scrollRange '+this.scrollRange)
		console.log('this.cursorRangeMax '+this.cursorRangeMax)
		console.log('this.scrollRangeMax '+this.scrollRangeMax)
		*/
	}

	ScrollBar.prototype.init = function(){
		var that = this;
		
		if (parseInt(this.scrollRange) <= parseInt(this.$content.outerHeight())){
			this.$scrollbar.hide();
			return;
		}
		
		this.initMouseWheel();
		this.initDradAndDrop();			
		this.updateCursorFromScrollTop();
		this.updateCursorPosition();
		this.updateScroll();
	}
	
	ScrollBar.prototype.initMouseWheel = function(){
		var that = this;
		
		if (this.wheelActive){
			this.$content.on('mousewheel DOMMouseScroll', function(event){
				event.preventDefault();
				var prevScrollTop = that.scrollTop;

				if (event.originalEvent.detail)						// Firefox
					var delta = event.originalEvent.detail;
				
				if (event.originalEvent.wheelDelta)					// Tous les autres
					var delta = - event.originalEvent.wheelDelta;
						
				if (delta < 0){		
					that.cursorTop -= that.cursorWheelDelta;
				}else{
					that.cursorTop += that.cursorWheelDelta;
				}
				
				
				that.updateCursorPosition();
				that.updateScroll();
			});
		}
	}

	ScrollBar.prototype.initDradAndDrop = function(){
		var that = this;
		this.$cursor.on('mousedown', function(event){
		
			//Position de la souris sur le curseur depuis le haut du curseur
			var clickCursorPosTop = parseInt(event.offsetY);
			
			//Position de la scrollbar depuis le haut de l'écran
			var scrollbarOffsetTop = parseInt(that.$scrollbar.offset().top);
			
			
			that.mousedown = true;
			
			$(document).on('mousemove', function(event){
				event.preventDefault();
				
				if (that.mousedown){				
					var cursorPosTop = that.$cursor.position().top;				
					if (cursorPosTop >= 0 && cursorPosTop <= that.cursorRangeMax){					
						that.cursorTop = event.pageY - scrollbarOffsetTop - clickCursorPosTop;
						that.updateCursorPosition();
						that.updateScroll();						
					}
				}
				
			});
		});
		
		this.$cursor.on('mouseup', function(){		//	console.log('mouseup')
			that.mousedown = false;
		});
		
		$(document).on('mouseup', function(){		//	console.log('mouseup')
			that.mousedown = false;
		});
	}
	
	ScrollBar.prototype.updateScroll = function(){
		var that = this;				
		this.scrollTop = this.cursorTop * (this.scrollRangeMax / this.cursorRangeMax);		
		// console.log(this.cursorTop +' '+ this.scrollRange +' '+ this.cursorRange)
		// console.log(this.scrollTop + ' - ' + this.cursorTop)
		
		if (this.scrollTop < 0)
			this.scrollTop = 0;
			
		if (this.scrollTop >= this.scrollRangeMax){
			// console.log('MAX REACHING !')
		}
		
		this.$content.scrollTop(this.scrollTop);
	}
	
	ScrollBar.prototype.updateCursorPosition = function(){		
		if (this.cursorTop < 0) 
			this.cursorTop = 0;
			
		if (this.cursorTop > this.cursorRangeMax) 
			this.cursorTop = this.cursorRangeMax;
	
		this.$cursor.css({ 
			top: this.cursorTop + 'px' 
		});
	}
	
	ScrollBar.prototype.updateCursorFromScrollTop = function(){
		this.cursorTop = this.scrollTop * this.cursorRange / this.scrollRange;
		this.updateCursorPosition();
	}
	
	ScrollBar.prototype.jsonExtend = function(json, defaultJSON){
		var result={};
		for(var key in defaultJSON) result[key]=defaultJSON[key];
		for(var key in json) 		result[key]=json[key];
		return result;
	}
	
	ScrollBar.defaults = {
		mainClassName: 'ScrollBar',			// Valeur initiale du scroll
		scrollTop: 0,			// Valeur initiale du scroll
		cursorWheelDelta: 10	// Delta de la molette souris (scroll cursor)
	};

	function module(selector, options) {
		$(selector).each(function () {
			var $this = $(this);
			$this.data('kld.scrollbar', new ScrollBar($this, options));
		});
	}
	
	global.Kld = global.Kld || {};
	
	global.Kld.scrollbar = module;
	
}(jQuery, window));





