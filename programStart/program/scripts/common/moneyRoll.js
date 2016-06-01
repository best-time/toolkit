var moneyRoll = {
	numberUp:function(content,cvalue,cwidth,type){
		if(cvalue<1){
			
			content.siblings('p').html(cvalue);
			content.remove();
			return;
		}
		if(type != 'random'){
		 var arr= cvalue+'';
		 content.width((arr.length-0.5)*cwidth);
		 var left = ($(document).width()-(arr.length-0.5)*cwidth)/2;
		 content.css('left',left);
		 var dotindex =99999999999;
         var height =content.height();
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i]=='.')
                {
                    var dot=arr.length-1-i;
					var ss= cwidth/2;
					dotindex = i-1;
                 	content.append('<span class="dot" style="left:'+ (i*cwidth) +'px;width:'+ss+'px">.</span>');
                    arr=cvalue*Math.pow(10,dot) +'';
                }
                if(i == arr.length-1){				
					moneyroll(arr);
                }
           } 
		}else{
			var arr= cvalue*100+'';
		 	content.width((arr.length+0.8)*cwidth);
			var left = ($(document).width()-(arr.length+0.8)*cwidth)/2-$('body').offset().left;
		 	content.css('left',left);
			moneyroll1(arr);
		}
		  function moneyroll1(arr){
			var obg = arr;
			var size = obg.length;
			var outbox = content;
			var j=0;
			var ulhtml= '<ul class="Moneyroll1" style="width:'+(arr.length+0.8)*cwidth +'px"></ul>';
			$('.money1 p').remove();
			outbox.append(ulhtml);
			goscroll(obg);
			
			}
			
			function goscroll(obg){
				var number = obg[0]-0;
				var number1=parseInt(Math.random()*10,10);
				if(number1%2 == 0){number1+=1}
				if(number1>9){number1 =9;}
				if(number1<6){number1 =6;}
				var leftvalue =obg.substr(1,obg.length-1);
				var self= $('.Moneyroll1');
				for(var g= 0;g<number1+1;g++) {
					if(g== number1){
						var obg =obg.substr(0,obg.length-2)+'.'+obg.substr(obg.length-2,2);
						self.append('<li>'+obg+'</li>');
						var transY= (self.find('li').length-1)*content.height();
						if(transY == 0){
							content.html(cvalue);
						}else{
							self.css('transform','translateY('+(-transY)+'px)');
							self.css('-webkit-transform','translateY('+(-transY)+'px)');
							setTimeout(function(){
								content.html(cvalue);
								
							},1200);
						}
					}else{
						
						var text =Math.floor(number/number1*g)+'';
						var text1= Math.floor((obg-0)/number1*g)+Math.pow(10,leftvalue.length)+'';
						text1 =text1.substr(0,text1.length-2)+'.'+text1.substr(text1.length-2,2);
						if(text1.substr(0,1)-1 > text-0){
							text= (text1.substr(0,1)-1)+'';
						}
						text = text+text1.substr(1,obg.length);
						self.append('<li>'+text+'</li>');
					}
				
			};	
		}
		function moneyroll(arr){
			var obg = arr;
			var size = obg.length;
			var outbox = content;
			var j=0;
			var ulhtml= '<ul class="Moneyroll" data-number="0" style="width'+cwidth +'"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>';
			var ulhtml= '<ul class="Moneyroll" data-number="0"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>';
			for(var i=0;i<size+1;i++)
			{
				if(j==size){
                    
					goscroll(obg);

				}else{
					content.siblings('p').remove();
					outbox.append(ulhtml);
                    outbox.find('li').width(cwidth);
                     outbox.find('li').height(content.height());
					j++;
				}
			}
			function goscroll(obg){
				var obg = obg;
				$('.Moneyroll').each(function(index, element) {
					var self = $(this);
					self.css('height',height);
					self.css('width',cwidth);
					
					
					var transZ = self.height()/ 2 / Math.tan((36 / 2 / 180) * Math.PI);
					
					var left = self.width()*index + 'px';
					if(index > dotindex ){
						left = self.width()*index +self.width()/2+ 'px';
					}
					self.css('left',left);
					self.find('li').each(function(index, element) {
						var liself = $(this);
						liself.css('transform','rotateX('+36*index+'deg) translateZ('+transZ+'px)');liself.css('-webkit-transform','rotateX('+36*index+'deg) translateZ('+transZ+'px)');
						liself.text((10-index)%10);
					});
					if(index == $('.Moneyroll').length -1){
						setTimeout(function(){
							goup(obg);
						},100);
					}
				});
				function speed(obg){
					var length = obg.length-1;
					for(i= 10;i > 1;i--){
						if(Math.pow(i,length) < 2 ){
							return i;
						}
					}
					return 1;		
				}
				function  goup(obg){
					var arr = new Array(obg.length);
					for (var i=obg.length-1;i>-2;i--)
					{	
							
							if(i == -1){
									 $('.Moneyroll').each(function(index, element) {
											var self =$(this); 
											 //setTimeout(function(){
													var time = 1000;
													self.addClass('Moneylast1');
													self.css('-webkit-transition','-webkit-transform '+time+'ms cubic-bezier(0.06, 0.57, 0, 0.99)');
													self.css('transition','transform '+time+'ms cubic-bezier(0.06, 0.57, 0, 0.99)');
													var rolls = arr[index];
											  		self.css('-webkit-transform', 'rotateX('+ rolls +'deg)');
													self.css('transform', 'rotateX('+ rolls +'deg)');
													
													if(index == obg.length-1){
														var html =$('.Moneywrap').html()
													}
											   
											 //},((index)*100*obg.length)/obg.length);
											 
									});
									
							}else{
								var number = obg[i];
							arr[i]=realup(i,number,obg.length);
	
							}
					}
				}
				function  realup(i,number,length){
					var active = $('.Moneyroll').eq(i);
					var now= active.data('number');
					var reg = /\((?:[\s,]*([-\d\.]+)[px\s]*)?(?:[\s,]*([-\d\.]+)[px\s]*)?(?:[\s,]*([-\d\.]+)[px\s]*)?/g;
					var axises = reg.exec(active.css('-webkit-transform'));
					var olddeg = parseFloat(axises&&axises[1] || 0);
					var n = speed(obg);
					if(olddeg %2 != 0){olddeg= olddeg-1;}
					if(i >0)
					{
						if(n >1)
						{olddeg = olddeg + 36*(number-now)+Math.pow(n,i)*360;}
						else{
							if(length >2){length=2}
							 olddeg = olddeg + 36*(number-now)+360;   
						}
					}
					else{
					olddeg = olddeg + 36*(number-now)+360;	
					}
					
					return olddeg;
				}
			}
				
			}
		
		}
};
