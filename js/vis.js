//数据对象
var data = [];
//dom元素
var dataInput = $("#data");
var dataBtn = $("#btn");
var chart = echarts.init(document.getElementById('chart'));
//option初始化
var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:[]
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: []
            }]
        };
//输入数据
function addData() {
	if(!inputIsNull(dataInput)){
		data = $.parseJSON(dataInput.val())[0]["data"];
		setEchartsOp();
		initEcharts();
	}
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
    var j = 0;
    var size = data.length;
    for(var i = 0;i < size;i ++){
        for(key in data[i]){
            if(j == 0)
                y[i] = parseInt(data[size - i - 1][key]);
            else                
                x[i] = data[size - i - 1][key];
            j++;
        }
        j = 0;
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
	inp = $.trim(position.val());
	if(inp == null || inp == ""){
		position.next().show();
		return true;
	}else{
		position.next().hide();
		return false;
	}
	
}
//绑定事件
dataBtn.on("click",function(){
	addData();
});
