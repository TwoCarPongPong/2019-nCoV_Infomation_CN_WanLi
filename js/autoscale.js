function suofang() {
		    var num = 750;//网页主体内容所占宽度>>>需改	
		    var oWidth = window.screen.width;//获取当前手机屏幕宽度
		    rate = oWidth / num;//缩放比例 = 当前手机屏幕宽度/css中固定的网页宽度
			//创建meta
			t=document.getElementsByTagName('meta')[name="viewport"];
			if(t===undefined)
			{
				var head = document.getElementsByTagName('head')[0];
				var metaTag = document.createElement('meta');
				metaTag.setAttribute('name','viewport');
				metaTag.setAttribute('content','');
				head.appendChild(metaTag);
			}
			if (oWidth < 1920) {
				document.getElementsByTagName('meta')[name="viewport"].content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,initial-scale="+rate+",user-scalable=no";//修改meta的属性
			}
		};
suofang();