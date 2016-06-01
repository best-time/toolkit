/*
 * 对exp下拉或有滚动功能进行封装
 * @author mawei
 */
(function($, template, Exp){
	HTMLElement.prototype.contains = function(B){
		if(B){
			return this.compareDocumentPosition(B) - 19 > 0
		}
	}
	function createSingleQueue(){
		var lastCallback, timer;
		return {
			add: function(callback, time){
				if(lastCallback){
					clearTimeout(timer);
					lastCallback(true);
				}
				lastCallback = callback;
				timer = setTimeout(function(){
					callback();
					lastCallback = null;
				}, time||1000);
			}
		}
	}
	var cusorQueue = createSingleQueue(),
			pwdInputQueue = createSingleQueue(),
			content = $('head meta[name=viewport]').attr('content'),
			times = 1/(content||'1').match(/initial\-scale\=([.\d]+)/)[1];


	Exp.doubleClick = function($el, selector, handler, immediate, data){
		var sub,
				severalClickTime = 1000,
				timer;
		if(typeof arguments[1] == 'function'){
			data = immediate;
			immediate = handler;
			handler = selector;
			selector = undefined;
		}
		var touchstart = data && data.touchstart,
				touchend = data && data.touchend;
		this.touchstart($el, selector, function(event){
			clearInterval(timer);
			sub = {x:event.clientX, y:event.clientY, target:this};
			if(touchstart){
				touchstart.call(this, sub);
			}
			var target = this;
			timer = setTimeout(interval, severalClickTime);

			function interval(){
				if(touchend){
					touchend.call(target, sub);
				}
				handler.call(target, event);
				timer = setTimeout(interval, severalClickTime/10);
			}
		});
		this.touchmove($el, selector, function(event){
			var self = this;
			if(!sub || this != sub.target)return;
			if(Math.abs(event.clientX - sub.x) > 5 || Math.abs(event.clientY - sub.y) > 5){
				if(touchend){
					sub.status = 'cancel';
					touchend.call(this, sub);
				}
				clearTimeout(timer);
				sub = null;
			}
		});
		this.touchend($el, selector, function(event){
			var self = this;
			if(!sub || this != sub.target)return;
			if(Math.abs(event.clientX - sub.x) <= 5 && Math.abs(event.clientY - sub.y) <= 5){
				if(handler){
					sub.status = 'success';
					//使点击active有效
					if(immediate === true){
						if(touchend){
							touchend.call(this, sub);
						}
						sub = null;
						clearTimeout(timer);
						return handler.call(this, event);
					}
					else{
						setTimeout(function(){
							handler.call(self, event);
							if(touchend){
								touchend.call(self, sub);
							}
						}, 110);
					}
				}
			}
			else if(touchend){
				sub.status = 'cancel';
				touchend.call(this, sub);
			}
			clearTimeout(timer);
		});

		this.touchcancel($el, selector, function(event){
			var self = this;
			if(touchend && sub){
				sub.status = 'cancel';
				touchend.call(this, sub);
			}
			sub = null;
			clearTimeout(timer);
		});
	}

	var keyboard = {
		/*
		 * 密码输入框（简密）加键盘
		 */
		pwdInputKeyboard: function(options){
			var confirmBtn, keyboard;
			var passwordBox = Exp.openPopWindow(getInputTemple(), function(){
				var value = keyboard.val();
				var pass = !!(value && value.length == 6);
				if(pass && options && options.confirmCallback){
					options.confirmCallback(value);
				}
				return pass;
			}, null, {
				callback: function(){
					confirmBtn = $(this.el).find('.confirm');
				},
				asyncResetCallback: function(){
					keyboard.slideOut();
				},
				rootClass: 'pop-password-box',
				upOffset:119
			});
			function handleInputCallback(value){
				if(value && value.length == 6){
					confirmBtn.removeClass('invalide').removeAttr('data-clickforbidden');
				}
				else{
					confirmBtn.addClass('invalide').attr('data-clickforbidden', true);
				}
				if(options && options.input){
					options.input(value);
				}
			}
			setTimeout(function(){
				var inputs = $(passwordBox.el).find('.pwd-box .pwd-char-box'),
						inputs2 = [];
				inputs.forEach(function(e){
					inputs2.push($(e));
				});
				keyboard = Exp.numberKeyboard({
					type:'tel',
					asyncReset: function(){
						passwordBox.reset();
					},
					input: function(value){
						if(value.length > 6){
							value = this.delete();
						}
						inputs2.forEach(function(e, i){
							e.empty();
							if(value.charAt(i)){
								e.append('<div class="spot"></div>');
							}
							else{
								e.append('<div class="blank"></div>');
							}
						});
						handleInputCallback(value);
					}
				}).slideIn();
			}, 100);
			function getInputTemple(){
				return  '<div class="pwd-header">'
						+'<p class="title">请输入手机支付密码</p>'
						+'</div>'
						+'<div class="pwd-content">'
						+'<div class="pwd-box">'
						+'<div class="pwd-char-box"><div class="blank"></div></div>'
						+'<div class="pwd-char-box"><div class="blank"></div></div>'
						+'<div class="pwd-char-box"><div class="blank"></div></div>'
						+'<div class="pwd-char-box"><div class="blank"></div></div>'
						+'<div class="pwd-char-box"><div class="blank"></div></div>'
						+'<div class="pwd-char-box"><div class="blank"></div></div>'
						+'</div>'
						+'</div>'
						+'<div class="pop-button">'
						+'<a href="javascript:void(0);" class="close" data-clickactive>取消</a>'
						+'<a href="javascript:void(0);" class="confirm invalide" data-clickactive="change" data-clickforbidden>确定</a>'
						+'</div>';
			}
			return {
				passwordBox: passwordBox,
				getKeyboard: function(){
					return keyboard;
				},
				getValue: function(){
					return keyboard.val();
				}
			}
		},
		/*
		 * 对输入框生成数字键盘
		 */
		createKeyboard: function(options){
			if(!options || !options.el|| !options.el.size())return;
			var self = this,
					el = options.el,
					top = 0,
					left = this.getLeft(el[0]),
					contentHtml = '<div class="wrap-input-mod keyboard-rise" style="position:'+
							(' absolute fix'.indexOf(el.css('position'))>0?'absolute':'relative')+';"></div>',
					clear = options.clear,
					clearHtml = '<div class="keyboard-tip-icon clearIcon"><i class="keyboard-cut"></i></div>',
					content = $(contentHtml).insertAfter(el),
					placeholder = el.attr('placeholder'),
					initValue = el.val(),
					keyboardInput = {},
					keyboard,
					chars = $('<div class="chars keyboard-rise"></div>').appendTo(content),
					cursor = $('<div class="cursor cursor-frame keyboard-rise" style="position:absolute;border-right:solid 1px;height: 100%;top: 0;display:none;"></div>').appendTo(content),
					lastChar = chars.find(':last-child'),
					fontSize = el.css('font-size'),
					textAlign = el.css('text-align'),
					color = el.css('color'),
					lastValue = initValue,
					prevSelector = options.prevSelector,
					height = el.css('height'),
					width = el.css('width'),
					lineHeight = fontSize,
					showText = false,
					contentParent = options.contentParent;
			content.css({
				width: width,
				height: height,
				'border-radius': el.css("border-radius"),
				'border-top-color': el.css("border-top-color"),
				'border-top-style': el.css("border-top-style"),
				'border-top-width': el.css("border-top-width"),
				'border-right-color': el.css("border-right-color"),
				'border-right-style': el.css("border-right-style"),
				'border-right-width': el.css("border-right-width"),
				'border-bottom-color': el.css("border-bottom-color"),
				'border-bottom-style': el.css("border-bottom-style"),
				'border-bottom-width': el.css("border-bottom-width"),
				'border-left-color': el.css("border-left-color"),
				'border-left-style': el.css("border-left-style"),
				'border-left-width': el.css("border-left-width"),
				'padding-top': (height.match(/\d+/)[0] - lineHeight.match(/\d+/)[0])/2,
				'padding-right': el.css("padding-right"),
				'padding-bottom': (height.match(/\d+/)[0] - lineHeight.match(/\d+/)[0])/2,
				'padding-left': el.css("padding-left"),
				'margin-top': el.css("margin-top"),
				'margin-right': el.css("margin-right"),
				'margin-bottom': el.css("margin-bottom"),
				'margin-left': el.css("margin-left"),
				'line-height': lineHeight,
				'font-style': el.css('font-style'),
				'font-variant': el.css('font-variant'),
				'font-weight': el.css('font-weight'),
				'font-stretch': el.css('font-stretch'),
				'font-size': el.css('font-size'),
				'font-family': el.css('font-family'),
				'font': el.css('font'),
				'text-overflow':'ellipsis',
				'white-space':'nowrap',
				'box-sizing':el.css('box-sizing'),
				'background-color':'#fff'
			});
			var padding = {
				top: times*(height.match(/\d+/)[0]-fontSize.match(/\d+/)[0])/2,
				left: el.css("padding-left").match(/\d+/)[0]-0
			}
			chars.css({
				'text-align': textAlign,
				width: width.match(/\d+/)[0]-el.css("padding-right").match(/\d+/)[0]-el.css("padding-left").match(/\d+/)[0],
				height: lineHeight,
				'line-height': (height.match(/\d+/)[0]-content.css("padding-top").match(/\d+/)[0]*2)+'px',
				'top': padding.top,
				'left': padding.left
			});
			if(textAlign != 'right'){
				chars.addClass('chars-left');
			}
			el.css('opacity', 0).hide();
			cursor.css({height: fontSize, color:color});

			setCuror(lastChar);
			function setCuror(char, direct){
				if(el.is('[disabled]'))return;
				if(char && char.size() && char.hasClass('char') && char.parent().size()){
					left = Exp.getLeft(char[0])-1+(direct==='left'?0:char.width()+(el.is('[type=password]')?16:0));
					top = padding.top;
				}
				else{
					if(textAlign == 'right'){
						left = content.width();
						top = padding.top;
					}
					else{
						left = padding.left;
						top = padding.top;
					}
				}
				cursor.css({
					left: left,
					top: top
				});
			}
			var targetChar = null;
			Exp.click(chars, '.char', function(event){
				if(el.is('[disabled]'))return;
				focusor.focus();

				var target = $(this), index = target.index();
				var left = Exp.getLeft(target[0], true), clientX = event.clientX, width = target.width();
				if(clientX - Math.floor(width/2) > left){
					index += 1;
					setCuror(target);
				}
				else{
					setCuror(target, 'left');
				}
				keyboardInput.focus(true);
				keyboard.setCursor(index);
				targetChar = target;
				return false;
			}, true);
			Exp.click(content, clickFocus, true);
			Exp.click(chars, clickFocus, true);

			function clickFocus(event){
				if(el.is('[disabled]'))return;
				if(targetChar){
					targetChar = null;
					return;
				}
				focusor.focus();
				keyboardInput.focus(true);
				var lastChild = chars.find('.char:last-child');
				if(lastChild.size()){
					setCuror(lastChild);
					if(keyboard)keyboard.setCursor(lastChild.index()+1);
				}
				else{
					setCuror();
					if(keyboard)keyboard.setCursor(0);
				}
				return false;
			}
			//清除功能
			var clearObj = {
				init: function(){
					var self = this;
					if(this.el){
						Exp.click(this.el, function(){
							el.val('');
							self.hide();
							keyboardInput.focus(true);
							return false;
						}, true);
					}
					this.check(initValue);
				},
				el: clear ? $(clearHtml).insertAfter(cursor) : null,
				show: function(){
					if(this.el)this.el.show();
				},
				hide: function(){
					if(this.el)this.el.hide();
				},
				check: function(value){
					if(value.length){
						this.show();
					}
					else{
						this.hide();
					}
				}
			}
			clearObj.init();
			var root;
			function handleCreateKeyboard(el){
				var keyboardCore =  self.createKeyboard.keyboardCore;
				if(keyboardCore){
					keyboardCore.set(input, el.attr('type') || 'tel', el.val());
				}
				else{
					keyboardCore = Exp.createKeyboard.keyboardCore = Exp.numberKeyboard({
						el: el,
						type: el.attr('type') || 'tel',
						input: input,
						/*background: true,*/
						handleKeyTemple: function(keyTemple){
							keyTemple = '<div class="keyboard-row">'
									+'	<div class="keyboard-char keyboard-bar keyboard-cancel" data-clickactive ><div class="keyboard-cancel">完成</div></div>'
									+'</div>'
									+ keyTemple;
							return keyTemple;
						},
						callback: function(keyboardCore){
							root = $(this.el);
							keyboardInput.bg = $(this.bg).hide();
							Exp.click(keyboardInput.bg, function(){
								if(keyboardCore.keyboardInput){
									keyboardCore.keyboardInput.blur();
								}
								return false;
							}, true)
							//阻止穿透
							Exp.click(root, '.keyboard-bar', function(){
								if(keyboardCore.keyboardInput){
									keyboardCore.keyboardInput.blur();
								}
								return false;
							}, true);
						}
					});
					Exp.click($(document.body), function(){}, false,
							{
								touchend: function(event){
									var target = event.target, clazz = target && (target.getAttribute('class')||'');
									if((target && clazz.indexOf('keyboard-rise')>=0)
											|| root && root[0].contains(target)
											&& !(target && clazz.indexOf('keyboard-cancel')>=0)){
										return;
									}
									if(keyboardCore.keyboardInput){
										keyboardCore.keyboardInput.blur();
									}
								}
							});
				}
				keyboardCore.blurInputCursor = function(){
					cursor.hide();
					hasFocus = false;
					if(options.blur){
						options.blur(this.keyboardInput.val());
					}
				}
				if(keyboardCore.keyboardInput){
					keyboardInput.bg = keyboardCore.keyboardInput.bg;
				}
				keyboardCore.keyboardInput = keyboardInput;
				return keyboardCore;
			}
			function input(inputValue, value, opt, cursorIndex, change){
				if(trim(inputValue))return;
				var valuestr = value + '',
						l = valuestr.length,
						char,
						direct,
						str = '',
						isPwd = el.is('[type=password]'),
						pwdChar = '';
				if(opt == 'add'){
					for(var i=0; i<l; i++){
						+'</span>';
						if(isPwd){
							str += '<span class="char char-cpu" style="color:' + color + ';">'
									+ valuestr.charAt(i)
									+ '</span>';
							pwdChar += '<span class="char" style="color:' + color + ';">*</span>';
						}
						else{
							str += '<span class="char char-cpu" style="color:' + color + ';">'
									+ valuestr.charAt(i)
									+ '</span>';
						}
					}
					if(cursorIndex === 0){
						char = chars.find('.char:first-child');
						if(!char.size()){
							chars.empty();
							char = $(str).appendTo(chars);
						}
						else{
							char = $(str).insertBefore(char);
						}
					}
					else{
						char = chars.find('.char:nth-child('+ cursorIndex +')');
						char = $(str).insertAfter(char);
					}
					cursorIndex += l;
					char.addClass('char-ani');
					if(isPwd && !showText){
						pwdInputQueue.add(function(urge){
							var pwd = $(pwdChar);
							char.replaceWith(pwd);
							if(!urge && pwd.parent().length){
								setCuror(pwd, direct);
							}
						}, 1000);
					}
					setCuror(char, direct);
					checkCusorFlicker();
				}
				else if(opt == 'reset'){
					for(var i=0; i<l; i++){
						str += '<span class="char" style="color:' + color + ';">'
								+ (isPwd&&!showText?'*':valuestr.charAt(i))
								+ '</span>';
					}
					chars.empty();
					char = $(str).appendTo(chars);
					if(change){
						cursorIndex = l;
					}
					char = chars.find('.char:nth-child('+ cursorIndex +')');
					setCuror(char, direct);
				}
				else if(opt == 'delete'){
					if(inputValue == lastValue)return;
					var temp = chars.find('.char:nth-child('+ cursorIndex +')');
					char = temp.prev();
					if(char.size() == 0){
						char = temp.next();
						direct = 'left';
					}
					temp.remove();
					checkCusorFlicker()
					setCuror(char, direct);
				}
				if(placeholder && !inputValue){
					chars.text(placeholder);
				}
				if(change && lastValue !== inputValue){
					el.val(inputValue, true);
					lastValue = inputValue;
					clearObj.check(inputValue);
					el.trigger('input').trigger('change');
					if(Exp.createKeyboard.keyboardCore && Exp.createKeyboard.keyboardCore.keyboardInput){
						Exp.createKeyboard.keyboardCore.keyboardInput.fireEvent('input').fireEvent('change');
					}
					if(options.input){
						options.input(inputValue);
					}
				}

			}
			//验证格式
			function trim(inputValue){
				var maxlength = el.attr('maxlength');
				if(maxlength && inputValue.length > maxlength){
					return del();
				}
				var type = el.attr('type');
				switch(type){
					case 'number':
						var points = inputValue.match(/\./g);
						if(points && points.length>1){
							return del();
						}
					case 'idcard':
						var points = inputValue.match(/X/g);
						if(points && points.length>1){
							return del();
						}
				}

				function del(){
					var keyboardCore = Exp.createKeyboard && Exp.createKeyboard.keyboardCore;
					if(keyboardCore){
						keyboardCore.delete();
						return true;
					}
				}
			}
			//控制光标闪烁
			function checkCusorFlicker(){
				cursor.removeClass('cursor-frame');
				cusorQueue.add(function(urge){
					if(!urge){
						cursor.addClass('cursor-frame');
					}
				}, 800);
			}
			//输入框前置器
			function getKeyboard(setCursorFlag){
				if(!keyboard || setCursorFlag){
					keyboard = handleCreateKeyboard(el);
				}
				return keyboard;
			}
			//内容伸展器
			var contentSpread = {
				el:null,
				shim:$('<div class="key-shim"></div>'),
				parent: contentParent || $(document.body),
				spread: function(input, target){
					var self = this,
							parent = this.parent,
							inputOffset = input.offset(),
							targetTop = target.offset().height,
							scroll = document.body.scrollTop,
							screenHeight = window.innerHeight||screen.height,
							bodyTy = (Exp.css3(parent, 'transform') && Exp.css3(parent, 'transform')[0]||0)-0,
							subY = inputOffset.top + inputOffset.height + 80 - (screenHeight - targetTop) - scroll - bodyTy;
					time = Exp.createKeyboard.keyboardCore.isSlideIn()?'0.4':'0.4';

					if(subY > 0){
						var ty = (Exp.css3(target, 'transform')[1]||0)-0;
						target.removeClass('page-slide-ani').hide();
						var realY = ty, bodySubY = bodyTy + subY;
						if(bodySubY>0){
							Exp.css(target, 'transform', 'translateY('+(realY+30)+'px)');
						}
						else{
							Exp.css(target, 'transform', 'translateY('+(realY-bodySubY)+'px)');
						}
						parent.css({
							'-webkit-transition': 'all '+time+'s cubic-bezier(0.07, 0.4, 0.48, 1);',
							'transition': 'all '+time+'s cubic-bezier(0.07, 0.4, 0.48, 1);'
						})
						setTimeout(function(){
							Exp.css(parent, 'transform', subY==0?'none':'translateY('+-subY+'px)');
							target.addClass('page-slide-ani').show();
							Exp.css(target, 'transform', 'translateY('+(realY)+'px)');
							if(document.body.scrollTop)self.shim.appendTo(parent).height(subY*1.5);
						}, 0);
					}
					else if(bodyTy<0){
						var ty = (Exp.css3(target, 'transform')[1]||0)-0;
						Exp.css(target, 'transform', 'translateY('+(ty)+'px)');
						parent.css({
							'-webkit-transition': 'all '+time+'s cubic-bezier(0.07, 0.4, 0.48, 1);',
							'transition': 'all '+time+'s cubic-bezier(0.07, 0.4, 0.48, 1);'
						})
						Exp.css(parent, 'transform', 'none');
					}

				},
				shrink: function(){
					var parent = this.parent;
					Exp.css(parent, 'transform', 'none');
					$('.key-shim').remove();
				}
			};
			//焦点获取器
			var focusor = {
				el: $(document.body),
				focus: function (){
					var others = $('input').not(function(i){
						if(this && this['exp-keyboardInput']){
							return true;
						}
					})
					others.blur();
					this.el.trigger('click');
					this.el.css('padding-top', 1).css('padding-top', 0);
				},
				blur: function(){
					//this.el.blur();
				}
			}

			var hasFocus = false;
			$.extend(keyboardInput, {
				focus: function(){
					if(hasFocus || el.is('[disabled]'))return;
					if($('.alert-box').not('.alert-box-valide, .alert-page-keyboard').size() || prevSelector && $(prevSelector).size()){
						//return;
					}
					hasFocus = true;
					if(Exp.createKeyboard && Exp.createKeyboard.keyboardCore && keyboardInput != Exp.createKeyboard.keyboardCore.keyboardInput){
						Exp.createKeyboard.keyboardCore.blurInputCursor();
					}
					cursor.show();
					clearObj.check(el.val());
					var self = this;
					getKeyboard(true);
					keyboard.slideIn();
					setTimeout(function(){
						self.spread();
					}, 20);
					if(options.focus){
						options.focus(keyboardInput.val());
					}
					keyboardInput.fireEvent('focus');
					return this;
				},
				blur: function(forceFlag){
					if(!hasFocus)return;
					hasFocus = false;
					cursor.hide();
					this.bg.hide();
					getKeyboard().slideOut({persistent:true});
					setTimeout(function(){contentSpread.shrink(content, $(Exp.createKeyboard.keyboardCore.board.alertBox.el));}, 20);
					if(forceFlag){return this;}
					if(options.blur){
						options.blur(keyboardInput.val());
					}
					keyboardInput.fireEvent('blur');
					contentSpread.shrink();
					return this;
				},
				keyboard: keyboard,
				val: function(value){
					if(arguments.length){
						value =  (value || '') + '';
						if(hasFocus)getKeyboard().val(value);
						else{
							if(typeof value === 'string'){
								input(value, value, 'reset', 0, true);
							}
						}
					}
					else{
						return el.val();
					}
				},
				setCursor: function(index){
					this.focus();
					getKeyboard().setCursor(index);
					return this;
				},
				setDisabled: function(flag){
					disabled = flag;
					if(hasFocus)this.blur();
					return this;
				},
				setPlaceholder: function(placeholderStr){
					placeholder = placeholderStr;
					input('');
				},
				hide: function(){
					this.blur(true);
					return this;
				},
				spread: function(){
					if(hasFocus){
						contentSpread.spread(content, $(Exp.createKeyboard.keyboardCore.board.alertBox.el));
					}
				},
				draw: function(){
					this.val(el.val());
				},
				showText: function(){
					showText = true;
					this.draw();
				},
				hideText: function(){
					showText = false;
					this.draw();
				},
				input:el
			});
			//事件继承，托管el的focus和blur事件,供$.blur和$.focus事件
			Exp.extend(keyboardInput, {
				events:{focus:[],blur:[]},
				addEvent: function(name, callback){
					if(' focus blur '.indexOf(' '+name+' ')>=0 && typeof callback == 'function'){
						this.events[name].push(callback);
					}
					return this;
				},
				fireEvent: function(name){
					if(' focus blur '.indexOf(' '+name+' ')>=0){
						var evts = this.events[name];
						evts.forEach(function(e, i){
							e.call(el, {type:name,target:el});
						});
					}
					return this;
				}

			});
			keyboardInput.val(initValue);
			el.prop('exp-keyboardInput', keyboardInput);
			return keyboardInput;
		},
		/*
		 * 数字键盘
		 */
		numberKeyboard: function(options){
			var el = options.el,
				type = options.type,
				inputValue= el && el.val()||"",
				keyboard = {},
				cursorIndex = 0,
				slideIn = false,
				root,
				datas = {
					'tel': {
						list:[
							[{text:'1',value:'1'},{text:'2',value:'2'},{text:'3',value:'3'}],
							[{text:'4',value:'4'},{text:'5',value:'5'},{text:'6',value:'6'}],
							[{text:'7',value:'7'},{text:'8',value:'8'},{text:'9',value:'9'}],
							[{text:'',value:'',keyClass:'keyboard-operator keyboard-point'},
								{text:'0',value:'0'},
								{text:'&nbsp;',value:'delete',keyClass:'keyboard-operator', charClass:'key-clear'}]
						],
						pageSize: 4,
						pageIndex: 0,
						marginTop:0,
						marginBottom:0,
						clickactive:true,
						boardContentClass:'tel-keyboard-box'
					},
					'number': {
						list:[
							[{text:'1',value:'1'},{text:'2',value:'2'},{text:'3',value:'3'}],
							[{text:'4',value:'4'},{text:'5',value:'5'},{text:'6',value:'6'}],
							[{text:'7',value:'7'},{text:'8',value:'8'},{text:'9',value:'9'}],
							[{text:'.',value:'.',keyClass:'keyboard-operator keyboard-point'},
								{text:'0',value:'0'},
								{text:'&nbsp;',value:'delete',keyClass:'keyboard-operator', charClass:'key-clear'}]
						],
						pageSize: 4,
						pageIndex: 0,
						marginTop:0,
						marginBottom:0,
						clickactive:true,
						boardContentClass:'tel-keyboard-box'
					},
					'text': {
						list:[
							[{text:'q',value:'q',magnifier:true},{text:'w',value:'w',magnifier:true},{text:'e',value:'e',magnifier:true},{text:'r',value:'r',magnifier:true},{text:'t',value:'t',magnifier:true},{text:'y',value:'y',magnifier:true},{text:'u',value:'u',magnifier:true},{text:'i',value:'i',magnifier:true},{text:'o',value:'o',magnifier:true},{text:'p',value:'p',magnifier:true}],
							[{text:'',value:'',charClass:'place',flex:.5},{text:'a',value:'a',magnifier:true},{text:'s',value:'s',magnifier:true},{text:'d',value:'d',magnifier:true},{text:'f',value:'f',magnifier:true},{text:'g',value:'g',magnifier:true},{text:'h',value:'h',magnifier:true},{text:'j',value:'j',magnifier:true},{text:'k',value:'k',magnifier:true},{text:'l',value:'l',magnifier:true},{text:'',value:'',charClass:'place',flex:.5}],
							[{text:'',value:'upperCase',width: 88,charClass:'func upper',textClickactive:true},{text:'z',value:'z',magnifier:true},{text:'x',value:'x',magnifier:true},{text:'c',value:'c',magnifier:true},{text:'v',value:'v',magnifier:true},{text:'b',value:'b',magnifier:true},{text:'n',value:'n',magnifier:true},{text:'m',value:'m',magnifier:true},{text:'',value:'delete',charClass:'func',width:88,charClass:'func delete',textClickactive:true}],
							[{text:'!123',value:'mark',width:84,charClass:'func',fontSize:16*times,textClickactive:true},{text:'.',value:'.',fontSize:18*times,magnifier:true},{text:',',value:',',fontSize:18*times,magnifier:true},{text:'space',value:'&nbsp;',flex:7,fontSize:16*times,textClickactive:'#ADB3BD'},{text:'@',value:'@',fontSize:16*times,magnifier:true},{text:':',value:':',fontSize:21*times,magnifier:true},{text:';',value:';',fontSize:21*times,magnifier:true}],
							[{text:'Q',value:'Q',magnifier:true},{text:'W',value:'W',magnifier:true},{text:'E',value:'E',magnifier:true},{text:'R',value:'R',magnifier:true},{text:'T',value:'T',magnifier:true},{text:'Y',value:'Y',magnifier:true},{text:'U',value:'U',magnifier:true},{text:'I',value:'I',magnifier:true},{text:'O',value:'O',magnifier:true},{text:'P',value:'P',magnifier:true}],
							[{text:'',value:'',charClass:'place',flex:.5},{text:'A',value:'A',magnifier:true},{text:'S',value:'S',magnifier:true},{text:'D',value:'D',magnifier:true},{text:'F',value:'F',magnifier:true},{text:'G',value:'G',magnifier:true},{text:'H',value:'H',magnifier:true},{text:'J',value:'J',magnifier:true},{text:'K',value:'K',magnifier:true},{text:'L',value:'L',magnifier:true},{text:'',value:'',charClass:'place',flex:.5}],
							[{text:'',value:'lowerCase',width: 88,charClass:'func lower',textClickactive:true},{text:'Z',value:'Z',magnifier:true},{text:'X',value:'X',magnifier:true},{text:'C',value:'C',magnifier:true},{text:'V',value:'V',magnifier:true},{text:'B',value:'B',magnifier:true},{text:'N',value:'N',magnifier:true},{text:'M',value:'M',magnifier:true},{text:'',value:'delete',charClass:'func',width:88,charClass:'func delete',textClickactive:true}],
							[{text:'!123',value:'mark',width:82,charClass:'func',fontSize:16*times,textClickactive:true},{text:'.',value:'.',fontSize:18*times,magnifier:true},{text:',',value:',',fontSize:18*times,magnifier:true},{text:'space',value:'&nbsp;',flex:7,fontSize:16*times,textClickactive:'#ADB3BD'},{text:'@',value:'@',fontSize:16*times,magnifier:true},{text:':',value:':',fontSize:21*times,magnifier:true},{text:';',value:';',fontSize:21*times,magnifier:true}],
							[{text:'1',value:'1',fontSize:23*times,magnifier:true},{text:'2',value:'2',fontSize:23*times,magnifier:true},{text:'3',value:'3',fontSize:23*times,magnifier:true},{text:'4',value:'4',fontSize:23*times,magnifier:true},{text:'5',value:'5',fontSize:23*times,magnifier:true},{text:'6',value:'6',fontSize:23*times,magnifier:true},{text:'7',value:'7',fontSize:23*times,magnifier:true},{text:'8',value:'8',fontSize:23*times,magnifier:true},{text:'9',value:'9',fontSize:23*times,magnifier:true},{text:'0',value:'0',fontSize:23*times,magnifier:true}],
							[{text:'~',value:'~',fontSize:18*times,magnifier:true},{text:'!',value:'!',fontSize:18*times,magnifier:true},{text:'#',value:'#',fontSize:18*times,magnifier:true},{text:'$',value:'$',fontSize:16*times,magnifier:true},{text:'%',value:'%',fontSize:18*times,magnifier:true},{text:'^',value:'^',fontSize:21*times,magnifier:true},{text:'&',value:'&',fontSize:16*times,magnifier:true},{text:'*',value:'*',fontSize:21*times,magnifier:true},{text:'\'',value:'\'',fontSize:18*times,magnifier:true},{text:'"',value:'"',fontSize:18*times,magnifier:true}],
							[{text:'',value:'',charClass:'place',flex:.5},{text:'<',value:'<',fontSize:18*times,magnifier:true},{text:'>',value:'>',fontSize:18*times,magnifier:true},{text:'{',value:'{',fontSize:18*times,magnifier:true},{text:'}',value:'}',fontSize:18*times,magnifier:true},{text:'[',value:'[',fontSize:18*times,magnifier:true},{text:']',value:']',fontSize:18*times,magnifier:true},{text:'=',value:'=',fontSize:18*times,magnifier:true},{text:'(',value:'(',fontSize:18*times,magnifier:true},{text:')',value:')',fontSize:18*times,magnifier:true},{text:'',value:'',charClass:'place',flex:.5}],
							[{text:'英',value:'prev',width:88,charClass:'func',fontSize:18*times,textClickactive:true},{text:'+',value:'+',fontSize:18*times,magnifier:true},{text:'-',value:'-',fontSize:18*times,magnifier:true},{text:'_',value:'_',fontSize:18*times,magnifier:true},{text:'/',value:'/',fontSize:18*times,magnifier:true},{text:'\\',value:'\\',fontSize:18*times,magnifier:true},{text:'|',value:'|',fontSize:18*times,magnifier:true},{text:'?',value:'?',fontSize:18*times,magnifier:true},{text:'',value:'delete',width: 88,charClass:'func',charClass:'func delete',textClickactive:true}]
						],
						pageSize: 4,
						pageIndex: 0,
						marginTop:4,
						marginBottom:4,
						clickactive:false,
						boardContentClass:'text-keyboard-box'
					}
				};
			datas['password'] = datas['text'];
			datas['idcard'] = Exp.extend({}, datas['number'], true);
			datas['idcard'].list[3][0] = {text:'X',value:'X',keyClass:'keyboard-operator keyboard-point'};
			if(el){
				type = el.attr('type') || 'number'; //2种类型：number tel
			}
			var optRecords = (function(){
				var records = [];
				return {
					push: function(value){
						records.push(value);
					},
					prev: function(){
						return records[records.length-1];
					},
					clear:function(){
						records = [];
					}
				}
			})();
			var board = Exp.page({
				auto: true,
				rootClass: "alert-page-keyboard",
				position: "bottom",
				html: getKeyboardTemple(type),
				background: !!options.background,
				bgClickReset: false,
				asyncResetCallback: function(){
					if(options.asyncReset){
						options.asyncReset.call(this, keyboard);
					}
				},
				resizeCallback: function(){
					if(slideIn){
						keyboard.slideIn();
					}
				},
				alertCallBack:function(){
					root = $(this.el);
					var magnifier = $('<svg class="keyboard-char key-magnifier" style="display:none;"><path class="keyboard-char" style="fill:white;stroke:#909397;stroke-width:.3"/><text x="68" y="80" text-anchor="middle" font-family="arial,tahoma" font-size="70" fill="#333"></text></svg>').appendTo(root),
							magContent = magnifier.find('.keyboard-char'),
							magText = magnifier.find('text'),
							lastKey;

					Exp.click(root, function(){
						return false;
					}, true);

					Exp.doubleClick(root, '.keyboard-char', function(){
						var value = $(this).attr('value');
						if(!value)return;
						var l = value.length;
						if(typeof value == 'string' && value.match(/\d/)){
							value -= 0;
						}
						switch(value){
							case 'delete':
								deleteChar();
								break;
							case 'upperCase':
								optRecords.push(1);
								changeBoard('text', 1);
								break;
							case 'lowerCase':
								optRecords.push(0);
								changeBoard('text', 0);
								break;
							case 'prev':
								changeBoard('text', optRecords.prev()||0);
								break;
							case 'mark':
								changeBoard('text', 2);
								break;
							default:
								if(l === 1){
									addChar(value);
								}
								break;
						};
					},false,{touchstart:function(){
						if(lastKey)lastKey.removeClass('simu-magnifier');
						var key = $(this).find('.spot'),
								width = key.width(),
								height = key.height()+3,
								offset = key.position();
						if(!key.size() || !offset || !key.data('magnifier'))return;
						magnifier.show().css({
							left:offset.left-15+4,
							top: offset.top-height-11,
							width: width+30,
							height: height+20
						});
						magContent.attr('d', 'M '+(width+15)+','+(height+20)+' C '+(width+15)+','+(height+10)+','+(width+30)+','+(height+12.5)+','+(width+30)+','+(height-2.5)+' L '+(width+30)+',5 Q '+(width+30)+',0,'+(width+25)+',0 L5,0,Q0,0,0,5 L 0,'+(height-2.5)+' C 0,'+(height+12.5)+',15,'+(height+10)+',15,'+(height+20));
						magText.text(key.text()).attr('x', 15+width/2);
						key.addClass('simu-magnifier');
						lastKey = key;
					},touchend:function(){
						magnifier.hide();
						lastKey = null;
						$(this).find('.spot').removeClass('simu-magnifier');
					}});
					if(options.callback){
						options.callback.call(this, keyboard);
					}
				}
			});
			function input(keyboard, inputValue, value, opt, cursorIndex, change){
				if(options.input){
					options.input.call(keyboard, inputValue, value, opt, cursorIndex, change);
				}
			}
			function addChar(value){
				var index = cursorIndex;
				inputValue = inputValue.substring(0, cursorIndex) + value + inputValue.substring(cursorIndex);
				cursorIndex += (value + '').length;
				input(keyboard, inputValue, value, 'add', index, true);
				return inputValue;
			}
			function deleteChar(){
				var index = cursorIndex, value;
				if(inputValue.length){
					value = inputValue.substr(cursorIndex - 1, cursorIndex);
					inputValue = inputValue.substr(0, cursorIndex - 1)+ inputValue.substring(cursorIndex);
					if(cursorIndex>0){
						cursorIndex -= 1;
					}
				}
				input(keyboard, inputValue, value, 'delete', index, true);
				return inputValue;
			}
			function getKeyboardTemple(type, index){
				var temple = '<div class="keyboard-box {{boardContentClass}}">',
						keyTemple = '{{each list as row i}}'
								+'{{if i>=pageSize*pageIndex && i<pageSize*(pageIndex+1)}}'
								+'<div class="keyboard-row">'
								+'{{each row as item}}'
								+'<div class="keyboard-char {{item.keyClass}}"{{if item.value && (item.clickactive || clickactive)}} data-clickactive {{/if}}value="{{item.value}}" style="{{if item.flex}}flex:{{item.flex}};-webkit-flex: {{item.flex}};-webkit-box-flex:{{item.flex}};{{/if}}{{if item.width}}width:{{item.width}}px;{{/if}}"><div class="spot {{item.charClass}}" style="{{if item.fontSize}}font-size:{{item.fontSize}}px;{{/if}}{{if item.lineHeight}}line-height:{{item.lineHeight}}px;{{/if}}"{{if item.textClickactive}}{{if item.textClickactive === true}} data-clickactive {{else}} data-clickactive="{{item.textClickactive}}" {{/if}}{{/if}}{{if item.magnifier}} data-magnifier="true" {{/if}}>{{item.text}}</div></div>'
								+'{{/each}}'
								+'</div>'
								+'{{/if}}'
								+'{{/each}}',
						keyData = datas[type];
				var winWidth = $(window).width();
				keyData.height = winWidth>640?70:(winWidth/7.5);
				keyData.pageIndex = index || 0;
				template.config("openTag", "{{");
				template.config("closeTag", "}}");
				keyTemple = template.render(keyTemple)(keyData);
				if(options && options.handleKeyTemple){
					keyTemple = options.handleKeyTemple(keyTemple);
				}
				keyTemple = template.render(temple)(keyData) + keyTemple;

				return keyTemple + '</div>';
			}

			function changeBoard(type, index){
				var html = getKeyboardTemple(type, index);
				root.find('.keyboard-box').replaceWith(html);
				//keyboard.resite();
				Exp.clickActive(root);
				var boardClass = datas[type].boardClass;
				if(!boardClass && board.boardClass){
					refresh()
				}
				else if(boardClass != board.boardClass){
					refresh(true);
				}
				function refresh(delay){
					var lastClass = board.boardClass;
					if(delay){
						setTimeout(refreshData, 20);//400
					}
					else{
						refreshData();
					}
					board.boardClass = boardClass;
					function refreshData(){
						if(lastClass){
							root.removeClass(lastClass);
						}
						if(boardClass){
							root.addClass(boardClass);
						}
					}
				}

			}

			$.extend(keyboard,{
				board: board,
				val: function(value){
					var change = false;
					if(typeof value === 'string'){
						if(inputValue !== value)change = true;
						inputValue = value;
						if(change){
							cursorIndex = inputValue.length;
						}
						input(keyboard, inputValue, value, 'reset', cursorIndex, change);
					}
					return inputValue;
				},
				'delete': deleteChar,
				slideIn: function(){
					slideIn = true;
					root.show();
					var rHeight = root.height();
					var height = root.find('.keyboard-box').height();
					root.height(height);
					board.resize();
					board.slideIn({to: height-document.body.scrollTop});
					return this;
				},
				slideOut: function(options){
					slideIn = false;
					board.slideOut(options);
					root.hide();
					return this;
				},
				isSlideIn: function(options){
					return slideIn;
				},
				resite: function(){
					if(slideIn){
						this.slideIn();
					}
					else{
						this.slideOut({persistent:true});
					}
					return this;
				},
				setCursor: function(index){
					cursorIndex = index;
					input(keyboard, inputValue, inputValue, 'reset', index, false);
					return this;
				},
				set: function(input, type, value){
					var i=0, l = arguments.length;
					optRecords.clear();
					while(i<l){
						switch(i){
							case 0:
								options.input = arguments[0];
								break;
							case 1:
								changeBoard(arguments[1]);
								break;
							case 2:
								this.val(arguments[2]);
								break;
						}
						i++;
					}

					return this;
				}
			});

			return keyboard;
		}
	}

	var orginFocus = $.fn.focus,
			orginBlur = $.fn.blur,
			orginTrigger = $.fn.trigger,
			orginOn = $.fn.on,
			orginVal = $.fn.val;

	//对focus和blur功能重写
	$.fn.focus = function(){
		var self = this, args = arguments;
		this.forEach(function(e, i){
			e = $(e);
			var keyboardInput = $(e).prop('exp-keyboardInput');
			if(keyboardInput){
				if(args.length){
					keyboardInput.addEvent('focus', args[0]);
				}
				else{
					keyboardInput.focus();
				}
			}
			else{
				orginFocus.apply(e, e);
			}
		});
		return this;
	}
	$.fn.blur = function(){
		var self = this, args = arguments;
		this.forEach(function(e, i){
			e = $(e);
			var keyboardInput = $(e).prop('exp-keyboardInput');
			if(keyboardInput){
				if(args.length){
					keyboardInput.addEvent('blur', args[0]);
				}
				else{
					keyboardInput.blur();
				}
			}
			else{
				orginBlur.apply(e, args);
			}
		});
		return this;
	}
	$.fn.trigger = function(name){
		var self = this;
		this.forEach(function(e, i){
			e = $(e);
			var keyboardInput = $(e).prop('exp-keyboardInput')
			if(keyboardInput && 'focus blur '.indexOf(name)>=0){
				keyboardInput.fireEvent(name);
			}
			else{
				orginTrigger.call(e, name);
			}
		});
		return this;
	}
	$.fn.on = function(name, callback){
		var keyboardInput = this.prop('exp-keyboardInput')
		if(keyboardInput && 'focus blur '.indexOf(name)>=0){
			keyboardInput.addEvent(name, callback);
		}
		else{
			orginOn.apply(this, arguments);
		}
		return this;
	}
	$.fn.val = function(){
		var keyboardInput = this.prop('exp-keyboardInput');
		if(keyboardInput){
			if(arguments.length){
				if(arguments[1] === true){
					if(this[0]){
						this[0].value = arguments[0];
					}
				}
				else{
					keyboardInput.val(arguments[0]);
				}
				return this;
			}
			else{
				return orginVal.call(this);
			}
		}
		else{
			return orginVal.apply(this, arguments);
		}
	}
	Exp.extend(Exp, keyboard);
})($, template, Exp);