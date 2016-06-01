/*
* 对exp下拉或有滚动功能进行封装
* @author mawei
*/
compose.require('scripts/common/exp-select.js', [
    'window.$',
    "scripts/lib/exp.js"
], function($, Exp) {
	var selectMod = {
		/*
		* function 自定义显示下拉列表
		* @param  {[Element]} $el [select元素]
		* author: mawei
		*/
		createSelect:function($el){
			var self = this;
			var bgHtml = '<div style="position:absolute;opacity:0.01;"></div>',
				$bg = $(bgHtml).insertAfter($el);
			var top = this.getTop($el[0]),
				left = this.getLeft($el[0]),
				border = ($el.css("border-top-width").match(/\d+/)[0]-0||1)+12,
				width = $el.width(),
				height = $el.height();
			$bg.css({
				top: top - border,
				left: left - border,
				width: width + border * 2 - 9,
				height: height + border * 2
			});
			self.click($bg, function(event, touchEvent){
				if(event.preventDefault)event.preventDefault();
				if(touchEvent && touchEvent.preventDefault)touchEvent.preventDefault();
				self.showSelect({
					el:$el,
					title:$el.attr("title"),
					rootClass: 'mod-drag-select-box',
					render: function(){
						var $options = $el.find("option"),
							html = '';
						$options.each(function(i, el, elements){
							var $el = $(el), val = $el.val(), text = $el.text();
							html += '<div class="mod-flex-box vert option" style="'+($el.css('display') =='none'?'display:none;':'')+'" value="'+ (val||"") +'">'
							 + '<div class="flex">'+ text +'</div>'
							 + '<div><input type="radio"/><label><span></span></label></div>'
							 + '</div>';
						});
						return html;
					},
					setSelected: function(){
						//设置该元素居中,根据<select>元素的值来确定模拟下拉框元素来设置
						var _selectIndex = $el.get(0).selectedIndex,
							_selectValue  = $el.get(0).options[_selectIndex].value,
							_options = this.parent.find(".option"),
							_option = _options.eq(_selectIndex),
							_length = _options.length,
							_dragContent = $(".mod-drag-content");
						var	optionHeight = _option.css("height").replace('px','')-0,
							dragHeight = _dragContent.css("height").replace('px','')-0,
							//父元素能放多少条option
							count = dragHeight/optionHeight;
						if(_selectValue !== ""){
							_option.addClass("active");
							_option.find("input").attr("checked", "checked");
							if(_selectIndex > count && _selectIndex < _length - 2){
								var distance = (_selectIndex - 2)*optionHeight;//上面留两条
								Exp.css(this.drag, 'transition', 'none');
								Exp.css(this.drag, 'transform', 'translate3d(0px,'+ (-distance) +'px,0px)');
							}else if(_selectIndex >= _length - 2 && _length > count){
								var distance = (_length - count)*optionHeight;//放在最底部
								Exp.css(this.drag, 'transition', 'none');
								Exp.css(this.drag, 'transform', 'translate3d(0px,'+ (-distance) +'px,0px)');
							}
							Exp.css(this.slideBtn, 'transform', 'translate3d(0px,'+ Math.abs(dragHeight*Math.abs(distance)/this.drag.css("height").replace('px','')-0) +'px,0px)');
						}
					},
					callBack: function(selectorCore){
						var self = this, $el = $(this.el), $drag = $el.find(".mod-drag");
						Exp.click($drag, ".mod-flex-box", function(){
							var $el = $(this), lastSelected = self.lastSelected;
							$el.addClass("active").siblings().removeClass("active");
							$el.siblings().find("input").removeAttr("checked");
							setTimeout(function(){
								selectorCore.reset();
							}, 100);
							if(self.lastSelected){
								lastSelected.input.removeAttr("checked");
							}
							var input = $el.find("input").attr("checked", "checked");
							self.lastSelected = {
								input: $el.find("input").attr("checked", "checked"),
								item: $el,
								index: input.val()
							};
							
							var val = $el.attr("value");
							if(val){
								selectorCore.el.val(val);
								selectorCore.el.trigger("change");
								
							}else {
								var options = self.el.find("option")
									text = $el.text();
								options.each(function(i, el){
									var $el = $(el);
									if($el.text() == text){
										$el.attr("selected",true);
										return false;
									}
								});
							}
						});
					}
				});
				return false;
			});
		},
		/*
		* function 显示下拉列表
		* @param  {[Element]} $el [select元素]
		* author: mawei
		*/
		showSelect: function(options){
			return this.selectCore({
				el: options.el,
				title:options.title,
				renderTitle:options.renderTitle,
				renderFooter:options.renderFooter,
				rootClass:options.rootClass,
				callBack:options.callBack,
				bgClickReset: options.bgClickReset,
				render: function(){
					var html = '<div class="mod-drag mod-select">';
					html += options.render && options.render();
					html += '</div>';
					html += '<div class="slide">'
						 +'<div class="slide-btn"></div>'
						 +'</div>';
					return html;
				},
				setSelected: function(){
					options.setSelected&&options.setSelected.call(this);
				},
				setCenter: function(el){
					var _option = el,
						_dragContent = $(".mod-drag-content"),
						children = el.parent().children(),
						dragContentHeight = _dragContent.css("height").replace('px','')-0,
						dragHeight = this.drag.css("height").replace('px','')-0,
						optionHeight = dragHeight/(children.length||1);
					var index = children.index(el), 
						move = - index*optionHeight + dragContentHeight/2;
					if(move < dragContentHeight - dragHeight){
						move = dragContentHeight - dragHeight;
					}
					else if(move > 0){
						move = 0;
					}
					Exp.css(this.drag, 'transition', 'none');
					Exp.css(this.drag, 'transform', 'translate3d(0px,'+ (move) +'px,0px)');
					Exp.css(this.slideBtn, 'transform', 'translate3d(0px,'+ Math.abs(dragContentHeight*Math.abs(move)/dragHeight) +'px,0px)');
				},
				refreshSite: function(option){
					var $parent = this.parent, 
						$drag = this.drag,
						$slide = this.parent.find(".slide"),
						$slideBtn = this.slideBtn,
						$bg = this.parent.find(".select-bg"),
						$target = this.el,
						slideRange = {
							minY: 0,
							maxY: 0
						},
						btnHeight,
						self = this;
					
					this.slideRange = slideRange;
					$slide.css('opacity', 0).show();
					Exp.css($slide, 'transition', 'opacity 0.3s ease-out');
					setTimeout(function(){
						$slide.css('opacity', 1).css("left", $drag.width() - $slideBtn.width());
					}, 300);
		
					totalHeight = $parent.height(), 
					selectHeight = $drag.height();
					btnHeight = totalHeight*totalHeight/selectHeight;
					if(totalHeight >= selectHeight){
						btnHeight = totalHeight;
						Exp.css($slideBtn, 'opacity', '0');
					}
					$slideBtn.height(btnHeight);
					slideRange.maxY = totalHeight - btnHeight;
					if(options.bgClickReset!==false){
						Exp.click($(this.alertBox.bg), function(){
							self.reset();
						});
					}
				},
				touchstart: function(event){
					Exp.css(this.slideBtn, 'transition', 'opacity 0.3s ease-out');
				},
				touchmove: function(event){
					var $parent = this.parent,
						$drag = this.drag,
						$slideBtn = this.slideBtn,
						totalHeight = $parent.height(), 
						selectHeight = $drag.height(),
						point = {
							x: event.clientX,
							y: event.clientY
						},
						startPoint = this.startPoint,
						slideRange = this.slideRange,
						subY = -startPoint.startY + startPoint.y - point.y,
						maxY = totalHeight - $slideBtn.height();
					if(!slideRange)return;
					var btnY = subY*totalHeight/selectHeight,
						btnYTrim = btnY<slideRange.minY?slideRange.minY:btnY>maxY?maxY:btnY;
					Exp.css($drag, 'transform', 'translate3d(0px,'+ (-subY) +'px,0px)');
					movePoint = point;
					var btnMoveHeight = totalHeight*totalHeight/selectHeight;
					if(totalHeight>=selectHeight){
						if(Math.abs(-subY) + selectHeight >= totalHeight){
							btnMoveHeight = totalHeight*totalHeight/(selectHeight + Math.abs(subY));
							Exp.css($slideBtn, 'opacity', '1');
						}
						else{
							btnMoveHeight = totalHeight;
							Exp.css($slideBtn, 'opacity', '0');
						}
					}
					else if(btnY<slideRange.minY){
						btnMoveHeight = totalHeight*totalHeight/(selectHeight + Math.abs(subY));
					}
					else if(btnY>maxY){
						btnMoveHeight = totalHeight*totalHeight/(totalHeight + Math.abs(subY));
					}
					$slideBtn.height(btnMoveHeight);
					btnHeight = $slideBtn.height()
					if(totalHeight>selectHeight){
						btnYTrim = 0;
					}
					else if(btnY>maxY){
						btnYTrim += btnHeight - btnMoveHeight;
					}
					Exp.css($slideBtn, 'transform', 'translate3d(0px,'+ (btnYTrim) +'px,0px)');
				},
				touchend: function(event){
					var $parent = this.parent,
						$drag = this.drag,
						$slideBtn = this.slideBtn,
						totalHeight = $parent.height(), 
						selectHeight = $drag.height(),
						point = {
							x: event.clientX,
							y: event.clientY
						},
						startPoint = this.startPoint,
						slideRange = this.slideRange;
					Exp.css($slideBtn, 'transition', 'all 0.300s ease-out');
					var btnEndHeight = totalHeight*totalHeight/selectHeight;
					if(totalHeight>=selectHeight){
						btnEndHeight = totalHeight;
						Exp.css($slideBtn, 'opacity', '0');
					}
					$slideBtn.height(btnEndHeight);
					var top = Math.abs(totalHeight*this.dragY/selectHeight);
					Exp.css($slideBtn, 'transform', 'translate3d(0px,'+ (totalHeight>selectHeight? 0 : top) +'px,0px)');
					var btnHeightEnd = $slideBtn.height();
					var values = /translate3d\(([\d-+.]+)px?, ([\d-+.]+)px?, ([\d-+.]+)px?\)/gi.exec(Exp.css($slideBtn, 'transform'));
					var y = values?values[2]-0:0, btnY;
					var btnHeight = $slideBtn.height();
					if(btnHeightEnd < btnHeight && y > slideRange.maxY){
						btnY = slideRange.maxY;
						Exp.css($slideBtn, 'transform', 'translate3d(0px,'+ (btnY) +'px,0px)');
					}
				}
			});
		},
		/*
		* function 自定义滑动列表
		* @param  {[Object]} options [配置项]
		* author: mawei
		*/
		selectCore:function(options){
			$('.alert-box-valide, .alert-box-bg-valide').hide();
			var Exp = this, $el = options.el, object = options; 
			var html = analyzeEl($el);
			function analyzeEl($el){
				var html = '<div class="alert-box mod-drag-box alert-box-anim-init'+(options.rootClass?' '+options.rootClass:'')+'">',
					title = options.title || $el&&$el.attr("title"),
					$options = $el&&$el.find("option");
				if(options.renderTitle){
					html += options.renderTitle();
				}
				else if(title){
					html += '<header class="vert"><p class="title vert mod-flex-box">'+ title +'</p></header>';
				}
				html += '<section class="mod-drag-content" style="opacity:0">';
				
				//html += options.render.call(object);
				
				html += '</section>';
				if(options.renderFooter){
					html += options.renderFooter();
				}
				html += '</div>';
				return html;
			}
			var count = 0;
			object.alertBox = this.alertBox({
				type:"custom",
				html: html,
				autoCancel:true,
				animate: "alert-box-anim",
				bgAnimate: "alert-bg-anim",
				animateOut: "alert-box-anim-out2",
				bgAnimateOut: "alert-bg-anim-out",
				bgClickReset: options.bgClickReset,
				//renderTime:400,
				callBack: function(){
					var $el = $(this.el), 
						$parent = $el.find(".mod-drag-content");
					$parent.html(options.render.call(object));
					var $drag = $el.find(".mod-drag"),
						sub, 
						lastSelected;
					object.parent = $parent;
					object.drag = $drag;
					Exp.addDefaultsEvents($el);
					/*Exp.addDefaultsEvents($(this.bg));
					Exp.addDefaultsEvents($el);*/
					var totalHeight, 
						selectHeight,
						btnHeight,
						dragRange = {
							minY: 0,
							maxY: 0
						},
						speed;
					
					object.drag = $drag;
					
					object.slideBtn = object.parent.find(".slide-btn");
					if(options.setSelected)options.setSelected.call(object);
					Exp.css(object.parent, 'opacity', '1');
					
					setTimeout(function(){
						totalHeight = $parent.height(), 
						selectHeight = $drag.height();
						dragRange.maxY = totalHeight - selectHeight;
						if(options.refreshSite)options.refreshSite.call(object);
					}, 600);
					
					var startPoint, movePoint, endPoint,
						values = Exp.css3($drag, 'transform'),
						startY = values?values[1]-0:0,
						startTop = $drag.offset().top,
						initTop = startTop + startY;;
					Exp.touchstart($drag, function(event){
						var values = Exp.css3($drag, 'transform');
						var startY = values?values[1]-0:0;
						startPoint = {
							x: event.clientX,
							y: event.clientY,
							startY: startY
						}
						var top = $drag.offset().top;
						//Exp.css($drag, 'transform', 'translate3d(0px,'+ (top - initTop) +'px,0px)');
						Exp.css($drag, 'transition', 'none');
						speed = [];
						object.startPoint = startPoint;
						if(options.touchstart)options.touchstart.call(object, event);
					});
					Exp.touchmove($drag, function(event){
						if(!startPoint)return;
						var point = {
							x: event.clientX,
							y: event.clientY
						};
						
						var subY = -startPoint.startY + startPoint.y - point.y;
						Exp.css($drag, 'transform', 'translate3d(0px,'+ (-subY) +'px,0px)');
						speed.push(point);
						if(options.touchmove)options.touchmove.call(object, event);
						object.movePoint = movePoint = point;
					});
					function touchend(event){
						if(!startPoint)return;
						endPoint = {
							x: event.clientX,
							y: event.clientY
						}
						var sp = 0;
						for(var i = speed.length - 1, j=3; i>0 && j>=0; i--,j--){
							sp += speed[i-1].y - speed[i].y;
						}
						sp *= 3;
						var values = Exp.css3($drag, 'transform');
						var y = (values?values[1]-0:0)-sp,
							totalHeight = object.parent.height(), 
							selectHeight = object.drag.height();
						Exp.css($drag, 'transition', 'all 0.300s ease-out');
						if(totalHeight>selectHeight){
							y = 0;
						}
						else if(y<dragRange.maxY){
							y = dragRange.maxY;
						}
						else if(y>0){
							y = 0;
						}
						Exp.css($drag, 'transform', 'translate3d(0px,'+ y +'px,0px)');
						object.endPoint = endPoint;
						object.dragY = y;
						startPoint = null;
						if(options.touchend)options.touchend.call(object, event);
					}
					Exp.touchend($drag, touchend);
					Exp.touchend($el, function(event){
						touchend(event);
					});
					Exp.touchend($(this.bg), function(event){
						touchend(event);
					});
					if(options.callBack){
						options.callBack.call(this, object);
					}
				}
			});
			object.reset = function(noAnimate){
				object.alertBox.reset();
			}
			return object
		}
	}
	Exp.extend(Exp, selectMod);
});