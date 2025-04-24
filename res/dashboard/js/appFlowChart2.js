/*DRAW NODE LEGEND*/
var appFlowCircleIndex = 0; // 파티클 제거용 index [2019-09-18]
var appFlowLegendList = [
	{title_eng:"user",title_kor:"node1"},
	{title_eng:"app",title_kor:"node2"},
	{title_eng:"departure",title_kor:"node3"},
	{title_eng:"service",title_kor:"node4"},
	{title_eng:"arrival",title_kor:"node5"}
];

var appFlowLegend = d3.select("#appFlowChartLegend")
	.selectAll("div")
	.data(appFlowLegendList)
	.enter();

var appFlowDataLegendList;
var appFlowDataLegend;
var appFlowLegend_item = appFlowLegend.append("div")
	.attr("class","flex_row align_center");

var app_reqData;
var app_resData;
var app_fullData;
var app_numCircle;

/*데이터의 타입이 바뀌는 첫번째 원의 인덱스*/
var appFlowData_g;
var app_numBorder;
var appFlowData;
var app_dataScale;


/*이전 세션의 평균 응답속도 저장하는 배열*/
var appMean_res_rateArray = [];
var appMean_res_rateSVG;
var appMean_res_rateSVG_g;
var appMean_res_ratePath_g
var appMean_res_rateSize = {width:0,height:0,margin_left:0,margin_top:0,margin_right:0,margin_bottom:0};
var appMean_res_innerWidth;
var appMean_res_innerHeight;
var appMean_res_xScale;
var appMean_res_Samples = 60;
var appMean_res_Xmax;
var appMean_res_current_x;
var appMean_res_xAxis;
var appMean_res_yScale;
var appMean_res_line;
var appMean_res_area;
var appCurrent_res_point;


/*DRAW APP Flow Chart SVG*/
var appFlowChartSize = {width:0, height:164};
var appFlowDataSize = {width:0, height:appFlowChartSize.height/2, margin:16};
var appFlowChartSVG;
var appFlowChart_g;


/*Set Grid Unit of APP FLOW CHART*/
var appFlowGridUnit;
var flowStrokeScale;

/*Drawn Flow Tunnel*/
var maxNumTunnel = 42;
var appFlowTunnelScale;

var appFlowTunnelSize;
var appFlowTunnel_g;
var appFlowNum_g;
var tunnelColorScale = d3.scaleLinear().domain([0,25,26,50,51,75,76,100])
	.range(["#ADC9F9","#7FABF6","#7FABF6","#4082F3", "#2470F1","#1465EF", "#0058EE","#004AE4"]);



/*flow tunnel을 그리기 위한 가상의 오브젝트*/
var app_numCircle2;
var app_circleArray2;

/*Draw Flow Particle*/
/*파티클을 위한 가상의 오브젝트*/
var appFlowParticleArray = [];
var appFlowParticleScale;
var numAppFlowParticle;


var appParticle_group_object;
var example = [{},{},{},{}];
var appParticle_group_set;
var appFlowParticle_set;
var particleDuration = 1800;


/*Draw Node*/
/*Set Node Array*/
var appNodeArray;
var appNodeItem;

/*Block Line*/
var appBlockLineData = [
	{'x':0, "y":0},
	{'x':0.25, "y":0},
	{'x':0.5, "y":0},
	{'x':0.75, "y":0},
	{'x':1, "y":0},
	{'x':1, "y":0.25},
	{'x':1, "y":0.5},
	{'x':1, "y":0.75},
	{'x':1, "y":1},
	{'x':1, "y":1.25}
];

var appBlockLineDataX;
var appBlockLineDataY;
var appBlockLine;
var appBlockLineScale;


