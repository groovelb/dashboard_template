/*DRAW NODE LEGEND*/
var generalFlowLegendList = [
	{ title_eng: "user", title_kor: "node1" },
	{ title_eng: "departure", title_kor: "node2" },
	{ title_eng: "service", title_kor: "node3" },
	{ title_eng: "arrival", title_kor: "node4" }
];

var generalFlowLegend = d3.select("#generalFlowChartLegend")
	.selectAll("div")
	.data(generalFlowLegendList)
	.enter();

var generalFlowDataLegendList;
var generalFlowDataLegend;
var generalFlowLegend_item = generalFlowLegend.append("div")
	.attr("class", "flex_row align_center");



var general_reqData;
var general_resData;
var general_fullData;
var general_numCircle;

/*데이터의 타입이 바뀌는 첫번째 원의 인덱스*/
var generalFlowData_g;
var general_numBorder;
var generalFlowData;
var general_dataScale;

/*이전 세션의 평균 응답속도 저장하는 배열*/
var generalMean_res_rateArray = [];
var generalMean_res_rateSVG;
var generalMean_res_rateSVG_g;
var generalMean_res_ratePath_g
var generalMean_res_rateSize = { width: 0, height: 0, margin_left: 0, margin_top: 0, margin_right: 0, margin_bottom: 0 };
var generalMean_res_innerWidth;
var generalMean_res_innerHeight;
var generalMean_res_xScale;
var generalMean_res_Samples = 60;
var generalMean_res_Xmax;
var generalMean_res_current_x;
var generalMean_res_xAxis;
var generalMean_res_yScale;
var generalMean_res_line;
var generalMean_res_area;
var generalCurrent_res_point;

/*DRAW APP Flow Chart SVG*/
var generalFlowChartSize = { width: 0, height: 164 };
var generalFlowDataSize = { width: 0, height: generalFlowChartSize.height / 2, margin: 16 };
var generalFlowChartSVG;
var generalFlowChart_g;

/*Set Grid Unit of APP FLOW CHART*/
var generalFlowGridUnit;
var flowStrokeScale;

/*Drawn Flow Tunnel*/
var maxNumTunnel = 42;
var generalFlowTunnelScale;

var generalFlowTunnelSize;
var generalFlowTunnel_g;
var generalFlowNum_g;
var tunnelColorScale = d3.scaleLinear().domain([0, 25, 26, 50, 51, 75, 76, 100])
	.range(["#00C853", "#00C853", "#FFD600", "#FFD600", "#FFAB00", "#FFAB00", "#ff7600", "#ff7600"]);



/*flow tunnel을 그리기 위한 가상의 오브젝트*/
var general_numCircle2;
var general_circleArray2;

/*Draw Flow Particle*/
/*파티클을 위한 가상의 오브젝트*/
var generalFlowParticleArray = [[], [], [], []];
var generalFlowParticleScale;
var numgeneralFlowParticle;


var generalParticle_group_object;
var example = [{}, {}, {}, {}];
var generalParticle_group_set;
var generalFlowParticle_set;


/*Draw Node*/
/*Set Node Array*/
var generalNodeArray;
var generalNodeItem;

/*Block Line*/
var generalBlockLineData = [
	{ 'x': 0, "y": 0 },
	{ 'x': 0.25, "y": 0 },
	{ 'x': 0.5, "y": 0 },
	{ 'x': 0.75, "y": 0 },
	{ 'x': 1, "y": 0 },
	{ 'x': 1, "y": 0.25 },
	{ 'x': 1, "y": 0.5 },
	{ 'x': 1, "y": 0.75 },
	{ 'x': 1, "y": 1 },
	{ 'x': 1, "y": 1.25 }
];

var generalBlockLineDataX;
var generalBlockLineDataY;
var generalBlockLine;
var generalBlockLineScale;


