window.onload = function() {
	// 设置图表-全国
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
	$(".china-charts-box .HAD-chart-button").click(function() {
		removeActive();
		$(this).addClass("active");
		$(".china-charts-box>ul>li:first").css("margin-left", "-1342px");
	});

	// 初始化图表
	let chinaCharts = echarts.init($('.china-charts-box .line-chart')[0]);
	let CASAIChart = echarts.init($('.CASAI-chart-box .line-chart')[0]);
	let HADChart = echarts.init($('.HAD-chart-box .line-chart')[0]);
	// 配置图表信息
	let colorDic={
		"新增确诊":"#f06061","新增疑似":"#ffd661",
		"累计确诊":"#980a0e","现有确诊":"#ff7b7c",
		"现有疑似":"#ffd661","现有重症":"#cd73bf",
		"累计治愈":"#65b379","累计死亡":"#878787"
	}
	let chinaChartsOption = {
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
					htmlStr +='<span style="margin-right:5px;display:block;width:20px;background-color:'+color+';"></span>';
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
				name: '新增疑似',
				type: 'line',
				// smooth: true,
				symbol: 'circle', //设定为实心点
				symbolSize: 8, //设定实心点的大小
				data: [],
				lineStyle: {
					color: "#FFF661",
					width: 5,
				},
				itemStyle: {
					borderWidth: 1,
					color: "#FFF",
					borderColor: "#FFF661"
				}
			}
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
					htmlStr +='<span style="margin-right:5px;display:block;width:20px;background-color:'+color+';"></span>';
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
				name: '现有疑似',
				type: 'line',
				// smooth: true,
				symbol: 'circle', //设定为实心点
				symbolSize: 8, //设定实心点的大小
				data: [],
				lineStyle: {
					color: "#FFD661",
					width: 5,
				},
				itemStyle: {
					borderWidth: 1,
					color: "#FFF",
					borderColor: "#FFD661"
				}
			},
			{
				name: '现有重症',
				type: 'line',
				// smooth: true,
				symbol: 'circle', //设定为实心点
				symbolSize: 8, //设定实心点的大小
				data: [],
				lineStyle: {
					color: "#CD73BF",
					width: 5,
				},
				itemStyle: {
					borderWidth: 1,
					color: "#FFF",
					borderColor: "#CD73BF"
				}
			}
		]
	};
	let HADChartOption = {
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
					htmlStr +='<span style="margin-right:5px;display:block;width:20px;background-color:'+color+';"></span>';
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
				name: '累计治愈',
				type: 'line',
				// smooth: true,
				symbol: 'circle', //设定为实心点
				symbolSize: 8, //设定实心点的大小
				data: [],
				lineStyle: {
					color: "#65B379",
					width: 5,
				},
				itemStyle: {
					borderWidth: 1,
					color: "#FFF",
					borderColor: "#65B379"
				}
			},
			{
				name: '累计死亡',
				type: 'line',
				// smooth: true,
				symbol: 'circle', //设定为实心点
				symbolSize: 8,
				data: [],
				lineStyle: {
					width: 5,
					color: "#87878B",
				},
				itemStyle: {
					borderWidth: 1,
					color: "#FFF",
					borderColor: "#87878B",
				}
			}
		]
	};
	// 拿到图表数据
	$.getJSON("https://view.inews.qq.com/g2/getOnsInfo?name=disease_other&callback=?", function(response) {
		let data = JSON.parse(response.data);
		console.log(data);
		// 设置新增确诊和新增疑似表数据
		let chinaDayAddList = data.chinaDayAddList;
		for (day of chinaDayAddList) {
			chinaChartsOption.xAxis.data.push(day.date);
			for (serie of chinaChartsOption.series) {
				if (serie.name == '新增确诊') {
					serie.data.push(day.confirm);
				} else {
					serie.data.push(day.suspect);
				}
			}
		}
		// 设置累计确诊和现有确诊和现有疑似和现有重症表
		// 设置累计治愈和累计死亡表
		let chinaDayList = data.chinaDayList;
		for (day of chinaDayList) {
			CASAIChartOption.xAxis.data.push(day.date);
			// 累计确诊和现有确诊和现有疑似和现有重症表
			for (serie of CASAIChartOption.series) {
				if (serie.name == '累计确诊') {
					serie.data.push(day.confirm);
				} else if (serie.name == '现有确诊') {
					serie.data.push(day.nowConfirm);
				} else if (serie.name == '现有疑似') {
					serie.data.push(day.suspect);
				} else if (serie.name == '现有重症') {
					serie.data.push(day.nowSevere);
				}
			}
			// 累计治愈和累计死亡表
			HADChartOption.xAxis.data.push(day.date);
			for (serie of HADChartOption.series) {
				if (serie.name == '累计治愈') {
					serie.data.push(day.heal);
				} else {
					serie.data.push(day.dead);
				}
			}
		}
		// 绘制图表
		chinaCharts.setOption(chinaChartsOption);
		CASAIChart.setOption(CASAIChartOption);
		HADChart.setOption(HADChartOption);
	});

}
