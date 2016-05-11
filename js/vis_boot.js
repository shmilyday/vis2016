/*
author nik
2016.5.10
*/

/*object*/
//页面对象
var page = [];
//图表对象
function chart(){
	this.id = "",
	this.data = "",
	this.xava = [],
	this.yava = [],
	this.option = {
			title: {
                text: ''
            },
            tooltip: {},
            toolbox: {
			show: false,
			feature: {
				mark: {
					show: false
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		dataZoom: {
			show: false,
			start: 0,
		},
            legend: {
                data:[]
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: [{
                name: '',
                type: 'line',
                data: [],
                markPoint: {
				data: [{
					type: 'max',
					name: '最大值'
				}, {
						type: 'min',
						name: '最小值'
					}]
			},
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
            }]
    }
}
//当前操作的图表id
var nowId = "";
//可分配的id计数
var iid = 1;
//页面中存在的图标的id数组
var ids = [];

/*dom*/
//创建按钮
var initBtn = $("#initBtn");
//输入数据浮层
var addDataModal = $("#addDataModal");
//json输入框
var inputJson = $("#inputJson");
//json的校验框
var checkJson = $("#checkJson");
//ajax输入框
var inputAjax = $("#inputAjax");
//ajax校验框
var checkAjax = $("#checkAjax");
//当前访问的输入框
var nowDataInput = inputJson;
//当前应当进行的数据判定方法
var nowDataCheckMethod = isJson;
//下一步按钮
var nextBtn = $("#nextBtn");
//选择坐标轴浮层
var chooseXYModal = $("#chooseXYModal");
//x轴包裹层
var xWraper = $("#xWraper");
//y轴包裹层
var yWraper = $("#yWraper");
//初始化图表完成按钮
var initDoneBtn = $("#initDoneBtn");
//图表区域
var chartArea = $("#chartArea");
//高级设置浮层
var superSettingModal = $("#superSettingModal");
//高级设置完成按钮
var superSetDoneBtn = $("#superSetDoneBtn");
//高级设置里的输入框
var titleName = $("#inputTitle");
var xName = $("#inputXAxis");
var yName = $("#inputYAxis");
var dataZoomOp = $("#inputDataZoom");
var toolboxOp = $("#inputToolbox");
var serLineOp = $("#inputTypeLine");

/* process */
//初始化一个图表对象
function initAChart(){
	var newChart = new chart();
	nowId = iid+"";
	newChart.id = nowId;
	page[nowId] = newChart;
	iid ++;
}
//将数据进行处理并存储
function saveData(position){
	if(isAjax(position)){
		$.get(ajaxUrl).done(function (data) {
			page[nowId].data = $.parseJSON(data)[0]["data"];
			renderXY();
		});
	}else if(isJson(position)){
		page[nowId].data = $.parseJSON(position.val())[0]["data"];
		renderXY();
	}
}
//读取数据中横纵轴的可能取值并渲染
function renderXY(){
	var htmlx = "";
	var htmly = "";
	for(key in page[nowId].data[0]) {
		htmlx += "<label for=\"x_"+key+"\" class=\"col-sm-3\"><input type=\"radio\" id=\"x_"+key+"\" name=\"xRadio\" value=\""+key+"\">"+key+"</label>";
		htmly += "<label for=\"y_"+key+"\" class=\"col-sm-3\"><input type=\"radio\" id=\"y_"+key+"\" name=\"yRadio\" value=\""+key+"\">"+key+"</label>";
	}
	xWraper.html(htmlx);
	yWraper.html(htmly);
}
//选择xy，并绘制
function chooseXY(){
	var checkedX = $("#xWraper input:checked").val();
	var checkedY = $("#yWraper input:checked").val();
	if(checkedX != checkedY){
		$("#checkXY").hide();
		setEchartsOp(checkedX,checkedY);
		ids.push(nowId);
		setPage();
		chooseXYModal.modal('hide');
	}else{
		$("#checkXY").show();
	}
}
//设置Echarts的Option
function setEchartsOp(x,y){
	page[nowId].option.xAxis.data = handelData(x,y).x;
	page[nowId].option.xAxis.name = x;
	page[nowId].option.series[0].data = handelData(x,y).y;
	page[nowId].option.yAxis.name = y;
}
//将json对象里的数据分离提取
function handelData(x1,y1){
   var x = [];
    var y = [];
    var size = page[nowId].data.length;
    for(var i = 0;i < size;i ++){
        for(key in page[nowId].data[i]){
            if(key == x1)
            	x[i] = page[nowId].data[size - i - 1][key];
            if(key == y1)             
                y[i] = page[nowId].data[size - i - 1][key];
        }
    }	
    return {
        x : x,
        y : y
    }
}
//配置页面
function setPage(){
	var renderHtml = "";
	for(key in ids){
		renderHtml += "<div class=\"btn-group col-md-3 col-md-offset-8\" role=\"group\"><button type=\"button\" class=\"btn btn-primary\" title=\"再次创建一个相同的图表\" value=\""+ids[key]+"\" name=\"repeatInitBtn\">重复创建</button><button type=\"button\" class=\"btn btn-info\" title=\"给图表增加些高级功能\" value=\""+ids[key]+"\" name=\"superSetBtn\">高级设置</button><button type=\"button\" class=\"btn btn-danger\" title=\"删除该图表\" value=\""+ids[key]+"\" name=\"deleteChartBtn\">删除图表</button></div><div class=\"col-md-12 chart-self\" id=\"chartSelf"+ids[key]+"\"></div>";		
	}
	chartArea.html(renderHtml);
	for(key in ids){
		echarts.init(document.getElementById("chartSelf"+ids[key])).setOption(page[ids[key]].option);
	}
}
//配置图表
function setChart(){
	echarts.init(document.getElementById("chartSelf"+nowId)).setOption(page[nowId].option);
}
//修改高级配置
function addSuperOption(){
	page[nowId].option.title.text = $.trim(titleName.val());
	page[nowId].option.xAxis.name = $.trim(xName.val());
	page[nowId].option.yAxis.name = $.trim(yName.val());
	page[nowId].option.dataZoom.show = dataZoomOp.is(":checked");
	page[nowId].option.toolbox.show = toolboxOp.is(":checked");
	if(serLineOp.is(":checked")){
		page[nowId].option.series[0].type = 'line';
	}else{
		page[nowId].option.series[0].type = 'bar';
	}
	setChart();
}
/*数据验证*/
//判断表单是否为空
function inputIsNull(position){
	var inp = $.trim(position.val());
	if(inp == null || inp == ""){
		return true;
	}else{
		return false;
	}
	
}
//判断数据格式是否为json
function isJson(position){
	var jsonData = $.trim(position.val());
	var exp = /^[\],:{}\s]*$/;
	return exp.test(jsonData.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")  
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")  
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ""));

}
//判断数据格式是否为ajax
function isAjax(position){
	ajaxUrl = $.trim(position.val());
	var exp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	return exp.test(ajaxUrl);
}

/*事件绑定*/
initBtn.on("click",function(){
	addDataModal.modal('show');
	initAChart();
})
inputJson.on("focus",function(){
	// inputAjax.val() = "";
	checkAjax.hide();
	nowDataInput = inputJson;
	nowDataCheckMethod = isJson;
	checkJson.html("请输入json格式的数据，例如：[{\"data\":[{\"num\":16,\"day\":\"20150811\"},{\"num\":180,\"day\":\"20150810\"},{\"num\":44,\"day\":\"20150809\"}]}]");
	checkJson.show();
})
inputAjax.on("focus",function(){
	// inputJson.val() = "";
	checkJson.hide();
	nowDataInput = inputAjax;
	nowDataCheckMethod = isAjax;
	checkAjax.html("请输入ajax请求，例如：http://probe.escience.cn/probe/api/stats/cstcloud/cstcloud?day=30");
	checkAjax.show();
})
nextBtn.on("click",function(){
	if(!inputIsNull(nowDataInput)){
		if(nowDataCheckMethod(nowDataInput)){
			nowDataInput.parent().removeClass("has-error");
			nowDataInput.parent().addClass("has-success");
			saveData(nowDataInput);
			addDataModal.modal('hide');
			chooseXYModal.modal('show');
		}else{
			nowDataInput.parent().addClass("has-error");
			nowDataInput.next().html("数据格式错误！");
		}
	}else{
		nowDataInput.parent().addClass("has-error");
		nowDataInput.next().html("数据不能为空！");
	}
	
})
initDoneBtn.on("click",function(){
	chooseXY();
})
chartArea.on("click","button[name^=repeatInitBtn]",function(){
	initAChart();
	page[nowId] = page[$(event.target).val()];
	ids.push(nowId);
	setPage();
})
chartArea.on("click","button[name^=superSetBtn]",function(event){
	nowId = $(event.target).val();
	superSettingModal.modal('show');
})
chartArea.on("click","button[name^=deleteChartBtn]",function(){
	var delId = $(event.target).val();
	page[delId] = {};
	var index = 0;
	for(key in ids){
		if(ids[key] == delId){
			index = key;
		}
	}
	ids.splice(index,1);
	setPage();
})
superSetDoneBtn.on("click",function(){
	addSuperOption();
	superSettingModal.modal('hide');
})