function setGeneralFlowChart(flowData) {


	/*DRAW APP FLOW LEGEND*/


	generalFlowLegend_item.append("div")
		.attr("class", function (d) {
			return "circle_legend " + d.title_eng + "_bg";
		});

	generalFlowLegend_item.append("span")
		.attr("class", function (d) {
			return " " + d.title_eng;
		})
		.style("margin-right", "12px")
		.html(function (d) {
			return d.title_kor;
		});


	/*DRAW APP FLOW DATA AMOUNT*/
	generalFlowDataSize.width = $("#generalFlowData").width();

	general_reqData = flowData.req_data;
	general_resData = flowData.res_data;
	general_fullData = general_resData + general_reqData;
	general_numCircle = 40;
	/*데이터의 타입이 바뀌는 첫번째 원의 인덱스*/
	general_numBorder = parseInt((general_reqData / general_fullData) * general_numCircle);

	generalFlowData = d3.select("#generalFlowData")
		.append("svg")
		.attr("width", generalFlowDataSize.width)
		.attr("height", generalFlowDataSize.height);

	general_dataScale = d3.scaleLinear()
		.domain([0, general_fullData])
		.range([0, 40]);

	/*원통을 그리기 위한 가상의 오브젝트*/
	var general_circleArray = [];
	for (i = 0; i < general_numCircle; i++) {
		if (i < general_numBorder) {
			general_circleArray.push({ dataType: "reqData" });
		}
		else {
			general_circleArray.push({ dataType: "resData" });
		}
	}

	generalFlowData_g = generalFlowData.append("g")
		.attr('transform', 'translate(' + generalFlowDataSize.margin + ',' + 12 + ')');

	generalFlowData_g.selectAll("ellipse")
		.data(general_circleArray)
		.enter()
		.append("ellipse")
		.attr("class", function (d) {
			return d.dataType;
		})
		.attr("fill", function (d) {
			if (d.dataType == "resData") {
				var color = d3.color("#D81B60");
			}
			else {
				var color = d3.color("#004AE4");
			}
			color.opacity = 0.26;
			return color;
		})
		.attr("rx", 12)
		.attr("ry", 28)
		.attr("cy", 32)
		.attr("cx", function (d, i) {
			return i / 40 * (generalFlowDataSize.width - 2 * generalFlowDataSize.margin);
		});


	/*DRAW APP FLOW LEGEND*/
	generalFlowDataLegendList = [
		{ title_eng: "reqData", title_kor: "part1", value: general_reqData },
		{ title_eng: "resData", title_kor: "part2", value: general_resData },
	];

	generalFlowDataLegend = d3.select("#generalFlowDataLegend")
		.selectAll(".generalFlowDataLegendItem")
		.data(generalFlowDataLegendList)
		.enter()
		.append("div")
		.attr("class", "flex_row align_center generalFlowDataLegendItem");

	generalFlowDataLegend.append("p")
		.attr("class", function (d) {
			return "circle_legend " + d.title_eng + "_bg left_align";
		})
		.style("margin", "3px 4px 0 0");

	generalFlowDataLegend.append("span")
		.attr("class", function (d) {
			return "appDataLegend left_align " + d.title_eng;
		})
		.attr("id", function (d) {
			return d.title_eng;
		})
		.style("margin-right", "12px")
		.html(function (d) {
			return d.title_kor + " " + "<strong>" + d.value + "mb" + "</strong>";
		});

	/*SET AVERAGE RESPONSE SPEED*/
	d3.select("#general_mean_res_rate").attr("class", function () {
		if (flowData.mean_res_rate < 2.5) {
			return "normal";
		}
		else {
			return "worst";
		}
	})
		.html(flowData.mean_res_rate);

	d3.select("#general_mean_res_level").attr("class", function () {
		if (flowData.mean_res_rate < 2.5) {
			return "normal col1 text_center";
		}
		else {
			return "worst col1 text_center";
		}
	})
		.style("margin-top", "-8px")
		.html(function () {
			if (flowData.mean_res_rate < 2.5) {
				return "high";
			}
			else {
				return "low";
			}
		});

	/*SET AVERATE RESPONSE SPEED LINE GRAPH*/
	generalMean_res_rateArray.push({ rate: flowData.mean_res_rate, index: 0 });

	generalMean_res_rateSize = { width: 0, height: 0, margin_left: 44, margin_top: 8, margin_right: 4, margin_bottom: 24 };
	generalMean_res_rateSize.width = $("#generalMeanResRateChart").width();
	generalMean_res_rateSize.height = 96;
	generalMean_res_rateSVG = d3.select("#generalMeanResRateChart").append("svg")
		.attr("width", generalMean_res_rateSize.width)
		.attr("height", generalMean_res_rateSize.height);

	generalMean_res_innerWidth = generalMean_res_rateSize.width - generalMean_res_rateSize.margin_left - generalMean_res_rateSize.margin_right;
	generalMean_res_innerHeight = generalMean_res_rateSize.height - generalMean_res_rateSize.margin_top - generalMean_res_rateSize.margin_bottom;

	generalMean_res_rateGrid_g = generalMean_res_rateSVG.append("g")
		.attr("transform", "translate(" + generalMean_res_rateSize.margin_left + "," + generalMean_res_rateSize.margin_top + ")");

	generalMean_res_rateSVG_g = generalMean_res_rateSVG.append("g")
		.attr("transform", "translate(" + generalMean_res_rateSize.margin_left + "," + generalMean_res_rateSize.margin_top + ")");


	generalMean_res_Xmax = 0;
	generalMean_res_current_x = 0;
	generalMean_res_xScale = d3.scaleLinear()
		.domain([0, generalMean_res_Xmax])
		.range([generalMean_res_innerWidth * (1 - generalMean_res_Xmax / generalMean_res_Samples), generalMean_res_innerWidth]);

	var generalMean_res_grid_xScale = d3.scaleLinear()
		.domain([0, 30])
		.range([0, generalMean_res_innerWidth]);


	generalMean_res_yScale = d3.scaleLinear()
		.domain([0, 20])
		.range([generalMean_res_innerHeight, 0]);

	generalMean_res_line = d3.line()
		.curve(d3.curveCardinal)
		.x(function (d) { return generalMean_res_xScale(d.index); })
		.y(function (d) { return generalMean_res_yScale(d.rate); })

	generalMean_res_area = d3.area()
		.curve(d3.curveCardinal)
		.x(function (d) { return generalMean_res_xScale(d.index); })
		.y0(function (d) { return generalMean_res_yScale(0); })
		.y1(function (d) { return generalMean_res_yScale(d.rate); })


	generalMean_res_rateSVG_g.append("path")
		.attr("class", "green_line")
		.attr("d", generalMean_res_line(generalMean_res_rateArray));

	generalMean_res_rateSVG_g.append("path")
		.attr("class", "green_area")
		.attr("d", generalMean_res_area(generalMean_res_rateArray));


	generalMean_res_rateSVG_g.append("circle")
		.attr("class", "current_point")
		.attr("r", 2)
		.attr("cx", generalMean_res_xScale(generalMean_res_rateArray[0].index))
		.attr("cy", generalMean_res_yScale(generalMean_res_rateArray[0].rate));

	var generalMean_res_xAxis_ticks = [];

	for (i = 0; i < generalMean_res_Xmax; i++) {
		if (i % 20 == 0) {
			generalMean_res_xAxis_ticks.push(i);
		}
	}
	generalMean_res_xAxis = d3.axisBottom(generalMean_res_xScale).tickValues(generalMean_res_xAxis_ticks);

	generalMean_res_rateSVG_g.append("g")
		.attr("class", "x axis_light")
		.attr("transform", "translate(0," + generalMean_res_innerHeight + ")")
		.call(generalMean_res_xAxis);

	generalMean_res_rateGrid_g.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + generalMean_res_innerHeight + ")")
		.call(d3.axisBottom(generalMean_res_grid_xScale).tickValues([0, 10, 20, 30])
			.tickSize(-generalMean_res_innerHeight)
			.tickFormat("")
		);

	generalMean_res_rateSVG_g.append("g")
		.attr("class", "y axis_light")
		.attr("transform", "translate(0,0)")
		.call(d3.axisLeft(generalMean_res_yScale).tickValues([0, 10, 20])); // Create an axis component with d3.axisBottom

	generalMean_res_rateGrid_g.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0,0)")
		.call(d3.axisLeft(generalMean_res_yScale).tickValues([0, 10, 20])
			.tickSize(-generalMean_res_innerWidth)
			.tickFormat("")
		);


	/*DRAW APP Flow Chart SVG*/
	generalFlowChartSize = { width: 0, height: 164 };
	generalFlowChartSize.width = $("#generalFlow").width();


	generalFlowChartSVG = d3.select("#generalFlowChart").append("svg")
		.attr("width", generalFlowChartSize.width)
		.attr("height", generalFlowChartSize.height);

	generalFlowChart_g = generalFlowChartSVG.append("g")
		.attr("transform", "translate(0,-16)");

	/*Set Grid Unit of APP FLOW CHART*/
	generalFlowGridUnit = generalFlowChartSize.width / 6;
	flowStrokeScale = d3.scaleLinear()
		.domain([0, 1000])
		.range([16, 48]);



	/*Draw Flow Line*/
	generalFlowChart_g.append("line")
		.attr("x1", 0 * generalFlowGridUnit + generalFlowGridUnit * 1 / 2 + 4)
		.attr("x2", 5 * generalFlowGridUnit + generalFlowGridUnit * 1 / 2 + 4)
		.attr("y1", generalFlowChartSize.height / 2)
		.attr("y2", generalFlowChartSize.height / 2)
		.attr("class", "flowStroke")
		.attr("stroke-width", function () {
			// return flowStrokeScale(flowData.flow);
			return 48;
		});



	/*Draw Flow Particle*/
	/*파티클을 위한 가상의 오브젝트*/
	generalFlowParticleArray = [[], [], [], []];
	generalFlowParticleScale = d3.scaleLinear()
		.domain([0, 1000])
		.range([0, 400]);

	numgeneralFlowParticle = generalFlowParticleScale(flowData.flow);

	/*파티클에 바인딩할 객체*/
	for (j = 0; j < 4; j++) {
		for (i = 0; i < numgeneralFlowParticle; i++) {
			var particle = {
				"delay_offset": Math.floor(Math.random() * 100),
				group: j,
				rOffset: Math.floor(Math.random() * 1) + 1
			}
			generalFlowParticleArray[j].push(particle);
		}
	}

	/*이동할 위치를 정하기 위한 파티클 그룹 객체*/
	generalParticle_group_object = [
		{ from: 1, to: 2, duration_offset: 1 },
		{ from: 2, to: 5, duration_offset: 2.5 },
		{ from: 5, to: 6, duration_offset: 1 }
	];

	example = [{}, {}, {}, {}];

	generalParticle_group_set = generalFlowChart_g.selectAll(".generalParticle_group")
		.data(generalParticle_group_object)
		.enter()
		.append("g")
		.attr("class", function (d, i) {
			return "generalParticle_group" + i;
		})
		.attr("transform", function (d) {
			return "translate(" + (d.from - 0.5) * generalFlowGridUnit + ",0)";
		});


	generalFlowParticle_set = generalParticle_group_set.selectAll("circle")
		.data(function (d, i) {
			return generalFlowParticleArray[i];
		})
		.enter()
		.append("circle")
		.attr("cx", 0)
		.attr("cy", function (d, i) {
			return generalFlowChartSize.height / 2 - flowStrokeScale(flowData.flow) / 2 + i / numgeneralFlowParticle * flowStrokeScale(flowData.flow)
		})
		.attr("r", function (d) {
			return 2 * d.rOffset;
		})
		.attr("class", "particle")
		.attr("opacity", 1);

	generalFlowParticle_set.transition()
		.duration(function (d, i) {
			return 500 * generalParticle_group_object[d.group].duration_offset;

		})
		// .ease(d3.easeCubicOut)
		.delay(function (d) {
			return d.delay_offset * 50;
		})
		.attr("cx", function (d, i) {
			return (generalParticle_group_object[d.group].to - generalParticle_group_object[d.group].from) * generalFlowGridUnit;
		})
		.attr("opacity", 1);


	/*Draw Node*/
	/*Set Node Array*/
	generalNodeArray = [
		{ node_title_eng: "user_node", node_title_kor: "node1", index: 1, value: flowData.user, block: flowData.user_block },
		{ node_title_eng: "departure_node", node_title_kor: "node2", index: 2, value: flowData.source, block: flowData.source_block },
		{ node_title_eng: "service_node", node_title_kor: "node3", index: 5, value: flowData.service, block: 0 },
		{ node_title_eng: "arrival_node", node_title_kor: "node4", index: 6, value: flowData.destination, block: 0 }
	];

	/*Draw Node Circle*/
	generalNodeItem = generalFlowChart_g.selectAll(".node")
		.data(generalNodeArray)
		.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", function (d) {
			return "translate(" + generalFlowGridUnit * (d.index - 1) + ",0)";
		});


	generalBlockLineDataX = d3.scaleLinear().domain([0, 1]).range([0, generalFlowGridUnit * 1 / 2]);
	generalBlockLineDataY = d3.scaleLinear().domain([0, 1]).range([0, generalFlowGridUnit * 1 / 2]);
	var blockMax = d3.max(generalNodeArray.map(function (d) { return d.block }));
	generalBlockLineScale = d3.scaleLinear().domain([0, 1, blockMax]).range([0, 2, 5]);


	generalBlockLine = d3.line()
		.curve(d3.curveBundle.beta(1))
		.x(function (d) { return generalFlowGridUnit * 1 / 2 + generalBlockLineDataX(d['x']); })
		.y(function (d) { return generalFlowChartSize.height / 2 + generalBlockLineDataX(d['y']); });


	// generalFlowChartSVG.append("defs").append("marker")
	//       .attr("id", "arrow1") // 해당 요소의 id을 추가하고요. 
	//       .attr("markerUnits", "strokeWidth") 
	//       .attr("markerWidth", "2").attr("markerHeight", "2")// 너비와 높이를 정해주고, 
	//       .attr("viewBox", "0 -5 10 10")//해당 개체가 어떻게 보여줄지 정하고, 
	//       .attr("refX", "5").attr("refY", "0") 
	//       // marker가 선에 그려질 경우 어떤 포인트에서 그려질지를 정합니다. 
	//       // 예를 들어, viewbox가 "0 0 12 12"인 상태에서 각각 6으로 잡을 경우에는 중점이 딱 떨어지게 되겠죠.
	//       .attr("orient", "auto")// 이걸 없애면 선의 방향에 맞춰서 그려지지 않습니다.
	//       .append("path")
	//       .attr("d","M0,-5L10,0L0,5")
	//       .attr("fill","#f26e88")
	//       .attr("class","arrowHead");




	generalNodeItem.append("path")
		.attr('d', generalBlockLine(generalBlockLineData))
		.attr("fill", "none")
		.attr("stroke", "#f26e88")
		.attr("stroke-width", function (d) {
			return generalBlockLineScale(d.block);
		})
		.attr("marker-end", "url(#arrow)")
		.attr("opacity", 0)
		.transition()
		.duration(800)
		.attr("opacity", 1)
		.attr("marker-end", "url(#arrow1)");

	//[2019-09-20] mark-end용 path 추가
	var markend = generalNodeItem.append("g")
		.attr("transform", "translate(82.5,133)rotate(90)")
		.append("path")
		.attr("d", function (d) {
			if (0 < d.block) {
				return "M0,-5L10,0L0,5";
			}
			else {
				return "";
			}

		})
		.attr("fill", "#f26e88")
		.attr("opacity", 0)
		.transition()
		.duration(800)
		.attr("opacity", 1);

	generalNodeItem.append("text")
		.attr("class", "blockText font-bold")
		.attr("text-anchor", "middle")
		.attr("x", generalFlowGridUnit)
		.attr("y", generalFlowChartSize.height / 2 + 80)
		.text(function (d) {
			if (0 < d.block) {
				return "차단" + d.block + "건";
			} else {
				return "";
			}

		});

	generalNodeItem.append("circle")
		.attr("class", function (d) {
			return d.node_title_eng;
		})
		.attr("r", 24)
		.attr("cx", function (d) {
			return generalFlowGridUnit * 1 / 2;
		})
		.attr("cy", generalFlowChartSize.height / 2);


	generalNodeItem.append("text")
		.attr("x", function (d) {
			return generalFlowGridUnit * 1 / 2;
		})
		.attr("y", generalFlowChartSize.height / 2 + 4)
		.text(function (d) {
			return d.value;
		})
		.attr("text-anchor", "middle")
		.attr("fill", "#ffffff");


	/*Drawn Flow Tunnel*/
	maxNumTunnel = 42;
	generalFlowTunnelScale = d3.scaleLinear()
		.domain([0, 1000])
		.range([12, maxNumTunnel]);

	generalFlowTunnelSize = { width: generalFlowGridUnit * 1.4, margin: 0 }


	generalFlowTunnel_g = generalFlowChart_g.append("g")
		.attr("transform", "translate(" + generalFlowGridUnit * 2.3 + ",0)");

	generalFlowNum_g = generalFlowChart_g.append("g")
		.attr("transform", "translate(" + generalFlowGridUnit * 2.3 + ",0)");


	/*flow tunnel을 그리기 위한 가상의 오브젝트*/
	general_numCircle2 = parseInt(generalFlowTunnelScale(flowData.flow));
	general_circleArray2 = [];


	generalFlowTunnelSize.margin = ((maxNumTunnel - general_numCircle2) / maxNumTunnel) * generalFlowTunnelSize.width / 2;

	for (i = 0; i < general_numCircle2; i++) {
		general_circleArray2.push({ dataType: "flow" });
	}

	generalFlowTunnel_g.selectAll("ellipse")
		.data(general_circleArray2)
		.enter()
		.append("ellipse")
		.attr("class", "tunnel_ellipse")
		.attr("fill", function () {
			var color = d3.color(tunnelColorScale(flowData.flow_per));
			color.opacity = 0.14;
			return color;
		})
		// .attr("stroke", function () {
		// 	var color = d3.color(tunnelColorScale(flowData.flow_per));
		// 	return color;
		// })
		.attr("stroke-width", 0)
		// .attr("rx",flowStrokeScale(flowData.flow)/4)
		// .attr("ry",flowStrokeScale(flowData.flow)/2+2)
		// .attr("cx",function(d,i){
		// 	return generalFlowTunnelSize.margin + (i+1)/maxNumTunnel*generalFlowTunnelSize.width;
		// })
		.attr("rx", 48 / 4)
		.attr("ry", 48 / 2 + 2)
		.attr("cx", function (d, i) {
			var j = parseInt(i / 2);
			/*multifier for positioning*/
			var mf;
			if (i % 2 == 0) {
				mf = 1;
			}
			else {
				mf = -1;
			}
			return (generalFlowTunnelSize.width / 2) + j * mf * (1 / maxNumTunnel * generalFlowTunnelSize.width);
		})
		.attr("cy", generalFlowDataSize.height);

	generalFlowNum_g.append("text")
		.attr("class", "flowNum font-bold text_shadow")
		.attr("fill", "#ffffff")
		.attr("text-anchor", "middle")
		.attr("x", generalFlowTunnelSize.width / 2)
		.attr("y", generalFlowDataSize.height + 4)
		.text(flowData.flow);


}