// --- Helper function to get dimensions ---
function getContainerSize(selector) {
    const container = document.querySelector(selector);
    if (!container) return { width: 0, height: 0 };
    const rect = container.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

function setAppFlowChart(flowData){


	/*DRAW APP FLOW LEGEND*/
	appFlowLegend_item.append("div")
		.attr("class",function(d){
			return "circle_legend " + d.title_eng + "_bg";
		});

	appFlowLegend_item.append("span")
		.attr("class",function(d){
			return " " + d.title_eng;
		})
		.style("margin-right","12px")
		.html(function(d){
			return d.title_kor;
		});


	/*DRAW APP FLOW DATA AMOUNT*/
	appFlowDataSize.width = $("#appFlowData").width();

	app_reqData = flowData.req_data;
	app_resData = flowData.res_data;
	app_fullData = app_resData + app_reqData;
	app_numCircle = 40;
	/*데이터의 타입이 바뀌는 첫번째 원의 인덱스*/
	app_numBorder = parseInt((app_reqData/app_fullData)*app_numCircle);

	appFlowData = d3.select("#appFlowData")
		.append("svg")
		.attr("width",appFlowDataSize.width)
		.attr("height",appFlowDataSize.height);

	app_dataScale = d3.scaleLinear()
		.domain([0,app_fullData])
		.range([0,40]);

	/*원통을 그리기 위한 가상의 오브젝트*/
	var app_circleArray = [];
	for(i=0;i<app_numCircle;i++){
		if(i<app_numBorder){
			app_circleArray.push({dataType:"reqData"});
		}
		else{
			app_circleArray.push({dataType:"resData"});
		}
	}

	appFlowData_g = appFlowData.append("g")
		.attr('transform', 'translate(' +appFlowDataSize.margin + ',' + 12 + ')');

	appFlowData_g.selectAll("ellipse")
		.data(app_circleArray)
		.enter()
		.append("ellipse")
		.attr("class",function(d){
			return d.dataType;
		})
		.attr("fill",function(d){
			if(d.dataType == "resData"){
				var color = d3.color("#D81B60");
			}
			else if(d.dataType == "reqData"){
				var color = d3.color("#4082F3");
			}
			color.opacity = 0.26;
			return color;
		})
		.attr("rx",12)
		.attr("ry",28)
		.attr("cy",32)
		.attr("cx",function(d,i){
			return i/40 * (appFlowDataSize.width - 2*appFlowDataSize.margin);
		});


	/*DRAW APP FLOW LEGEND*/
	appFlowDataLegendList = [
		{title_eng:"reqData",title_kor:"전송량", value:app_reqData},
		{title_eng:"resData",title_kor:"수신", value:app_resData},
	];

	appFlowDataLegend = d3.select("#appFlowDataLegend")
		.selectAll(".appFlowDataLegendItem")
		.data(appFlowDataLegendList)
		.enter()
		.append("div")
		.attr("class","flex_row align_center appFlowDataLegendItem");

	appFlowDataLegend.append("p")
		.attr("class",function(d){
			return "circle_legend left_align " + d.title_eng + "_bg";
		})
		.style("margin","0 4px 0 0");

	appFlowDataLegend.append("span")
		.attr("class",function(d){
			return "appDataLegend left_align " + d.title_eng;
		})
		.attr("id",function(d){
			return d.title_eng;
		})
		.style("margin-right","12px")
		.html(function(d){
			return d.title_kor + " " + "<strong>" +d.value + "mb" + "</strong>";
		});

	/*SET AVERAGE RESPONSE SPEED*/
	d3.select("#app_mean_res_rate").attr("class",function(){
		if(flowData.mean_res_rate<2.5){
			return "normal";
		}
		else{
			return "worst";
		}
	})
		.html(flowData.mean_res_rate);

	d3.select("#app_mean_res_level").attr("class",function(){
		if(flowData.mean_res_rate<2.5){
			return "normal col1 text_center";
		}
		else{
			return "worst col1 text_center";
		}
	})
		.style("margin-top","-8px")
		.html(function(){
			if(flowData.mean_res_rate<2.5){
				return "high";
			}
			else{
				return "low";
			}
		});

	/*SET AVERATE RESPONSE SPEED LINE GRAPH*/
	appMean_res_rateArray.push({rate:flowData.mean_res_rate, index:0});

	appMean_res_rateSize = {width:0,height:0,margin_left:44,margin_top:8,margin_right:4,margin_bottom:24};
	appMean_res_rateSize.width = $("#appMeanResRateChart").width();
	appMean_res_rateSize.height = 96;
	appMean_res_rateSVG = d3.select("#appMeanResRateChart").append("svg")
		.attr("width",appMean_res_rateSize.width)
		.attr("height",appMean_res_rateSize.height);

	appMean_res_innerWidth = appMean_res_rateSize.width - appMean_res_rateSize.margin_left - appMean_res_rateSize.margin_right;
	appMean_res_innerHeight = appMean_res_rateSize.height - appMean_res_rateSize.margin_top - appMean_res_rateSize.margin_bottom;

	var appMean_res_rateGrid_g = appMean_res_rateSVG.append("g")
		.attr("transform","translate(" + appMean_res_rateSize.margin_left + "," + appMean_res_rateSize.margin_top + ")");

	appMean_res_rateSVG_g = appMean_res_rateSVG.append("g")
		.attr("transform","translate(" + appMean_res_rateSize.margin_left + "," + appMean_res_rateSize.margin_top + ")");


	appMean_res_Xmax = 0;
	appMean_res_current_x = 0;
	appMean_res_xScale = d3.scaleLinear()
		.domain([0,appMean_res_Xmax])
		.range([appMean_res_innerWidth*(1 - appMean_res_Xmax/appMean_res_Samples) ,appMean_res_innerWidth]);

	var appMean_res_grid_xScale = d3.scaleLinear()
		.domain([0,30])
		.range([0,appMean_res_innerWidth]);


	appMean_res_yScale = d3.scaleLinear()
		.domain([0,20])
		.range([appMean_res_innerHeight,0]);

	appMean_res_line = d3.line()
		.curve(d3.curveCardinal)
		.x(function(d){return appMean_res_xScale(d.index);})
		.y(function(d){return appMean_res_yScale(d.rate);});

	appMean_res_area = d3.area()
		.curve(d3.curveCardinal)
		.x(function(d){return appMean_res_xScale(d.index);})
		.y0(function(d){return appMean_res_yScale(0);})
		.y1(function(d){return appMean_res_yScale(d.rate);});


	appMean_res_rateSVG_g.append("path")
		.attr("class","green_line")
		.attr("d",appMean_res_line(appMean_res_rateArray));

	appMean_res_rateSVG_g.append("path")
		.attr("class","green_area")
		.attr("d",appMean_res_area(appMean_res_rateArray));


	appMean_res_rateSVG_g.append("circle")
		.attr("class","current_point")
		.attr("r",2)
		.attr("cx",appMean_res_xScale(appMean_res_rateArray[0].index))
		.attr("cy",appMean_res_yScale(appMean_res_rateArray[0].rate));

	var appMean_res_xAxis_ticks = [];

	for(i=0;i<appMean_res_Xmax;i++){
		if(i%10==0){
			appMean_res_xAxis_ticks.push(i);
		}
	}
	appMean_res_xAxis = d3.axisBottom(appMean_res_xScale).tickValues(appMean_res_xAxis_ticks);

	appMean_res_rateSVG_g.append("g")
		.attr("class", "x axis_light")
		.attr("transform", "translate(0," + appMean_res_innerHeight + ")")
		.call(appMean_res_xAxis);

	appMean_res_rateGrid_g.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + appMean_res_innerHeight + ")")
		.call(d3.axisBottom(appMean_res_grid_xScale).tickValues([0,10,20,30])
			.tickSize(-appMean_res_innerHeight)
			.tickFormat("")
		);

	appMean_res_rateSVG_g.append("g")
		.attr("class", "y axis_light")
		.attr("transform", "translate(0,0)")
		.call(d3.axisLeft(appMean_res_yScale).tickValues([0, 10, 20])); // Create an axis component with d3.axisBottom

	appMean_res_rateGrid_g.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0,0)")
		.call(d3.axisLeft(appMean_res_yScale).tickValues([0, 10, 20])
			.tickSize(-appMean_res_innerWidth)
			.tickFormat("")
		);

	/*DRAW APP Flow Chart SVG*/
	appFlowChartSize = {width:0, height:164};
	appFlowChartSize.width = $("#appFlow").width();


	appFlowChartSVG = d3.select("#appFlowChart").append("svg")
		.attr("width",appFlowChartSize.width)
		.attr("height",appFlowChartSize.height);

	appFlowChart_g = appFlowChartSVG.append("g")
		.attr("transform","translate(0,-16)");

	/*Set Grid Unit of APP FLOW CHART*/
	appFlowGridUnit = appFlowChartSize.width/7;
	flowStrokeScale = d3.scaleLinear()
		.domain([0,1000])
		.range([16,48]);



	/*Draw Flow Line*/
	appFlowChart_g.append("line")
		.attr("x1",0*appFlowGridUnit + appFlowGridUnit*1/2 + 4)
		.attr("x2",6*appFlowGridUnit + appFlowGridUnit*1/2 + 4)
		.attr("y1",appFlowChartSize.height/2)
		.attr("y2",appFlowChartSize.height/2)
		.attr("class","flowStroke")
		.attr("stroke-width",function(){
			return 48;
			// return flowStrokeScale(flowData.flow);
		});


	/*Draw Flow Particle*/
	/*파티클을 위한 가상의 오브젝트*/
	appFlowParticleArray = []; // 파티클 영역이 하나 이므로 배열도 하나로 통합 [2019-09-18]
	appFlowParticleScale = d3.scaleLinear()
		.domain([0,1000])
		.range([0,100]); // 파티클 범위 조정 [2019-09-18]

	numAppFlowParticle = appFlowParticleScale(flowData.flow);

	/*파티클에 바인딩할 객체*/
	for(var i=0;i<numAppFlowParticle;i++){
		var particle = {
			// "delay_offset": Math.floor(Math.random() * 100), // particle delay 구문에 직접 추가 [2019-09-18]
			// rOffset: Math.floor(Math.random()*1) + 1
			rOffset: d3.randomInt(1, 2)() // d3 random 함수로 변경 [2019-09-18]
		}
		appFlowParticleArray.push(particle);
	}

	/*이동할 위치를 정하기 위한 파티클 그룹 객체*/
	// 파티클 영역을 하나로 통합 [2019-09-18]
	appParticle_group_object = [
		{from:1,to:7, duration_offset:1}
	];

	// example = [{},{},{},{}]; 불필요한 로직 제거 [2019-09-18]

	appParticle_group_set = appFlowChart_g.selectAll(".appParticle_group")
		.data(appParticle_group_object)
		.enter()
		.append("g")
		.attr("class",function(d,i){
			return "appParticle_group" + i;
		})
		.attr("transform",function(d){
			return "translate(" + (d.from - 0.5)*appFlowGridUnit + ",0)";
		});

	// 공통으로 사용될 파티클 로직 [2019-09-18]
	moveParticles(appFlowParticleArray);

	/*Draw Node*/
	/*Set Node Array*/
	appNodeArray = [
		{node_title_eng:"user_node",node_title_kor:"node1",index:1,value:flowData.user,block:flowData.user_block},
		{node_title_eng:"app_node",node_title_kor:"node2",index:2,value:flowData.application,block:flowData.application_block},
		{node_title_eng:"departure_node",node_title_kor:"node3",index:3,value:flowData.source,block:flowData.source_block},
		{node_title_eng:"service_node",node_title_kor:"node4",index:6,value:flowData.service,block:0},
		{node_title_eng:"arrival_node",node_title_kor:"node5",index:7,value:flowData.destination,block:0}
	];

	/*Draw Node Circle*/
	appNodeItem =  appFlowChart_g.selectAll(".node")
		.data(appNodeArray)
		.enter()
		.append("g")
		.attr("class","node")
		.attr("transform",function(d){
			return "translate(" + appFlowGridUnit*(d.index-1) + ",0)";
		});

	appBlockLineDataX = d3.scaleLinear().domain([0,1]).range([0,appFlowGridUnit*1/2]);
	appBlockLineDataY = d3.scaleLinear().domain([0,1]).range([0,appFlowGridUnit*1/2]);
	var blockMax = d3.max(appNodeArray.map(function(d){return d.block}));
	appBlockLineScale = d3.scaleLinear().domain([0,1,blockMax]).range([0,2,5]);


	appBlockLine = d3.line()
		.curve(d3.curveBundle.beta(1))
		.x(function(d){return appFlowGridUnit*1/2 + appBlockLineDataX(d['x']);})
		.y(function(d){return appFlowChartSize.height/2 + appBlockLineDataX(d['y']);});


	//[2019-09-20] mark-end용 def제거
	// appFlowChartSVG.append("svg:defs").append("svg:marker")
	// 	.attr("id", "arrow1")
	// 	.attr("markerUnits", "strokeWidth")
	// 	.attr("markerWidth", "2").attr("markerHeight", "2")
	// 	.attr("viewBox", "0 -5 10 10")
	// 	.attr("refX", "5").attr("refY", "0")
	// 	.attr("orient", "auto")
	// 	.append("path")
	// 	.attr("d","M0,-5L10,0L0,5")
	// 	.style("fill","#f26e88")
	// 	.style("stroke","none")
	// 	.attr("class","arrowHead");


	appNodeItem.append("path")
		.attr('d',appBlockLine(appBlockLineData))
		.attr("fill","none")
		.attr("stroke","#f26e88")
		.attr("stroke-width",function(d){
			return appBlockLineScale(d.block);
		})
		.attr("marker-end","url(#arrow)")
		.attr("opacity",0)
		.transition()
		.duration(800)
		.attr("opacity",1)
		.attr("marker-end", "url(#arrow1)");

	//[2019-09-20] mark-end용 path 추가
	var markend = appNodeItem.append("g")
							 .attr("transform","translate(70.5,126)rotate(90)")
							 .append("path")
							 .attr("d",function(d){
							 	if(0<d.block){
							 		return "M0,-5L10,0L0,5";
							 	}
							 	else{
							 		return "";
							 	}

							 })
							 .attr("fill","#f26e88")
							 .attr("opacity",0)
							 .transition()
							 .duration(800)
							 .attr("opacity",1);

	appNodeItem.append("text")
		.attr("class","blockText font-bold")
		.attr("text-anchor","middle")
		.attr("x",appFlowGridUnit)
		.attr("y",appFlowChartSize.height/2 + 80)
		.text(function(d){
			if(0<d.block){
				return "exit:" + d.block;
			}else{
				return "";
			}

		});

	appNodeItem.append("circle")
		.attr("class",function(d){
			return d.node_title_eng;
		})
		.attr("r",24)
		.attr("cx",function(d){
			return appFlowGridUnit*1/2;
		})
		.attr("cy",appFlowChartSize.height/2);


	appNodeItem.append("text")
		.attr("x",function(d){
			return appFlowGridUnit*1/2;
		})
		.attr("y",appFlowChartSize.height/2 + 4)
		.text(function(d){
			return d.value;
		})
		.attr("text-anchor","middle")
		.attr("fill","#ffffff");



	/*Drawn Flow Tunnel*/
	maxNumTunnel = 42;
	appFlowTunnelScale = d3.scaleLinear()
		.domain([0,1000])
		.range([12,maxNumTunnel]);

	appFlowTunnelSize = {width: appFlowGridUnit*1.4, margin:0}


	appFlowTunnel_g = appFlowChart_g.append("g")
		.attr("transform","translate(" + appFlowGridUnit*3.3 + ",0)");


	appFlowNum_g = appFlowChart_g.append("g")
		.attr("transform","translate(" + appFlowGridUnit*3.3 + ",0)");


	/*flow tunnel을 그리기 위한 가상의 오브젝트*/
	app_numCircle2 = parseInt(appFlowTunnelScale(flowData.flow));
	// app_numCircle2 = 42;
	app_circleArray2 = [];


	appFlowTunnelSize.margin = ((maxNumTunnel-app_numCircle2)/maxNumTunnel)*appFlowTunnelSize.width/2;

	for(i=0;i<app_numCircle2;i++){
		app_circleArray2.push({dataType:"flow"});
	}

	appFlowTunnel_g.selectAll(".tunnel_ellipse")
		.data(app_circleArray2)
		.enter()
		.append("ellipse")
		.attr("class","tunnel_ellipse")
		.attr("fill",function(){
			var color = d3.color(tunnelColorScale(flowData.flow_per));
			color.opacity = 0.14;
			return color;
		})
		.attr("stroke",function(){
			var color = d3.color(tunnelColorScale(flowData.flow_per));
			return color;
		})
		.attr("stroke-width",0)
		// .attr("rx",flowStrokeScale(flowData.flow)/4)
		// .attr("ry",flowStrokeScale(flowData.flow)/2+2)
		.attr("rx",48/4)
		.attr("ry",48/2+2)
		// .attr("cx",function(d,i){
		// 	return appFlowTunnelSize.margin + (i+1)/maxNumTunnel*appFlowTunnelSize.width;
		// })
		.attr("cx",function(d,i){
			var j = parseInt(i/2);
			/*multifier for positioning*/
			var mf;
			if(i%2==0){
				mf = 1;
			}
			else{
				mf = -1;
			}
			return appFlowTunnelSize.width/2 + j*mf*(1/maxNumTunnel*appFlowTunnelSize.width);
		})
		.attr("cy",appFlowDataSize.height);

	appFlowNum_g.append("text")
		.attr("class","flowNum font-bold text_shadow")
		.attr("fill","#ffffff")
		.attr("text-anchor","middle")
		.attr("x",appFlowTunnelSize.width/2)
		.attr("y",appFlowDataSize.height + 4)
		.text(flowData.flow);


}

