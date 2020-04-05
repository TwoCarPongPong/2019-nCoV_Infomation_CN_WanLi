// 使用腾讯疫情数据接口 请求类型get 返回类型jsonp
// "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5"
$(function() {
	// 获取当前url地址
	let url=window.location.href;
	if(url.indexOf("=")>0){
		let lastProvince=decodeURI(url.split("=")[1]);
		if(typeof(lastProvince)!==undefined){
			$(".topBar .province").text(lastProvince+"疫情");
			$(".topBar .province").attr("href","province.html?province="+lastProvince);
		}
	}
	
	// 阿贾克斯拉取全局数据
	$.ajax({
			async: false,
			type: "get",
			url: "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5",
			contentType: "application/json;charaset=UTF-8",
			dataType: "jsonp",
			success: function(response) {
				if (response.data.length) {
					let data = JSON.parse(response.data);
					// 设置公告
					$.ajax({
						async: false,
						type: "get",
						url: "https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_ww_today_notice",
						contentType: "application/json;charaset=UTF-8",
						dataType: "jsonp",
						success: function(response) {
							let data = JSON.parse(response.data);
							$(".today-notict>span").text(data[0].showNotice);
						}
					})

					// 计算距离现在时间
					let lastDate = new Date(data.lastUpdateTime);
					let nowDate = new Date();
					let fromTime = nowDate - lastDate;
					let timeStr = "";
					fromTime = parseInt(fromTime / 1000);
					if (fromTime >= 60) {
						if (fromTime >= 3600) {
							timeStr = parseInt(fromTime / 3600) + "小时";
							fromTime = fromTime % 3600 / 60;
							if (parseInt(fromTime)) {
								timeStr += parseInt(fromTime) + "分钟";
							}
						} else {
							timeStr = parseInt(fromTime / 60) + "分钟";
						}
					} else {
						timeStr = fromTime + "秒";
					}

					// 设置更新时间
					$(".lastUpdateTime .time").text(data.lastUpdateTime);
					$(".lastUpdateTime .form-time").text(timeStr);
					// 设置一览表数据
					let isShowAdd = data.isShowAdd;
					for (li of $(".data-list li")) {
						// 设置总数据
						let liClass = li.className.split('-')[0];
						li.querySelector(".ChinaTotal").innerHTML = data.chinaTotal[liClass];
						// 判断是否设置新增
						if (isShowAdd) {
							// 设置新增
							let add = data.chinaAdd[liClass];
							add = (add >= 0 ? "+" : "") + add;
							li.querySelector(".ChinaAdd .add").innerHTML = add;
						} else {
							// 隐藏新增span标签
							$(".ChinaAdd").hide()
						}
					}
					// 设置地图基本样式
					var mapStat="现有确诊";
					var myChart = echarts.init(document.getElementsByClassName("map")[0]);
					var chinaoption = {
						tooltip: {
							triggerOn:'click',
							trigger: 'item',
							formatter: function(params, ticket, callback) {
								let name=params.name;
								let series=params.seriesName
								let value=params.value;
								let color=params.color;
								let href="./province.html?province="+name;
								let htmlStr="";
								htmlStr+='<div style="text-align:center;font-size:23px">'+name+'</div>';
								htmlStr+='<div style="text-align:center;font-size:22px;margin-bottom:10px">'+mapStat+':'+value+'</div>'
								htmlStr+='<div style="text-align:center;font-size:22px;border-top:1px soild rgba(255,255,255,.8);border-top: 1px solid #d5d5d5;width:100%;"><a style="text-decoration:none;color:#fff" href='+href+'>详情</a></div>'
							return htmlStr;	
							},
							textStyle: {
								fontSize: 22,
							},
							padding:[10,20,10,20]
						},
						visualMap: [{
							type: "piecewise",
							show: true,
							pieces: [{
									min: 10000,
									symbol: "rect",
								},
								{
									min: 1000,
									max: 9999,
									symbol: "rect",
								},
								{
									min: 500,
									max: 999,
									symbol: "rect",
								},
								{
									min: 100,
									max: 499,
									symbol: "rect",
								},
								{
									min: 50,
									max: 99,
									symbol: "rect",
								},
								{
									min: 10,
									max: 49,
									symbol: "rect",
								},
								{
									min: 1,
									max: 9,
									symbol: "rect",
								},
								{
									min: 0,
									max: 0,
									symbol: "rect",
								},
							],
							inRange: {
								color: ['#e2ebf4', '#ffe7b8', '#ffdab3', '#ffc89e', '#ffaa80', '#ff704f', '#f04141', '#cc1e1e'],
								// symbolSize: [12, 32]
							},
							left: 25,
							bottom: 20,
							itemWidth: 15,
							itemHeight: 28,
							itemGap: 0,
							// itemSymbol:"rect",
						}],
						series: [{
							name: '中国',
							type: 'map',
							mapType: 'china',
							selectedMode: 'single',
							roam: false,
							hoverable: false,
							label: {
								normal: {
									show: true,
									textStyle: {
										fontSize: 15,
										color: "#444444",
									}
								},
								emphasis: {
									show: true,
								}
							},
							itemStyle: {
								normal: {
									borderColor: '#b6b6b6',
									borderWidth: 1,
								},
							},
							data: [],
							zoom: 1.2,
						}],
					};

					// 设置地图数据
					var setMap = function(stat) {
						// 清空地图data
						chinaoption.series[0].data = [];
						for (var i = 0, len = data.areaTree[0].children.length; i < len; i++) {
							var cityData = {
								name: data.areaTree[0].children[i].name,
								value: data.areaTree[0].children[i].total[stat],
							};
							chinaoption.series[0].data.push(cityData);
						}
						myChart.setOption(chinaoption, true);
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
					
					// 设置中国疫情列表数据
					let areaTreeChildren = data.areaTree[0].children;
					// 遍历中国疫情列表
					// let chinaList=$(".china-list");
					for (province of areaTreeChildren) {
						let trStr = "";
						trStr = '<tbody><tr class="areaBox" onclick="toggleTr()">';
						trStr += '<th class="area">' + province.name + '</th>';
						trStr += '<td>' + province.total.nowConfirm + '</td>';
						trStr += '<td>' + province.total.confirm + '</td>';
						trStr += '<td>' + province.total.heal + '</td>';
						trStr += '<td>' + province.total.dead + '</td>';
						trStr += '<td><a href="./province.html?province=' + province.name + '">详情</a></td></tr>';
						for (city of province.children) {
							trStr += '<tr>';
							trStr += '<th class="area">' + city.name + '</th>';
							trStr += '<td>' + city.total.nowConfirm + '</td>';
							trStr += '<td>' + city.total.confirm + '</td>';
							trStr += '<td>' + city.total.heal + '</td>';
							trStr += '<td>' + city.total.dead + '</td>';
							trStr += '<td></td></tr>';
						}
						trStr += "</tbody>";
						$(".china-list").append(trStr);
					}
				}
			}
		})
})
// 地区列表的显示点击事件
var toggleTr = function() {
	$(event.target.parentNode).toggleClass("current");
}