function updateGeneralFlowChart(flowData) {

	/*데이터 전송.수신량 범례 업데이트*/
	general_reqData = flowData.req_data;
	general_resData = flowData.res_data;
	general_fullData = general_resData + general_reqData;


	var generalFlowDataLegendList2 = [
		{ title_eng: "reqData", title_kor: "part-A", value: general_reqData },
		{ title_eng: "resData", title_kor: "part-B", value: general_resData },
	];

	var dummy = [
	];

	var dataLegend = d3.select("#generalFlowDataLegend")
		.selectAll("div")
		.data(dummy)
		.exit().remove();

	var dataLegend = d3.select("#generalFlowDataLegend")
		.selectAll("div")
		.data(generalFlowDataLegendList2)
		.enter()
		.append("div")
		.attr("class", "flex_row align_center generalFlowDataLegendItem");

	dataLegend.append("p")
		.attr("class", function (d) {
			return "circle_legend " + d.title_eng + "_bg left_align";
		})
		.style("margin", "3px 4px 0 0");

	dataLegend.append("span")
		.attr("class", function (d) {
			return "appDataLegend left_align " + d.title_eng;
		})
		.attr("id", function (d) {
			return d.title_eng;
		})
		.style("margin-right", "12px")
		.html(function (d) {
			return d.title_kor + " " + "<strong>" + d.value + "mb" + "</strong>";
		});


	/*데이터 터널 업데이트*/
	/*데이터의 타입이 바뀌는 첫번째 원의 인덱스*/
	general_numBorder = parseInt((general_reqData / general_fullData) * general_numCircle);

	general_dataScale = d3.scaleLinear()
		.domain([0, general_fullData])
		.range([0, 40]);

	/*원통을 그리기 위한 가상의 오브젝트*/
	var general_circleArray = [];
	for (i = 0; i < general_numCircle; i++) {
		if (i < general_numBorder) {
			general_circleArray.push({ dataType: "reqData" });
		}
		else {
			general_circleArray.push({ dataType: "resData" });
		}
	}


	var dataCircle = generalFlowData_g.selectAll("ellipse")
		.data(general_circleArray);

	dataCircle.enter();

	dataCircle.transition()
		.delay(function (d, i) {
			return i * 10;
		})
		.attr("class", function (d) {
			return d.dataType;
		})
		.attr("fill", function (d) {
			if (d.dataType == "resData") {
				var color = d3.color("#D81B60");
			}
			else if (d.dataType == "reqData") {
				var color = d3.color("#004AE4");
			}
			color.opacity = 0.26;
			return color;
		});


	/*응답속도 표시*/
	/*SET AVERAGE RESPONSE SPEED*/
	d3.select("#general_mean_res_rate").attr("class", function () {
		if (flowData.mean_res_rate < 2.5) {
			return "normal";
		}
		else {
			return "worst";
		}
	})
		.html(flowData.mean_res_rate);

	d3.select("#general_mean_res_level").attr("class", function () {
		if (flowData.mean_res_rate < 2.5) {
			return "normal col1 text_center";
		}
		else {
			return "worst col1 text_center";
		}
	})
		.style("margin-top", "-8px")
		.html(function () {
			if (flowData.mean_res_rate < 2.5) {
				return "high";
			}
			else {
				return "low";
			}
		});

	/*SET AVERATE RESPONSE SPEED LINE GRAPH*/
	generalMean_res_current_x++;
	generalMean_res_rateArray.push({ rate: flowData.mean_res_rate, index: generalMean_res_current_x });

	if (generalMean_res_Samples <= generalMean_res_rateArray.length) {
		generalMean_res_rateArray.shift();
	}
	var last_idx = generalMean_res_rateArray.length - 1;

	generalMean_res_Xmax = generalMean_res_rateArray.length;

	/*현재 세션의 순번이 샘플수보다 작을때*/
	if (generalMean_res_current_x < generalMean_res_Samples) {
		generalMean_res_xScale.domain([0, generalMean_res_Xmax - 1])
			.range([generalMean_res_innerWidth * (1 - generalMean_res_Xmax / generalMean_res_Samples), generalMean_res_innerWidth]);
	}
	/*현재 세션의 순번이 샘플보다 클때*/
	else {
		generalMean_res_xScale.domain([generalMean_res_current_x - (generalMean_res_Xmax - 1), generalMean_res_current_x])
			.range([generalMean_res_innerWidth * (1 - (generalMean_res_Xmax) / generalMean_res_Samples), generalMean_res_innerWidth]);
	}



	var generalMean_res_xAxis_ticks = [];

	for (i = generalMean_res_current_x; 0 <= i; i--) {
		if (i % 20 == 0) {
			generalMean_res_xAxis_ticks.push(i);
		}
		if (generalMean_res_xAxis_ticks.length == 3) {
			break;
		}
		/*max값보다 클경우 틱값에서 0을 뻬줌*/
	}
	//    if(3<generalMean_res_xAxis_ticks.length){
	//    	console.log(generalMean_res_xAxis_ticks);
	// 	generalMean_res_xAxis_ticks.shift();
	// }
	generalMean_res_xAxis.tickValues(generalMean_res_xAxis_ticks);
	generalMean_res_rateSVG_g.select(".x")
		.transition()
		.duration(200)
		.call(generalMean_res_xAxis);

	if (generalMean_res_rateArray.length < generalMean_res_Samples) {
		generalMean_res_rateSVG_g.append("line")
			.attr("class", "moving_line green_line")
			.attr("x1", generalMean_res_xScale(generalMean_res_rateArray[last_idx].index))
			.attr("x2", generalMean_res_xScale(generalMean_res_rateArray[last_idx].index))
			.attr("y1", generalMean_res_yScale(generalMean_res_rateArray[last_idx].rate))
			.attr("y2", generalMean_res_yScale(generalMean_res_rateArray[last_idx].rate))
			.transition()
			.duration(200)
			.attr("x2", generalMean_res_xScale(generalMean_res_rateArray[last_idx].index))
			.attr("y2", generalMean_res_yScale(generalMean_res_rateArray[last_idx].rate))
			.on('end', function () {
				d3.select(this).remove();
			});
	}
	generalMean_res_rateSVG_g.select(".current_point")
		.transition()
		.duration(200)
		.attr("cx", generalMean_res_xScale(generalMean_res_rateArray[last_idx].index))
		.attr("cy", generalMean_res_yScale(generalMean_res_rateArray[last_idx].rate));



	generalMean_res_rateSVG_g.select(".green_line")
		.transition()
		.duration(0)
		.delay(220)
		.attr("d", generalMean_res_line(generalMean_res_rateArray));

	generalMean_res_rateSVG_g.select(".green_area")
		.transition()
		.duration(0)
		.delay(220)
		.attr("d", generalMean_res_area(generalMean_res_rateArray));

	/*Draw Node*/
	/*Set Node Array*/
	generalNodeArray = [
		{ node_title_eng: "user_node", node_title_kor: "사용자", index: 1, value: flowData.user, block: flowData.user_block },
		{ node_title_eng: "departure_node", node_title_kor: "출발지node", index: 2, value: flowData.source, block: flowData.source_block },
		{ node_title_eng: "service_node", node_title_kor: "서비스", index: 5, value: flowData.service, block: 0 },
		{ node_title_eng: "arrival_node", node_title_kor: "도착지node", index: 6, value: flowData.destination, block: 0 }
	];

	/*Draw Node Circle*/
	generalNodeItem = generalFlowChart_g.selectAll(".node")
		.data(dummy)
		.exit()
		.remove();

	generalNodeItem = generalFlowChart_g.selectAll(".node")
		.data(generalNodeArray)
		.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", function (d) {
			return "translate(" + generalFlowGridUnit * (d.index - 1) + ",0)";
		});

	generalNodeItem.append("path")
		.attr('d', generalBlockLine(generalBlockLineData))
		.attr("fill", "none")
		.attr("stroke", "#f26e88")
		.attr("stroke-width", function (d) {
			return generalBlockLineScale(d.block);
		})
		.attr("marker-end", "url(#arrow)")
		.attr("opacity", 0)
		.transition()
		.duration(800)
		.attr("opacity", 1)
		.attr("marker-end", "url(#arrow1)");


	//[2019-09-20] mark-end용 path 추가
	var markend = generalNodeItem.append("g")
		.attr("transform", "translate(82.5,133)rotate(90)")
		.append("path")
		.attr("d", function (d) {
			if (0 < d.block) {
				return "M0,-5L10,0L0,5";
			}
			else {
				return "";
			}

		})
		.attr("fill", "#f26e88")
		.attr("opacity", 0)
		.transition()
		.duration(800)
		.attr("opacity", 1);


	generalNodeItem.append("text")
		.attr("x", generalFlowGridUnit)
		.attr("y", generalFlowChartSize.height / 2 + 80)
		.text(function (d) {
			if (0 < d.block) {
				return "exit: " + d.block + "";
			} else {
				return "";
			}
		})
		.attr("class", "blockText font-bold")
		.attr("text-anchor", "middle");


	generalNodeItem.append("circle")
		.attr("class", function (d) {
			return d.node_title_eng + ' node';
		})
		.attr("r", 24)
		.attr("cx", function (d) {
			return generalFlowGridUnit * 1 / 2;
		})
		.attr("cy", generalFlowChartSize.height / 2);


	generalNodeItem.append("text")
		.attr("x", function (d) {
			return generalFlowGridUnit * 1 / 2;
		})
		.attr("y", generalFlowChartSize.height / 2 + 4)
		.text(function (d) {
			return d.value;
		})
		.attr("text-anchor", "middle")
		.attr("fill", "#ffffff");


	/*Transition for Particle path*/
	generalFlowChart_g.select("line")
		.transition()
		.duration(550)
		.ease(d3.easeCubicOut)
		.attr("stroke-width", function () {
			// return flowStrokeScale(flowData.flow);
			return 48;
		});


	generalFlowParticleArray = [[], [], [], []];
	numgeneralFlowParticle = generalFlowParticleScale(flowData.flow);

	/*파티클에 바인딩할 객체*/
	for (j = 0; j < 4; j++) {
		for (i = 0; i < numgeneralFlowParticle; i++) {
			var particle = {
				"delay_offset": Math.floor(Math.random() * 100),
				"group": j,
				"rOffset": Math.floor(Math.random() * 1) + 1
			}
			generalFlowParticleArray[j].push(particle);
		}
	}

	// generalFlowParticle_set.interrupt();

	var newParticles = generalParticle_group_set.selectAll("circle")
		.data(function (d, i) {
			return generalFlowParticleArray[i];
		});

	newParticles.exit().remove();

	newParticles.enter()
		.append("circle")
		.attr("class", "particle")
		.attr("r", 2)
		.attr("opacity", 1);

	generalParticle_group_set.selectAll("circle")
		.attr("opacity", 1)
		.attr("cx", 0)
		.attr("cy", function (d, i) {
			return generalFlowChartSize.height / 2 - 44 / 2 + i / numgeneralFlowParticle * 44;
		})
		.transition()
		.duration(function (d, i) {
			return 500 * generalParticle_group_object[d.group].duration_offset;

		})
		// .ease(d3.easeCubicOut)
		.delay(function (d) {
			return d.delay_offset * 50;
		})
		.attr("cx", function (d, i) {
			return (generalParticle_group_object[d.group].to - generalParticle_group_object[d.group].from) * generalFlowGridUnit;
		})
		.attr("opacity", 1);


	/*flow tunnel을 그리기 위한 가상의 오브젝트*/
	/*App Flow per에 따라 길이가 변경되는것이 맞는지*/
	general_numCircle2 = parseInt(generalFlowTunnelScale(flowData.flow));
	// general_numCircle2 = 42;
	general_circleArray2 = [];


	generalFlowTunnelSize.margin = ((maxNumTunnel - general_numCircle2) / maxNumTunnel) * generalFlowTunnelSize.width / 2;

	for (i = 0; i < general_numCircle2; i++) {
		general_circleArray2.push({ dataType: "flow" });
	}

	var tunnel_circles = generalFlowTunnel_g.selectAll(".tunnel_ellipse")
		.data(general_circleArray2);

	tunnel_circles.exit().remove();

	tunnel_circles
		.enter()
		.append("ellipse")
		.attr("class", "tunnel_ellipse")
		.attr("cx", function (d, i) {
			return generalFlowTunnelSize.margin + (i + 1) / maxNumTunnel * generalFlowTunnelSize.width;
		})
		.attr("cy", generalFlowDataSize.height)
		.attr("rx", 0)
		.attr("ry", 0);

	generalFlowTunnel_g.selectAll("ellipse")
		.data(general_circleArray2)
		.enter()
		.append("ellipse")
		.attr("cx", function (d, i) {
			return generalFlowTunnelSize.margin + (i + 1) / maxNumTunnel * generalFlowTunnelSize.width;
		})
		.attr("cy", generalFlowDataSize.height);

	generalFlowTunnel_g.selectAll("ellipse")
		.transition()
		.duration(450)
		.ease(d3.easeCubicOut)
		.delay(function (d, i) {
			return i * 5;
		})
		.attr("fill", function () {
			var color = d3.color(tunnelColorScale(flowData.flow_per));
			color.opacity = 0.14;
			return color;
		})
		// .attr("stroke", function () {
		// 	var color = d3.color(tunnelColorScale(flowData.flow_per));
		// 	return color;
		// })
		// .attr("rx",flowStrokeScale(flowData.flow)/4)
		// .attr("ry",flowStrokeScale(flowData.flow)/2+2)
		// .attr("cx",function(d,i){
		// 	return generalFlowTunnelSize.margin + (i+1)/maxNumTunnel*generalFlowTunnelSize.width;
		// })
		.attr("rx", 48 / 4)
		.attr("ry", 48 / 2 + 2)
		.attr("cx", function (d, i) {
			var j = parseInt(i / 2);
			/*multifier for positioning*/
			var mf;
			if (i % 2 == 0) {
				mf = 1;
			}
			else {
				mf = -1;
			}
			return (generalFlowTunnelSize.width / 2) + j * mf * (1 / maxNumTunnel * generalFlowTunnelSize.width);
		})
		.attr("cy", generalFlowDataSize.height);

	generalFlowNum_g.select("text")
		.text(flowData.flow);

}