function updateAppFlowChart(flowData){

	/*데이터 전송.수신량 범례 업데이트*/
	app_reqData = flowData.req_data;
	app_resData = flowData.res_data;
	app_fullData = app_resData + app_reqData;


	var appFlowDataLegendList2 = [
		{ title_eng: "reqData", title_kor: "part-A", value: general_reqData },
		{ title_eng: "resData", title_kor: "part-B", value: general_resData },
	];

	var dummy = [
	];

	var dataLegend = d3.select("#appFlowDataLegend")
		.selectAll("div")
		.data(dummy)
		.exit().remove();

	var dataLegend = d3.select("#appFlowDataLegend")
		.selectAll("div")
		.data(appFlowDataLegendList2)
		.enter()
		.append("div")
		.attr("class","flex_row align_center appFlowDataLegendItem");

	dataLegend.append("p")
		.attr("class",function(d){
			return "circle_legend left_align " + d.title_eng + "_bg";
		})
		.style("margin","0 4px 0 0");

	dataLegend.append("span")
		.attr("class",function(d){
			return "appDataLegend left_align " + d.title_eng;
		})
		.attr("id",function(d){
			return d.title_eng;
		})
		.style("margin-right","12px")
		.html(function(d){
			return d.title_kor + " " + "<strong>" +d.value + "mb" + "</strong>";
		});


	/*데이터 터널 업데이트*/
	/*데이터의 타입이 바뀌는 첫번째 원의 인덱스*/
	app_numBorder = parseInt((app_reqData/app_fullData)*app_numCircle);

	app_dataScale = d3.scaleLinear()
		.domain([0,app_fullData])
		.range([0,40]);

	/*원통을 그리기 위한 가상의 오브젝트*/
	var app_circleArray = [];
	for(i=0;i<app_numCircle;i++){
		if(i<app_numBorder){
			app_circleArray.push({dataType:"reqData"});
		}
		else{
			app_circleArray.push({dataType:"resData"});
		}
	}



	var dataCircle = appFlowData_g.selectAll("ellipse")
		.data(app_circleArray);

	dataCircle.enter();

	dataCircle.transition()
		.delay(function(d,i){
			return i * 10;
		})
		.attr("class",function(d){
			return d.dataType;
		})
		.attr("fill",function(d){
			if(d.dataType == "resData"){
				var color = d3.color("#D81B60");
			}
			else if(d.dataType == "reqData"){
				var color = d3.color("#004AE4");
			}
			color.opacity = 0.26;
			return color;
		});


	/*응답속도 표시*/
	/*SET AVERAGE RESPONSE SPEED*/
	d3.select("#app_mean_res_rate").attr("class",function(){
		if(flowData.mean_res_rate<2.5){
			return "normal";
		}
		else{
			return "worst";
		}
	})
		.html(flowData.mean_res_rate);

	d3.select("#app_mean_res_level").attr("class",function(){
		if(flowData.mean_res_rate<2.5){
			return "normal col1 text_center";
		}
		else{
			return "worst col1 text_center";
		}
	})
		.style("margin-top","-8px")
		.html(function(){
			if(flowData.mean_res_rate<2.5){
				return "high";
			}
			else{
				return "low";
			}
		});

	/*SET AVERATE RESPONSE SPEED LINE GRAPH*/
	appMean_res_current_x++;
	appMean_res_rateArray.push({rate:flowData.mean_res_rate, index:appMean_res_current_x});

	if(appMean_res_Samples<=appMean_res_rateArray.length){
		appMean_res_rateArray.shift();
	}
	var last_idx = appMean_res_rateArray.length - 1;

	appMean_res_Xmax = appMean_res_rateArray.length;

	/*현재 세션의 순번이 샘플수보다 작을때*/
	if(appMean_res_current_x<appMean_res_Samples){
		appMean_res_xScale.domain([0,appMean_res_Xmax-1])
			.range([appMean_res_innerWidth*(1 - appMean_res_Xmax/appMean_res_Samples) ,appMean_res_innerWidth]);
	}
	/*현재 세션의 순번이 샘플보다 클때*/
	else{
		appMean_res_xScale.domain([appMean_res_current_x - (appMean_res_Xmax -1) ,appMean_res_current_x])
			.range([appMean_res_innerWidth*(1 - (appMean_res_Xmax)/appMean_res_Samples) ,appMean_res_innerWidth]);
	}



	var appMean_res_xAxis_ticks = [];

	for(i=appMean_res_current_x;0<=i;i--){
		if(i%20==0){
			appMean_res_xAxis_ticks.push(i);
		}
		if(appMean_res_xAxis_ticks.length==3){
			break;
		}
		/*max값보다 클경우 틱값에서 0을 뻬줌*/
	}
	//    if(3<appMean_res_xAxis_ticks.length){
	//    	console.log(appMean_res_xAxis_ticks);
	// 	appMean_res_xAxis_ticks.shift();
	// }
	appMean_res_xAxis.tickValues(appMean_res_xAxis_ticks);
	appMean_res_rateSVG_g.select(".x")
		.transition()
		.duration(200)
		.call(appMean_res_xAxis);

	if(appMean_res_rateArray.length<appMean_res_Samples){
		appMean_res_rateSVG_g.append("line")
			.attr("class","moving_line green_line")
			.attr("x1",appMean_res_xScale(appMean_res_rateArray[last_idx].index))
			.attr("x2",appMean_res_xScale(appMean_res_rateArray[last_idx].index))
			.attr("y1",appMean_res_yScale(appMean_res_rateArray[last_idx].rate))
			.attr("y2",appMean_res_yScale(appMean_res_rateArray[last_idx].rate))
			.transition()
			.duration(200)
			.attr("x2",appMean_res_xScale(appMean_res_rateArray[last_idx].index))
			.attr("y2",appMean_res_yScale(appMean_res_rateArray[last_idx].rate))
			.on('end',function(){
				d3.select(this).remove();
			});
	}
	appMean_res_rateSVG_g.select(".current_point")
		.transition()
		.duration(200)
		.attr("cx",appMean_res_xScale(appMean_res_rateArray[last_idx].index))
		.attr("cy",appMean_res_yScale(appMean_res_rateArray[last_idx].rate));



	appMean_res_rateSVG_g.select(".green_line")
		.transition()
		.duration(0)
		.delay(220)
		.attr("d",appMean_res_line(appMean_res_rateArray));

	appMean_res_rateSVG_g.select(".green_area")
		.transition()
		.duration(0)
		.delay(220)
		.attr("d",appMean_res_area(appMean_res_rateArray));

	/*Draw Node*/
	/*Set Node Array*/
	appNodeArray = [
		{node_title_eng:"user_node",node_title_kor:"node1",index:1,value:flowData.user,block:flowData.user_block},
		{node_title_eng:"app_node",node_title_kor:"node2",index:2,value:flowData.application,block:flowData.application_block},
		{node_title_eng:"departure_node",node_title_kor:"node3",index:3,value:flowData.source,block:flowData.source_block},
		{node_title_eng:"service_node",node_title_kor:"node3",index:6,value:flowData.service,block:0},
		{node_title_eng:"arrival_node",node_title_kor:"node4",index:7,value:flowData.destination,block:0}
	];

	/*Draw Node Circle*/
	appNodeItem =  appFlowChart_g.selectAll(".node")
		.data(dummy)
		.exit()
		.remove();

	appNodeItem =  appFlowChart_g.selectAll(".node")
		.data(appNodeArray)
		.enter()
		.append("g")
		.attr("class","node")
		.attr("transform",function(d){
			return "translate(" + appFlowGridUnit*(d.index-1) + ",0)";
		});

	appNodeItem.append("path")
		.attr('d',appBlockLine(appBlockLineData))
		.attr("fill","none")
		.attr("stroke","#f26e88")
		.attr("stroke-width",function(d){
			return appBlockLineScale(d.block);
		})
		.attr("marker-end","url(#arrow)")
		.attr("opacity",0)
		.transition()
		.duration(800)
		.attr("opacity",1)
		.attr("marker-end", "url(#arrow1)");

	var markend = appNodeItem.append("g")
							 .attr("transform","translate(70.5,126)rotate(90)")
							 .append("path")
							 .attr("d",function(d){
							 	if(0<d.block){
							 		return "M0,-5L10,0L0,5";
							 	}
							 	else{
							 		return "";
							 	}

							 })
							 .attr("fill","#f26e88")
							 .attr("opacity",0)
							 .transition()
							 .duration(800)
							 .attr("opacity",1);


	appNodeItem.append("text")
		.attr("x",appFlowGridUnit)
		.attr("y",appFlowChartSize.height/2 + 80)
		.text(function(d){
			if(0<d.block){
				return "exit:" + d.block;
			}else{
				return "";
			}

		})
		.attr("class","blockText font-bold")
		.attr("text-anchor","middle")


	appNodeItem.append("circle")
		.attr("class",function(d){
			return d.node_title_eng;
		})
		.attr("r",24)
		.attr("cx",function(d){
			return appFlowGridUnit*1/2;
		})
		.attr("cy",appFlowChartSize.height/2);


	appNodeItem.append("text")
		.attr("x",function(d){
			return appFlowGridUnit*1/2;
		})
		.attr("y",appFlowChartSize.height/2 + 4)
		.text(function(d){
			return d.value;
		})
		.attr("text-anchor","middle")
		.attr("fill","#ffffff");



	/*Transition for Particle path*/
	appFlowChart_g.select("line")
		.transition()
		.duration(550)
		.ease(d3.easeCubicOut)
		// .attr("stroke-width",function(){
		// 	return flowStrokeScale(flowData.flow);
		// });
		.attr("stroke-width",function(){
			return 48;
		});

	appFlowParticleArray = []; // 파티클 영역이 하나 이므로 배열도 하나로 통합 [2019-09-18]
	numAppFlowParticle = appFlowParticleScale(flowData.flow);

	/*파티클에 바인딩할 객체*/
	for(var i=0;i<numAppFlowParticle;i++){
		var particle = {
			// "delay_offset": Math.floor(Math.random() * 100), // particle delay 구문에 직접 추가 [2019-09-18]
			// rOffset: Math.floor(Math.random()*1) + 1
			rOffset: d3.randomInt(1, 2)() // d3 random 함수로 변경 [2019-09-18]
		}
		appFlowParticleArray.push(particle);
	}

	// 공통으로 사용될 파티클 로직 [2019-09-18]
	moveParticles(appFlowParticleArray);


	/*flow tunnel을 그리기 위한 가상의 오브젝트*/
	/*App Flow per에 따라 길이가 변경되는것이 맞는지*/
	var preapp_numCircle2 = app_numCircle2;
	app_numCircle2 = parseInt(appFlowTunnelScale(flowData.flow));
	var numChange = app_numCircle2 - preapp_numCircle2;
	// app_numCircle2 = 2;
	app_circleArray2 = [];


	appFlowTunnelSize.margin = ((maxNumTunnel-app_numCircle2)/maxNumTunnel)*appFlowTunnelSize.width/2;

	for(i=0;i<app_numCircle2;i++){
		app_circleArray2.push({dataType:"flow"});
	}

	var tunnel_circles = appFlowTunnel_g.selectAll(".tunnel_ellipse")
		.data(app_circleArray2);

	tunnel_circles.exit().remove();

	tunnel_circles
		.enter()
		.append("ellipse")
		.attr("class","tunnel_ellipse")
		.attr("cx",function(d,i){
			return appFlowTunnelSize.margin + (i+1)/maxNumTunnel*appFlowTunnelSize.width;
		})
		.attr("cy",appFlowDataSize.height)
		.attr("rx",0)
		.attr("ry",0);


	var color = d3.color(tunnelColorScale(flowData.flow_per));


	appFlowTunnel_g.selectAll("ellipse")
		.transition()
		.duration(450)
		.ease(d3.easeCubicOut)
		.delay(function(d,i){
			return i * 5;
		})
		.attr("fill",function(){

			color.opacity = 0.14;
			return color;
		})
		// .attr("stroke",function(){
		// 	var color = d3.color(tunnelColorScale(flowData.flow_per));
		// 	return color;
		// })
		// .attr("rx",flowStrokeScale(flowData.flow)/4)
		// .attr("ry",flowStrokeScale(flowData.flow)/2+2)
		.attr("rx",48/4)
		.attr("ry",48/2+2)
		// .attr("cx",function(d,i){
		// 	return appFlowTunnelSize.margin + (i+1)/maxNumTunnel*appFlowTunnelSize.width;
		// })
		.attr("cx",function(d,i){
			var j = parseInt(i/2);
			var mf;
			if(i%2==0){
				mf = 1;
			}
			else{
				mf = -1;
			}
			return appFlowTunnelSize.width/2 + j*mf*(1/maxNumTunnel*appFlowTunnelSize.width);
		})
		.attr("cy",appFlowDataSize.height);

	appFlowNum_g.select("text")
		.text(flowData.flow);

}

