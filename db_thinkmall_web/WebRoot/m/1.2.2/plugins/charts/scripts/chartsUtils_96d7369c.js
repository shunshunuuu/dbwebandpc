/*创建时间hSea 2015-10-30 13:54:14 PM */
define(function(require,exports,module){function a(a,b,c){$(a).highcharts({chart:{type:"line"},title:{text:c.m_title,x:-20},subtitle:{text:c.f_title,x:-20},credits:{text:""},xAxis:{labels:{step:"undefined"==typeof c.step?1:c.step},categories:c.categories},yAxis:{reversed:"undefined"==typeof c.reversed?!1:c.reversed,title:{text:c.y_title},tickInterval:c.tickInterval,plotLines:[{value:0,width:1,color:"#808080"}]},colors:c.color,tooltip:{enabled:c.over_show,valueSuffix:"°C"},legend:{enabled:!1,layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},series:b})}function b(a,b,c){$(a).highcharts({chart:{type:"pie",plotBackgroundColor:null,plotBorderWidth:null,plotShadow:!1},title:{text:c.m_title},subtitle:{text:c.f_title},colors:c.color,credits:{text:""},tooltip:{enabled:c.over_show,pointFormat:"{series.name}: <b>{point.percentage:.1f}%</b>"},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,color:"#000000",connectorPadding:6,distance:c.distance,connectorColor:"#000000",format:"<b>{point.name}</b>:{point.percentage:.1f}%"}}},series:[{name:"所占比例",data:b}]})}function c(a,b,c){$(a).highcharts({chart:{type:"column"},title:{text:c.m_title},subtitle:{text:c.f_title},credits:{text:""},colors:c.color,xAxis:{labels:{step:"undefined"==typeof c.step?1:c.step},categories:c.categories},yAxis:{reversed:"undefined"==typeof c.reversed?!1:c.reversed,tickInterval:c.tickInterval,min:0,title:{text:c.y_title}},tooltip:{enabled:c.over_show,formatter:function(){return"<b>"+this.series.name+"</b><br/>"+this.x+": "+this.y}},plotOptions:{column:{pointPadding:.2,borderWidth:0}},series:b})}require("highcharts");var d={drawLine:a,drawPie:b,drawColumn:c};module.exports=d});
/*创建时间 2015-10-30 13:54:14 PM */