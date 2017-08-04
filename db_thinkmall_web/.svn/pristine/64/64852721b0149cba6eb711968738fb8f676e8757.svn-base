/*******************************************************
	@author Lvkj
	@date: 2014-02-21
	@description 图表插件(曲线图+饼状图+柱状图)
	@param container_id:图表所在页面元素ID
	@param data:图表显示真实数据
	@param options:用户自己控制的信息对象
  【曲线图使用案例】
	<注意点！如果data不是一个list，而是一条数据，则对象options中的color也相应传一个值即可>
	var data = [{
        name: '东京',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    	}, {
        name: '纽约',
        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
   		}, {
        name: '柏林',
        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
    	}, {
        name: '伦敦',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	}];
	var options={
		m_title: "每个月温度变化曲线图",		//图表标题
		f_title: "来源于思迪信息网",	//图表副标题
		categories: ['一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'],		//X轴数据
		y_title: "实时温度 (°C)"	,	//Y轴标题
		tickInterval: 5,		//Y轴自定义刻度
		color: ['#0E8ECF','#FF0000','#FF6600','#FF9C00','#BFD916'],		//曲线颜色
		over_show: false		//鼠标悬浮是否显示数据
	};
	chartsUtils.drawLine("#container_line", data, options);		//调用展示曲线图处理方法
	
  【饼状图使用案例】
	var data = [['国海证券',40],['长城证券',20],['长江证券',10],['国泰证券', 10],['其他', 20]];
	var options={
		m_title: "每个月温度变化曲线图",		//设置图表标题
		f_title: "来源于思迪信息网",	//设置图表副标题
		color: ['#0E8ECF','#FF0000','#FF6600','#FF9C00','#BFD916'],		//设置饼图区域颜色
		distance: 12,		//设置线条长度(标签与图像元素之间的间距)
		over_show: true		//鼠标悬浮是否显示数据
	};
	chartsUtils.drawPie("#container_pie", data, options);		//调用展示饼状图处理方法
	
  【柱状图使用案例】
	<注意点！如果data不是一个list，而是一条数据，则对象options中的color也相应传一个值即可>
   var data = [{
        name: '东京',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
        name: '纽约',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
   	    }, {
        name: '伦敦',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    	}, {
        name: '柏林',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
	}];
	var options={
		m_title:"每个月温度变化曲线图",		//设置图表标题
		f_title:"来源于思迪信息网",	//设置图表副标题
		categories:['一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'],		//设置X轴数据
		color:['red','yellow','blue','green'],		//设置柱状图区域颜色
		y_title:"实时温度",	//设置Y轴标题
		tickInterval:20,		//Y轴自定义刻度
		over_show:true		//鼠标悬浮是否显示数据
	};
	chartsUtils.drawColumn("#container_column", data, options);		//调用展示柱状图处理方法
********************************************************/
define(function (require, exports, module) {
	require("highcharts");
	//【曲线图】
	function drawLine(container_id,data,options)
	{
		$(container_id).highcharts({
				chart: {
	            type: 'line'		//指定图表的类型，默认是折线图（line）       
      	   },
            title: {
                text: options.m_title,		//指定图表标题
                x: -20 //center
            },
            subtitle: {
                text: options.f_title,		//指定图表副标题
                x: -20
            },
            credits: {
            	text: '',		//去掉右下方版权信息：highchart.com
            },
            xAxis: {
                categories: options.categories		//X轴分组数据
            },
            yAxis: {
                title: {
                    text: options.y_title		//指定y轴的标题
                },
                tickInterval: options.tickInterval,    //自定义刻度 
                plotLines: [{		//标识线
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            colors: options.color,		//曲线颜色
            tooltip: {		//当鼠标划过数据点时，数据点提示框显示出数据点相关信息
            	enabled: options.over_show,		//鼠标悬浮时，是否显示数据，默认true
                valueSuffix: '°C'
            },
            legend: {		//图例：图表中的以下区块中用名字和颜色图表表示序列
            	enabled: false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: data		//指定数据列
        });
	}
	
	//【饼状图】
	function drawPie(container_id,data,options)
	{
		$(container_id).highcharts({
        chart: {
			type: 'pie',
            plotBackgroundColor: null,		//主图表区背景色，即X轴与Y轴围成的区域的背景色
            plotBorderWidth: null,		//主图表区边框的宽度
            plotShadow: false		//是否设置阴影
        },
        title: {
            text: options.m_title		//图表标题
        },
	    subtitle: {
	        text: options.f_title,		//指定图表副标题
	    },
	    colors: options.color,		//饼图颜色
	    credits: {
            	text: '',		//去掉右下方版权信息：highchart.com
        },
        tooltip: {
	    	enabled: options.over_show,		//鼠标悬浮时，是否显示数据，默认true
    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'		//鼠标悬浮显示信息
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorPadding:6,		//设置线条与文字之间的距离
                    distance: options.distance,		// 标签与图像元素之间的间距
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>:{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: '所占比例',
            data: data
     		}]
    	});
	}
	
	//【柱状图】
	function drawColumn(container_id, data, options)
	{
		$(container_id).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: options.m_title
            },
            subtitle: {
                text: options.f_title
            },
            credits: {
            	text: '',		//去掉右下方版权信息：highchart.com
        	},
        	colors: options.color,		//柱图颜色
            xAxis: {
                categories: options.categories
        	},
            yAxis: {
        		tickInterval: options.tickInterval,    //自定义刻度 
                min: 0,
                title: {
                    text: options.y_title  //Y轴标题
                }
            },
            tooltip: {
            	enabled: options.over_show,		//鼠标悬浮时，是否显示数据，默认true
                formatter: function() {		//鼠标悬浮时显示的内容
                            return '<b>'+ this.series.name +'</b><br/>'+  
                            this.x +': '+ this.y;  
                    }  
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: data		//柱状图真实数据
        });
	}
	var chartsUtils = {
		"drawLine":drawLine,
		"drawPie":drawPie,
		"drawColumn":drawColumn
	};
	module.exports = chartsUtils;
});