function moveParticles(array) {
	appFlowParticle_set = appParticle_group_set.selectAll(".new_particle") // [2019-09-18]
		.data(array)
		.enter()
		.append("circle")
		.attr("cx",0)
		.attr("cy",function(d,i){
			return appFlowChartSize.height/2 - 44/2 + i/numAppFlowParticle *44;
		})
		.attr("r",function(d){
			return 2* d.rOffset;
		})
		.attr("class",function(d,i){
			if(appFlowCircleIndex > 10000) {
				appFlowCircleIndex = 0;
			}
			d.index = ++appFlowCircleIndex ;
			return "particle new_particle" + d.index;
		})
		.attr("opacity",1);

		appFlowParticle_set.transition()
		.duration(function(d,i){
			return particleDuration;

		})
		// 동일 한 속도 보장 위해 제거 [2019-09-18]
		// .ease(d3.easeCubicOut)
		.delay(function(d){
			// return d.delay_offset * 50;
			return d3.randomInt(1, 100)() * 6; // https://d3js.org/d3-random.v2.min.js 필요 [2019-09-18]
		})
		.attr("cx",function(d,i){
			return (appParticle_group_object[0].to-appParticle_group_object[0].from)*appFlowGridUnit;
		})
		.attr("opacity",1).on("end", function(d) {
		// this.remove();
		// IE와 공통으로 쓰기위한 로직 [2019-09-18]
		d3.selectAll(".new_particle" +  + d.index).remove();
	});
}

