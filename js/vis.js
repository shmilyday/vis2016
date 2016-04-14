//数据对象
var echartsData = "";
//dom元素
var dataInput = $("#data");
var dataBtn = $("#btn_data");
var ajaxInput = $("#ajax");
var ajaxBtn = $("#btn_ajax");
var ajaxUrl = "";
var optBtn = $("#btn_opt");
var titleName = $("#title_name");
var xName = $("#x_name");
var yName = $("#y_name");
var dataZoomOp = $("#data_zoom");
var toolboxOp = $("#toolbox");
var serLineOp = $("#ser_line");
var chart = echarts.init(document.getElementById('chart'));
//option初始化
var option = {
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
        };
//输入数据
function addData() {
	if(!inputIsNull(dataInput)){
		echartsData = $.parseJSON(dataInput.val())[0]["data"];
		setEchartsOp();
		initEcharts();
	}
}
//输入ajax请求
function addAjax(){
	if(!inputIsNull(ajaxInput)){
		if(isAjaxUrl(ajaxInput)){
			chart.showLoading();
			doAjax();			
		}
	}
}
//增加高级配置
function addSuperOption(){
	option.title.text = $.trim(titleName.val());
	option.xAxis.name = $.trim(xName.val());
	option.yAxis.name = $.trim(yName.val());
	option.dataZoom.show = dataZoomOp.is(":checked");
	option.toolbox.show = toolboxOp.is(":checked");
	if(serLineOp.is(":checked")){
		option.series[0].type = 'line';
	}else{
		option.series[0].type = 'bar';
	}
	initEcharts();
}
//进行ajax请求
function doAjax(){
	$.get(ajaxUrl).done(function (data) {
	chart.hideLoading();
    echartsData = $.parseJSON(data)[0]["data"];
	setEchartsOp();
	initEcharts();
});
}
//设置Echarts的Option
function setEchartsOp(){
	option.xAxis.data = handelData().time;
	option.series[0].data = handelData().data;
}
//将json对象里的数据分离提取
function handelData(){
   var x = [];
    var y = [];
    var size = echartsData.length;
    for(var i = 0;i < size;i ++){
        for(key in echartsData[i]){
            if(isADate(echartsData[size - i - 1][key]))
            	x[i] = echartsData[size - i - 1][key];
            else             
                y[i] = parseInt(echartsData[size - i - 1][key]);
        }
    }
    return {
        time : x,
        data : y
    }
}
//初始化chart
function initEcharts(){
	chart.setOption(option);
}
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
//判断是否是日期格式(yy-mm-dd)
function isADate(date){
	var exp1 = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
	var exp2 = /^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)$/;
	return exp1.test(date)||exp2.test(date);
}	
//绑定事件
dataBtn.on("click",function(){
	addData();
});
ajaxBtn.on("click",function(){
	addAjax();
});
optBtn.on("click",function(){
	addSuperOption();
});