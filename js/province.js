window.onload = function() {
	if (province) {
		let provinceName = provinceDic[province];
		// 设置全部标签该省名称
		$("span.provinceName").text(province);
		// 设置顶部导航栏
		$(".topBar span.provinceName").text(province);
		$(".topBar .china").attr("href","index.html?lastProvince="+province);
		// 定义是否显示增加
		var isShowAdd = true;
		// 全局数据接口
		$.getJSON("https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5&callback=?", function(response) {
			if (response.ret == 0) {
				let data = JSON.parse(response.data);
				console.log(data);
				// 设置更新时间
				$(".lastUpdateTime .time").text(data.lastUpdateTime);
				// 设置一览表数据——总
				isShowAdd = data.isShowAdd;
				for (provinceTotal of data.areaTree[0].children) {
					if (provinceTotal.name == province) {
						for (li of $(".data-list li")) {
							let liClass = li.className.split('-')[0];
							li.querySelector(".ChinaTotal").innerHTML = provinceTotal.total[liClass];
						}
					}
				}
				// 设置地图基本样式
				var mapStat="现有确诊";
				let map = echarts.init($(".map")[0]);
				provinceOptions = {
					tooltip: {
						triggerOn:'click',
						trigger: 'item',
						formatter: function(params, ticket, callback) {
							console.log(params);
							let name=params.name;
							let value=params.value;
							let color=params.color;
							let href="./province.html?province="+name;
							let htmlStr="";
							htmlStr+='<div style="text-align:center;font-size:23px">'+name+'</div>';
							htmlStr+='<div style="text-align:center;font-size:22px;margin-bottom:10px">现有确诊:'+value+'</div>'
						return htmlStr;	
						},
						textStyle: {
							fontSize: 22,
						},
						padding:[10,20,10,20]
					},
					visualMap: [{
						type: "piecewise",
						show: false,
						pieces: [{
								min: 10000,
							},
							{
								min: 1000,
								max: 9999,
							},
							{
								min: 500,
								max: 999,
							},
							{
								min: 100,
								max: 499,
							},
							{
								min: 50,
								max: 99,
							},
							{
								min: 10,
								max: 49,
							},
							{
								min: 1,
								max: 9,
							},
							{
								min: 0,
								max: 0,
							},
						],
						inRange: {
							color: ['#e2ebf4', '#ffe7b8', '#ffdab3', '#ffc89e', '#ffaa80', '#ff704f', '#f04141', '#cc1e1e'],
							// symbolSize: [12, 32]
						},
					}],
					series: [{
						name: '中国',
						type: 'map',
						mapType: province,
						selectedMode: 'single',
						roam: false,
						label: {
							normal: {
								show: true,
								textStyle: {
									fontSize: 17,
									color: "#444444",
								}
							},
							emphasis: {
								show: true
							}
						},
						data: [],
						zoom: 1.2,
					}],
				};

				// 设置地图数据
				var setMap = function(stat) {
					// 清空地图data
					provinceOptions.series[0].data = [];
					for (pd of data.areaTree[0].children) {
						if (pd.name == province) {
							for (cd of pd.children) {
								var cityData = {
									name: cd.name,
									value: cd.total[stat],
								};
								provinceOptions.series[0].data.push(cityData);
							}
						}
					}
					map.setOption(provinceOptions, true);
				}
				setMap("nowConfirm");
				// 绑定切换地图事件
				$(".switchConfirm").click(function() {
					// 切换样式
					$(this).toggleClass("active");
					// 更改数据
					if ($(this).hasClass("active")) {
						mapStat="现有确诊";
						setMap("nowConfirm");
					} else {
						mapStat="累计确诊";
						setMap("confirm");
					}
				})
				
				// 遍历中国疫情列表
				let areaTreeChildren = data.areaTree[0].children;
				for(let i=0,len=areaTreeChildren.length;i<len;i++){
					if(areaTreeChildren[i].name==province){
							let trStr="<tbody>"
							for (city of areaTreeChildren[i].children) {
								trStr += '<tr>';
								trStr += '<th class="area">' + city.name + '</th>';
								trStr += '<td>' + city.total.nowConfirm + '</td>';
								trStr += '<td>' + city.total.confirm + '</td>';
								trStr += '<td>' + city.total.heal + '</td>';
								trStr += '<td>' + city.total.dead + '</td>';
							}
							trStr += "</tbody>";
							$(".china-list").append(trStr);
							break;
					}	
				}
			}		
		})
		// 全局OTH数据接口
		$.getJSON("https://view.inews.qq.com/g2/getOnsInfo?name=disease_other&callback=?", function(response) {
			if (response.ret == 0) {
				let data = JSON.parse(response.data);
				// 设置一览表数据——新增
				// 判断是否设置
				if (isShowAdd) {
					for (li of $(".data-list li")) {
						let liClass = li.className.split('-')[0];
						if (liClass == "confirm") {
							liClass += "Add";
						}
						let add = data.provinceCompare[province][liClass];
						add = (add >= 0 ? "+" : "") + add;
						li.querySelector(".ChinaAdd .add").innerHTML = add;
					}
				} else {
					// 隐藏新增span标签
					$(".ChinaAdd").hide()
				}
			}
		})
		
		// 设置图表-省
		// 图表切换按钮绑定事件
		function removeActive() {
			$(".china-charts-box .button-box .active").removeClass("active");
		}
		$(".china-charts-box .add-chart-button").click(function() {
			removeActive();
			$(this).addClass("active");
			$(".china-charts-box>ul>li:first").css("margin-left", "42px");
		});
		$(".china-charts-box .CASAI-chart-button").click(function() {
			removeActive();
			$(this).addClass("active");
			$(".china-charts-box>ul>li:first").css("margin-left", "-650px");
		});
		// 初始化图表
		let provinceCharts = echarts.init($('.china-charts-box .line-chart')[0]);
		let CASAIChart = echarts.init($('.CASAI-chart-box .line-chart')[0]);
		// 配置图表信息
		let colorDic={
			"新增确诊":"#f06061","新增死亡":"#878787",
			"新增治愈":"#65b379","累计治愈":"#65b379",
			"累计确诊":"#980a0e","现有确诊":"#ff7b7c",
			"累计死亡":"#878787",
		}
		let provinceChartsOption = {
			tooltip: {
				trigger: 'axis',
				formatter: function(params, ticket, callback) {
					var htmlStr = '';
					for (var i = 0,len=params.length;i<len;i++) {
						var param = params[i];
						var name = param.seriesName;
						var data= param.name;
						var value = param.value; 
						var color = colorDic[name]; 
						if (i === 0) {
							htmlStr +='<div style="font-size:20px">'+data+'</div>';
						}
						htmlStr += '<div style="display:flex;align-items:center;font-size:20px">';
						htmlStr +='<span style="margin-right:10px;display:block;width:20px;line-height:20px;background-color:'+color+';color:'+color+';">1</span>';
						htmlStr += name + ':' + value + '人';
						htmlStr += '</div>';
					}
					return htmlStr;
				}
			},
			xAxis: {
				type: 'category',
				data: [],
				axisLabel: {
					textStyle: {
						fontSize: 14
					},
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					textStyle: {
						fontSize: 14
					},
				}
			},
			grid: {
				left: 0,
				right: 20,
				top: 15,
				bottom: 5,
				containLabel: true,
			},
			series: [{
					name: '新增确诊',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
		
					data: [],
					lineStyle: {
						color: "#F06061",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#F06061"
					}
				},
				{
					name: '新增治愈',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
					data: [],
					lineStyle: {
						color: "#65b379",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#65b379"
					}
				},
				{
					name: '新增死亡',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
					data: [],
					lineStyle: {
						color: "#878787",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#878787"
					}
				},
			]
		};
		let CASAIChartOption = {
			tooltip: {
				trigger: 'axis',
				formatter: function(params, ticket, callback) {
					var htmlStr = '';
					for (var i = 0,len=params.length;i<len;i++) {
						var param = params[i];
						var name = param.seriesName;
						var data= param.name;
						var value = param.value; 
						var color = colorDic[name]; //图例颜色
						if (i === 0) {
							htmlStr +='<div style="font-size:20px">'+data+'</div>';
						}
						htmlStr += '<div style="display:flex;align-items:center;font-size:20px">';
						//为了保证和原来的效果一样，这里自己实现了一个点的效果
						htmlStr +='<span style="margin-right:10px;display:block;width:20px;line-height:20px;background-color:'+color+';color:'+color+';">1</span>';
						//圆点后面显示的文本
						htmlStr += name + ':' + value + '人';
						htmlStr += '</div>';
					}
					return htmlStr;
				}
			},
			xAxis: {
				type: 'category',
				data: [],
				axisLabel: {
					textStyle: {
						fontSize: 14
					},
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					textStyle: {
						fontSize: 14
					},
				}
			},
			grid: {
				left: 0,
				right: 20,
				top: 15,
				bottom: 5,
				containLabel: true,
			},
			series: [{
					name: '累计确诊',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
					data: [],
					lineStyle: {
						color: "#980a0e",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#980a0e"
					}
				},
				{
					name: '现有确诊',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
					data: [],
					lineStyle: {
						color: "#FF7B7C",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#FF7B7C"
					}
				},
				{
					name: '累计治愈',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
					data: [],
					lineStyle: {
						color: "#65b379",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#65b379"
					}
				},
				{
					name: '累计死亡',
					type: 'line',
					// smooth: true,
					symbol: 'circle', //设定为实心点
					symbolSize: 8, //设定实心点的大小
					data: [],
					lineStyle: {
						color: "#878787",
						width: 5,
					},
					itemStyle: {
						borderWidth: 1,
						color: "#FFF",
						borderColor: "#878787"
					}
				}
			]
		};
		// // 省数据接口
		$.getJSON("https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?province=" + province, function(response) {
			let data = response.data;
			console.log(data);
			for (day of data) {
				// 设置新增表
				provinceChartsOption.xAxis.data.push(day.date);
				for (serie of provinceChartsOption.series) {
					if (serie.name == '新增确诊') {
						serie.data.push(day.newConfirm);
					} else if (serie.name == '新增治愈') {
						serie.data.push(day.newHeal);
					} else if (serie.name == '新增死亡') {
						serie.data.push(day.newDead);
					}
				}
				// 设置累计表
				CASAIChartOption.xAxis.data.push(day.date);
				for (serie of CASAIChartOption.series) {
					if(serie.name == '现有确诊'){
						serie.data.push(day.confirm-day.dead-day.heal);
					}else if (serie.name == '累计确诊') {
						serie.data.push(day.confirm);
					} else if (serie.name == '累计治愈') {
						serie.data.push(day.heal);
					} else if (serie.name == '累计死亡') {
						serie.data.push(day.dead);
					}
				}
				provinceCharts.setOption(provinceChartsOption,true)
				CASAIChart.setOption(CASAIChartOption,true)
			}
		})
		
	}
}