function resizeAppFlowChartElements() {
    // 리사이즈 시에는 현재 상태(저장된 데이터 등)를 기준으로 크기만 조절
    // updateAppFlowChart를 isResize=true로 호출하거나,
    // 필요한 데이터(예: appFlowData 객체)를 전역 또는 다른 방식으로 접근하여 drawOrResize 호출
    if (typeof currentAppFlowData !== 'undefined') { // currentAppFlowData가 업데이트된 데이터를 저장한다고 가정
       drawOrResizeAppFlowElements(currentAppFlowData, true);
    }
}

// 전역 변수 currentAppFlowData 선언 (update 시 값 저장 필요)
let currentAppFlowData;

function drawOrResizeAppFlowElements(flowData, isResize) {
    currentAppFlowData = flowData; // 현재 데이터 저장

    // === 1. App Flow Data (원통) ===
    const appFlowDataContainerId = "#appFlowData";
    const appFlowDataContainerSize = getContainerSize(appFlowDataContainerId);
    const appFlowDataWidth = appFlowDataContainerSize.width;
    // 높이는 부모 높이의 절반 또는 고정값 유지 가능
    // const appFlowChartHeight = getContainerSize("#appFlow").height || 164; // appFlow 높이 가져오기 (fallback 포함)
    let appFlowChartHeight = 164; // let으로 변경 (아래에서 재할당 가능성 고려)
    const appFlowDataHeight = appFlowChartHeight / 2;
    const appFlowDataMargin = 16;

    if (appFlowDataWidth > 0 && appFlowDataHeight > 0) {
        let appFlowDataSVG = d3.select(appFlowDataContainerId).select("svg");
        let appFlowData_g;

        if (appFlowDataSVG.empty()) {
            appFlowDataSVG = d3.select(appFlowDataContainerId).append("svg");
            appFlowData_g = appFlowDataSVG.append("g").attr("class", "data-circles");
        } else {
            appFlowData_g = appFlowDataSVG.select("g.data-circles");
        }

        appFlowDataSVG.attr("width", appFlowDataWidth).attr("height", appFlowDataHeight);
        appFlowData_g.attr('transform', `translate(${appFlowDataMargin}, 12)`);

        const app_reqData = flowData.req_data;
        const app_resData = flowData.res_data;
        const app_fullData = app_resData + app_reqData;
        const app_numCircle = 40;
        const app_numBorder = app_fullData > 0 ? parseInt((app_reqData/app_fullData)*app_numCircle) : 0;

        const app_circleArray = d3.range(app_numCircle).map(i => ({
            dataType: i < app_numBorder ? "reqData" : "resData"
        }));

        const ellipses = appFlowData_g.selectAll("ellipse")
            .data(app_circleArray);

        ellipses.enter()
            .append("ellipse")
            .attr("class", d => d.dataType)
            .attr("fill", d => {
                const color = d3.color(d.dataType === "resData" ? "#D81B60" : "#4082F3");
                color.opacity = 0.26;
                return color;
            })
            .attr("rx", 12) // 크기 고정 또는 반응형 조절 가능
            .attr("ry", 28) // 크기 고정 또는 반응형 조절 가능
            .attr("cy", 32) // 위치 고정 또는 반응형 조절 가능
            .merge(ellipses) // Update existing elements
            .attr("cx", (d, i) => {
                const effectiveWidth = appFlowDataWidth - 2 * appFlowDataMargin;
                return i / app_numCircle * effectiveWidth;
            });

        ellipses.exit().remove();

        // Update legend values
        d3.select("#reqData.appDataLegend").html(`전송량 <strong>${app_reqData}mb</strong>`);
        d3.select("#resData.appDataLegend").html(`수신 <strong>${app_resData}mb</strong>`);
    }

    // === 2. App Mean Response Rate Chart ===
    const meanResRateContainerId = "#appMeanResRateChart";
    const meanResRateContainerSize = getContainerSize(meanResRateContainerId);
    const meanResRateWidth = meanResRateContainerSize.width;
    const meanResRateHeight = meanResRateContainerSize.height || 64; // 높이 fallback

    if (meanResRateWidth > 0 && meanResRateHeight > 0 && flowData.mean_res_rate !== undefined) {
        // 최초 생성 시 초기화
        if (!appMean_res_rateSVG || appMean_res_rateSVG.empty()) {
            appMean_res_rateSVG = d3.select(meanResRateContainerId).append("svg");
            appMean_res_ratePath_g = appMean_res_rateSVG.append("g").attr("class", "rate-chart");
            appMean_res_ratePath_g.append("path").attr("class", "area"); // 영역 path
            appMean_res_ratePath_g.append("path").attr("class", "line"); // 라인 path
            appCurrent_res_point = appMean_res_ratePath_g.append("circle") // 현재 값 점
                                        .attr("class","current_point")
                                        .attr("r", 2);
            appMean_res_rateArray = []; // 데이터 배열 초기화
            appMean_res_current_x = 0; // x축 카운터 초기화

            // 스케일 초기화
            appMean_res_xScale = d3.scaleLinear();
            appMean_res_yScale = d3.scaleLinear().domain([0, 25]); // Y축 고정 (0~25ms 가정)

            // 라인/영역 생성기
            appMean_res_line = d3.line()
                // .curve(d3.curveBasis) // 부드러운 곡선
                .x(d => appMean_res_xScale(d.index))
                .y(d => appMean_res_yScale(d.value));
            appMean_res_area = d3.area()
                // .curve(d3.curveBasis)
                .x(d => appMean_res_xScale(d.index))
                .y0(() => appMean_res_yScale.range()[0]) // Use range end
                .y1(d => appMean_res_yScale(d.value));

             // 최초 데이터 추가
             appMean_res_rateArray.push({ index: appMean_res_current_x, value: flowData.mean_res_rate });

        } else if (!isResize) {
             // 업데이트 시 데이터 추가
             appMean_res_current_x++;
             appMean_res_rateArray.push({ index: appMean_res_current_x, value: flowData.mean_res_rate });
             if (appMean_res_rateArray.length > appMean_res_Samples + 1) {
                 appMean_res_rateArray.shift();
             }
        }


        // 크기 및 마진 설정
        const rateMargin = { top: 5, right: 5, bottom: 5, left: 5 }; // 작은 차트용 마진
        const rateInnerWidth = meanResRateWidth - rateMargin.left - rateMargin.right;
        const rateInnerHeight = meanResRateHeight - rateMargin.top - rateMargin.bottom;

        if (rateInnerWidth > 0 && rateInnerHeight > 0) {
            appMean_res_rateSVG.attr("width", meanResRateWidth).attr("height", meanResRateHeight);
            appMean_res_ratePath_g.attr("transform", `translate(${rateMargin.left}, ${rateMargin.top})`);

            // X 스케일 도메인 및 범위 업데이트
             const rateXStart = appMean_res_rateArray.length > appMean_res_Samples
                               ? appMean_res_rateArray[appMean_res_rateArray.length - appMean_res_Samples - 1].index
                               : appMean_res_rateArray[0].index;
            const rateXEnd = appMean_res_rateArray[appMean_res_rateArray.length - 1].index;
            appMean_res_xScale.domain([rateXStart, rateXEnd]).range([0, rateInnerWidth]);


            // Y 스케일 범위 업데이트
            appMean_res_yScale.range([rateInnerHeight, 0]);
            appMean_res_area.y0(rateInnerHeight); // Update area generator base


            // 라인/영역 그리기
            const lineData = appMean_res_rateArray.length > 1 ? appMean_res_rateArray : [];
            const areaPath = appMean_res_ratePath_g.select("path.area").datum(lineData);
            const linePath = appMean_res_ratePath_g.select("path.line").datum(lineData);
            const currentPoint = appMean_res_ratePath_g.select("circle.current_point");
            const lastDataPoint = appMean_res_rateArray[appMean_res_rateArray.length - 1];

            if (isResize) { // 리사이즈 시 애니메이션 없이 즉시 반영
                areaPath.attr("d", appMean_res_area);
                linePath.attr("d", appMean_res_line);
                currentPoint.attr("cx", appMean_res_xScale(lastDataPoint.index))
                            .attr("cy", appMean_res_yScale(lastDataPoint.value));
            } else { // 데이터 업데이트 시 애니메이션
                areaPath.transition().duration(200).delay(200).attr("d", appMean_res_area);
                linePath.transition().duration(200).delay(200).attr("d", appMean_res_line);
                 currentPoint.transition().duration(200)
                            .attr("cx", appMean_res_xScale(lastDataPoint.index))
                            .attr("cy", appMean_res_yScale(lastDataPoint.value));
            }
        }

        // 값 및 레벨 텍스트 업데이트
        const rateValueElement = d3.select("#app_mean_res_rate");
        rateValueElement.html(flowData.mean_res_rate);
        const rateLevelElement = d3.select("#app_mean_res_level");

        if(flowData.mean_res_rate < 2.5) {
             rateValueElement.attr("class","normal");
             rateLevelElement.attr("class","normal col1 text_center").html("high");
        } else {
             rateValueElement.attr("class","worst");
             rateLevelElement.attr("class","worst col1 text_center").html("low");
        }
    }


    // === 3. App Flow Chart (Main) ===
    const appFlowChartContainerId = "#appFlowChart";
    const appFlowChartContainerSize = getContainerSize(appFlowChartContainerId);
    const appFlowChartWidth = appFlowChartContainerSize.width;
    appFlowChartHeight = 164; // const 제거, 기존 변수에 재할당

    if (appFlowChartWidth > 0 && appFlowChartHeight > 0) {
        let appFlowChartSVG = d3.select(appFlowChartContainerId).select("svg");

        // 최초 생성 로직 (기존 코드 활용)
        if (appFlowChartSVG.empty()) {
            isResize = false; // 생성 시에는 리사이즈 아님
            appFlowChartSVG = d3.select(appFlowChartContainerId).append("svg");
            appFlowChart_g = appFlowChartSVG.append("g"); // 메인 그룹

            // Grid, Tunnel, Particle, Node 등 초기 설정...
            // (기존 setAppFlowChart의 관련 코드 이동 및 수정)

            // Grid 설정 (크기 동적 반영)
            appFlowGridUnit = appFlowChartHeight/8;
            flowStrokeScale = d3.scaleLinear().domain([0,100]).range([0, appFlowGridUnit*0.7]);
            appFlowChart_g.append("g").attr("class", "grid-lines");

            // Tunnel 설정 (크기 동적 반영)
            maxNumTunnel = 42; // 터널 수 (고정 또는 동적)
            appFlowTunnelScale = d3.scaleLinear().domain([0,app_numCircle]).range([0,appFlowChartWidth]);
            appFlowTunnelSize = {width:appFlowChartWidth/app_numCircle , height:appFlowChartHeight};
            appFlowTunnel_g = appFlowChart_g.append("g").attr("class", "tunnels");
            appFlowNum_g = appFlowChart_g.append("g").attr("class", "tunnel-numbers");
            // ... tunnel 데이터 생성 및 초기 그리기 ...

             // 파티클 설정
             appFlowParticleArray = [];
             appFlowParticleScale = d3.scaleLinear().domain([0,100]).range([0,10]);
             appParticle_group_object = d3.select("#appFlowChart_g").append("g").attr("class", "particle_g");
             appParticle_group_set = appParticle_group_object.selectAll("g")
                                         .data(example).enter().append("g"); // example 데이터 확인 필요

             // 노드 설정
             appNodeArray = [/* 노드 데이터 */]; // 노드 데이터 정의 필요
             appFlowChart_g.append("g").attr("class", "nodes");
             // ... 노드 초기 그리기 ...

              // 블록 라인 설정
              appBlockLineDataX = appFlowChartWidth / 4;
              appBlockLineDataY = appFlowChartHeight / 4;
              appBlockLine = d3.line()
                             .x(d => d.x*appBlockLineDataX)
                             .y(d => d.y*appBlockLineDataY);
              appBlockLineScale = d3.scaleLinear().domain([0,40]).range([0,appFlowChartWidth]);
              appFlowChart_g.append("g").attr("class", "block-lines");
              // ... 블록 라인 초기 그리기 ...

        } else {
             // 기존 그룹 선택
             appFlowChart_g = appFlowChartSVG.select("g"); // 메인 그룹 선택 (더 구체적 클래스 권장)
             appFlowTunnel_g = appFlowChart_g.select("g.tunnels");
             appFlowNum_g = appFlowChart_g.select("g.tunnel-numbers");
             appParticle_group_object = appFlowChart_g.select("g.particle_g");
             // ... 다른 그룹들도 선택 ...
        }

        // SVG 크기 업데이트
        appFlowChartSVG.attr("width", appFlowChartWidth).attr("height", appFlowChartHeight);

        // --- 크기 변경에 따른 요소들 업데이트 ---

        // Grid 업데이트
        appFlowGridUnit = appFlowChartHeight / 8;
        drawGrid(appFlowChart_g.select("g.grid-lines"), appFlowChartWidth, appFlowChartHeight, appFlowGridUnit); // drawGrid 함수 필요

        // Tunnel 업데이트
        appFlowTunnelScale.range([0, appFlowChartWidth]);
        appFlowTunnelSize = { width: appFlowChartWidth / app_numCircle, height: appFlowChartHeight };
        // ... 터널 path, text 위치/크기 업데이트 ...
         const app_numCircle2 = Math.ceil(flowData.flow / 10); // 터널 개수
         const app_circleArray2 = d3.range(app_numCircle2);
         const tunnels = appFlowTunnel_g.selectAll("path.tunnel")
                            .data(app_circleArray2);
         tunnels.enter().append("path").attr("class", "tunnel flowStroke")
                // .merge(tunnels) // Update existing
                // .transition().duration(isResize ? 0 : 200) // Apply transition conditionally
                .attr("d", (d, i) => {
                     const xPos = appFlowTunnelScale(i);
                     return `M ${xPos} 0 L ${xPos + appFlowTunnelSize.width} 0 L ${xPos + appFlowTunnelSize.width} ${appFlowTunnelSize.height} L ${xPos} ${appFlowTunnelSize.height} Z`;
                 })
                 .attr("fill", (d, i) => tunnelColorScale(i * 100 / app_numCircle2)); // 색상 스케일 적용
         tunnels.exit().remove();

         // Tunnel 숫자 업데이트 (생략 - 필요시 추가)


        // Particle 업데이트 (기존 로직 활용, 스케일 범위 업데이트)
        appFlowParticleScale.range([0,10]); // 필요시 범위 조절
        numAppFlowParticle = Math.round(appFlowParticleScale(flowData.flow_per));
        appParticle_group_object.selectAll("g").remove(); // 간단하게 기존 파티클 제거 후 재생성
        appParticle_group_set = appParticle_group_object.selectAll("g")
                                   .data(d3.range(numAppFlowParticle))
                                   .enter().append("g");
        appFlowParticle_set = appParticle_group_set.append("circle")
                                   .attr("class","particle")
                                   .attr("r",2)
                                   .attr("cx",0)
                                   .attr("cy", d => Math.random()*appFlowChartHeight);
        moveParticles(appFlowParticle_set); // 파티클 이동 시작

        // Node 업데이트 (위치 재계산 필요)
        appNodeArray = getNodePositions(flowData, appFlowChartWidth, appFlowChartHeight); // 노드 위치 계산 함수 필요
        const nodes = appFlowChart_g.select("g.nodes").selectAll("g.node")
                        .data(appNodeArray, d => d.id); // id 기준으로 데이터 바인딩

        const nodeEnter = nodes.enter().append("g").attr("class", "node");
        nodeEnter.append("circle"); // 원 추가
        nodeEnter.append("text"); // 텍스트 추가

        nodes.merge(nodeEnter)
             // .transition().duration(isResize ? 0 : 200)
             .attr("transform", d => `translate(${d.x}, ${d.y})`)
             .select("circle")
             .attr("r", d => d.radius)
             .attr("class", d => d.type + "_node node_circle"); // 클래스 적용

        nodes.merge(nodeEnter)
            .select("text")
            .text(d => d.label) // 노드 라벨
            .attr("text-anchor", "middle")
            .attr("dy", d => d.radius + 12); // 텍스트 위치 조절

        nodes.exit().remove();


        // Block Line 업데이트
        appBlockLineDataX = appFlowChartWidth / 4;
        appBlockLineDataY = appFlowChartHeight / 4;
        appBlockLine.x(d => d.x*appBlockLineDataX).y(d => d.y*appBlockLineDataY); // 생성기 업데이트
        appBlockLineScale.range([0, appFlowChartWidth]); // 스케일 업데이트
        // ... 블록 라인 path 업데이트 ...
        const blockLines = appFlowChart_g.select("g.block-lines").selectAll("path.block-line")
                           .data([ flowData.user_block, flowData.application_block, flowData.source_block, flowData.flow_block ]); // 블록 데이터

        blockLines.enter().append("path").attr("class", "blockLine block-line")
                  .merge(blockLines)
                  // .transition().duration(isResize ? 0 : 200)
                  .attr("d", appBlockLine(appBlockLineData)) // 고정된 라인 데이터 사용? 확인 필요
                  .attr("transform", (d, i) => `translate(${appBlockLineScale(d)}, 0)`); // 위치 업데이트

        blockLines.exit().remove();


        // ... (기존 코드에서 크기/위치 관련 부분들을 동적 계산 값으로 수정) ...
    }

}

