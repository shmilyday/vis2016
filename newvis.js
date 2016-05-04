//图表对象
function chart(){
	this.id = "";
	this.data = "",
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
//图表数组
var myCharts = [];
var iid = 1;
var nowId = "";
//dom
//dom元素
var chartArea = $("#chartArea");
var dataInput = $("#data");
var dataBtn = $("#btn_data");
var ajaxInput = $("#ajax");
var ajaxBtn = $("#btn_ajax");
var ajaxUrl = "";
var xyBtn = $("#btn_xy");
var xWraper = $("#wraper_x");
var yWraper = $("#wraper_y");
var fileInput = $("#local_file");
var fileBtn = $("#btn_file");
var optBtn = $("#btn_opt");
var titleName = $("#title_name");
var xName = $("#x_name");
var yName = $("#y_name");
var dataZoomOp = $("#data_zoom");
var toolboxOp = $("#toolbox");
var serLineOp = $("#ser_line");
var addBtn = $("#btn_add");
var delBtn = $("#btn_del");
var aditBtn = $("#btn_adit");
/* process */
//初始化一个图表对象
function initAChart(){
	var newChart = new chart();
	nowId = iid+"";
	newChart.id = nowId;
	myCharts[nowId] = newChart;
	var html = "<div id=\"nowChartWraper"+nowId+"\"><div><span><input type=\"radio\" name=\"nowChart\" class=\"nowCharts\" id=\"nowChart"+nowId+"\"></div><div class=\"table\" id=\"chart"+nowId+"\"></div></div>";
	chartArea.append(html);
	iid ++;
}
//删除一个图表对象
function deleteAChart(){
	setNowId();
	if(nowId != ""){
		$($("#nowChartWraper"+nowId+"")[0]).remove();
	}
	nowId = "";
}
//输入数据
function addData() {
	if(!inputIsNull(dataInput)){
		myCharts[nowId].data = $.parseJSON(dataInput.val())[0]["data"];
		renderXY();
	}
}
//输入ajax请求
function addAjax(){
	if(!inputIsNull(ajaxInput)){
		if(isAjaxUrl(ajaxInput)){
			nowChart.showLoading();
			doAjax();			
		}
	}
}
//进行ajax请求
function doAjax(){
	$.get(ajaxUrl).done(function (data) {
	nowChart.hideLoading();
    myCharts[nowId].data = $.parseJSON(data)[0]["data"];
	renderXY();
});
}
//绘制xy轴可选项
function renderXY(){
	var htmlx = "";
	var htmly = "";
	for(key in myCharts[nowId].data[0]) {
		htmlx += "<input type=\"radio\" name=\"x_radio\" id=\"x_"+key+"\" value=\""+key+"\"><label for=\"x_"+key+"\">"+key+"</label>";
		htmly += "<input type=\"radio\" name=\"y_radio\" id=\"y_"+key+"\" value=\""+key+"\"><label for=\"y_"+key+"\">"+key+"</label>";
	}
	xWraper.html(htmlx);
	yWraper.html(htmly);
}
//选择xy，并绘制
function chooseXY(){
	var checkedX = $("#wraper_x input:checked").val();
	var checkedY = $("#wraper_y input:checked").val();
	if(checkedX != checkedY){
		$("#xy_cution").hide();
		setEchartsOp(checkedX,checkedY);
		setChart();
	}else{
		$("#xy_cution").show();
	}
}
//显示编辑可选项
function showSuperOption(){
	setNowId();
}
//修改高级配置
function addSuperOption(){
	myCharts[nowId].option.title.text = $.trim(titleName.val());
	myCharts[nowId].option.xAxis.name = $.trim(xName.val());
	myCharts[nowId].option.yAxis.name = $.trim(yName.val());
	myCharts[nowId].option.dataZoom.show = dataZoomOp.is(":checked");
	myCharts[nowId].option.toolbox.show = toolboxOp.is(":checked");
	if(serLineOp.is(":checked")){
		myCharts[nowId].option.series[0].type = 'line';
	}else{
		myCharts[nowId].option.series[0].type = 'bar';
	}
	setChart();
}
//设置Echarts的Option
function setEchartsOp(x,y){
	myCharts[nowId].option.xAxis.data = handelData(x,y).x;
	myCharts[nowId].option.xAxis.name = x;
	myCharts[nowId].option.series[0].data = handelData(x,y).y;
	myCharts[nowId].option.yAxis.name = y;
}
//设置nowId
function setNowId(){
	var chartsInp = $(".nowCharts");
	for(key in chartsInp){
		if($(chartsInp[key]).is(":checked")){
			nowId = chartsInp[key].id.slice(8);
			break;
		}
	}
}
//配置图表
function setChart(){
	console.log(nowId);
	echarts.init(document.getElementById('chart'+nowId+'')).setOption(myCharts[nowId].option);
}
/* util */
//判断表单是否为空
function inputIsNull(position){
	var inp = $.trim(position.val());
	if(inp == null || inp == ""){
		position.next().show();
		return true;
	}else{
		position.next().hide();
		return false;
	}
	
}
//判断url是否合法
function isAjaxUrl(position){
	ajaxUrl = $.trim(position.val());
	var exp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	return exp.test(ajaxUrl);
}
//将json对象里的数据分离提取
function handelData(x1,y1){
   var x = [];
    var y = [];
    var size = myCharts[nowId].data.length;
    for(var i = 0;i < size;i ++){
        for(key in myCharts[nowId].data[i]){
            if(key == x1)
            	x[i] = myCharts[nowId].data[size - i - 1][key];
            if(key == y1)             
                y[i] = myCharts[nowId].data[size - i - 1][key];
        }
    }	
    return {
        x : x,
        y : y
    }
}
/* 绑定事件 */
addBtn.on("click",function(){
	initAChart();
});
delBtn.on("click",function(){
	deleteAChart();
});
dataBtn.on("click",function(){
	addData();
});
ajaxBtn.on("click",function(){
	addAjax();
});
aditBtn.on("click",function(){
	showSuperOption();
});
optBtn.on("click",function(){
	addSuperOption();
});
xyBtn.on("click",function(){
	chooseXY();
})