// Helper function to draw grid lines (implementation needed)
function drawGrid(selection, width, height, gridUnit) {
   selection.selectAll("*").remove(); // Clear previous grid
   // Draw vertical lines
   selection.selectAll("line.vertical")
        .data(d3.range(0, width + 1, gridUnit * 2)) // Adjust step as needed
        .enter().append("line")
        .attr("class", "vertical grid line axis_light")
        .attr("x1", d => d).attr("x2", d => d)
        .attr("y1", 0).attr("y2", height);
   // Draw horizontal lines
   selection.selectAll("line.horizontal")
        .data(d3.range(0, height + 1, gridUnit)) // Adjust step as needed
        .enter().append("line")
        .attr("class", "horizontal grid line axis_light")
        .attr("x1", 0).attr("x2", width)
        .attr("y1", d => d).attr("y2", d => d);
}

// Helper function to calculate node positions (implementation needed)
function getNodePositions(flowData, chartWidth, chartHeight) {
    // Based on flowData and dimensions, calculate and return an array of node objects
    // Example node object: { id: 'user', type: 'user', label: 'User', x: chartWidth * 0.1, y: chartHeight / 2, radius: 15 }
    // Implement actual positioning logic here
     return [
         { id: 'user', type: 'user', label: 'Node1', x: chartWidth * 0.1, y: chartHeight / 2, radius: 15 + flowData.user / 5 },
         { id: 'app', type: 'app', label: 'Node2', x: chartWidth * 0.3, y: chartHeight / 2, radius: 15 + flowData.application / 5 },
         { id: 'departure', type: 'departure', label: 'Node3', x: chartWidth * 0.5, y: chartHeight / 2, radius: 15 + flowData.source / 5 },
         { id: 'service', type: 'service', label: 'Node4', x: chartWidth * 0.7, y: chartHeight / 2, radius: 15 + flowData.service / 5 },
         { id: 'arrival', type: 'arrival', label: 'Node5', x: chartWidth * 0.9, y: chartHeight / 2, radius: 15 + flowData.destination / 5 }
     ];
}