/*DRAW NODE LEGEND*/
var appFlowLegendList = [
		{title_eng:"user",title_kor:"사용자"},
		{title_eng:"app",title_kor:"어플리케이션"},
		{title_eng:"departure",title_kor:"출발지노드"},
		{title_eng:"service",title_kor:"서비스"},
		{title_eng:"arrival",title_kor:"도착지노드"}
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
  							           .range(["#00C853","#00C853","#FFD600","#FFD600", "#FFAB00","#FFAB00", "#ff7600","#ff7600"]);



/*flow tunnel을 그리기 위한 가상의 오브젝트*/
var app_numCircle2;
var app_circleArray2;

/*Draw Flow Particle*/
/*파티클을 위한 가상의 오브젝트*/
var appFlowParticleArray = [[],[],[],[]];
var appFlowParticleScale;
var numAppFlowParticle;


var appParticle_group_object;
var example = [{},{},{},{}];
var appParticle_group_set;
var appFlowParticle_set;


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
	             		var color = d3.color("#FFAB00");
	             	}
	             	else if(d.dataType == "reqData"){
	             		var color = d3.color("#00C853");
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
					  .style("margin","3px 4px 0 0");

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
												return "양호";
											}
											else{
												return "불량";
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
					  .x(function(d){return appMean_res_xScale(d.index);})
					  .y(function(d){return appMean_res_yScale(d.rate);});

    appMean_res_area = d3.area()
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

 //    appMean_res_rateSVG_g.append("g")
 //    				  .attr("class", "x axis_light")
	// 				  .attr("transform", "translate(0," + appMean_res_innerHeight + ")")
	// 				  .call(appMean_res_xAxis);

	// appMean_res_rateGrid_g.append("g")			
	// 			      .attr("class", "grid")
	// 			      .attr("transform", "translate(0," + appMean_res_innerHeight + ")")
	// 			      .call(d3.axisBottom(appMean_res_grid_xScale).tickValues([0,10,20,30])
	// 			          .tickSize(-appMean_res_innerHeight)
	// 			          .tickFormat("")
	// 			      );

    appMean_res_rateSVG_g.append("g")
    				  .attr("class", "y axis_light")
					  .attr("transform", "translate(0,0)")
					  .call(d3.axisLeft(appMean_res_yScale).tickValues([0, 10, 20])); // Create an axis component with d3.axisBottom

	// appMean_res_rateGrid_g.append("g")			
	// 			      .attr("class", "grid")
	// 			      .attr("transform", "translate(0,0)")
	// 			      .call(d3.axisLeft(appMean_res_yScale).tickValues([0, 10, 20])
	// 			          .tickSize(-appMean_res_innerWidth)
	// 			          .tickFormat("")
	// 			      );

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
	appFlowParticleArray = [[],[],[],[]];
	appFlowParticleScale = d3.scaleLinear()
						         .domain([0,1000])
						         .range([0,600]);

	numAppFlowParticle = appFlowParticleScale(flowData.flow);

	/*파티클에 바인딩할 객체*/
	for(j=0;j<4;j++){
		for(i=0;i<numAppFlowParticle;i++){
			var particle = {
				"delay_offset": Math.floor(Math.random() * 100),
				group:j,
				rOffset: Math.floor(Math.random()*1) + 1
			}
			appFlowParticleArray[j].push(particle);
		}
	}

	/*이동할 위치를 정하기 위한 파티클 그룹 객체*/
	appParticle_group_object = [
					{from:1,to:2, duration_offset:1},
					{from:2,to:3, duration_offset:1},
					{from:3,to:6, duration_offset:2.5},
					{from:6,to:7, duration_offset:1}
				];

	example = [{},{},{},{}];

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


	appFlowParticle_set = appParticle_group_set.selectAll("circle")
										      .data(function(d,i){
										      	return appFlowParticleArray[i];
										      })
										      .enter()
										      .append("circle")
										      .attr("cx",0)
										      // .attr("cy",function(d,i){
										      // 	return appFlowChartSize.height/2 - flowStrokeScale(flowData.flow)/2 + i/numAppFlowParticle *flowStrokeScale(flowData.flow)
										      // })
										      .attr("cy",function(d,i){
										      	return appFlowChartSize.height/2 - 44/2 + i/numAppFlowParticle *44;
										      })
										      .attr("r",function(d){
										      	return 2* d.rOffset;
										      })
										      .attr("class","particle")
										      .attr("opacity",0);

    appFlowParticle_set.transition()
    				.duration(function(d,i){
    					return 550*appParticle_group_object[d.group].duration_offset;
    					
    				})
				    .ease(d3.easeCubicOut)
	    			.delay(function(d){
	    				return d.delay_offset * 50;
	    			})
				     .attr("cx",function(d,i){
				     	return (appParticle_group_object[d.group].to-appParticle_group_object[d.group].from)*appFlowGridUnit;
				     })
				     .attr("opacity",1);



	/*Draw Node*/
	/*Set Node Array*/
	appNodeArray = [
		{node_title_eng:"user_node",node_title_kor:"사용자",index:1,value:flowData.user,block:flowData.user_block},
		{node_title_eng:"app_node",node_title_kor:"어플리케이션",index:2,value:flowData.application,block:flowData.application_block},
		{node_title_eng:"departure_node",node_title_kor:"출발지노드",index:3,value:flowData.source,block:flowData.source_block},
		{node_title_eng:"service_node",node_title_kor:"서비스",index:6,value:flowData.service,block:0},
		{node_title_eng:"arrival_node",node_title_kor:"도착지노드",index:7,value:flowData.destination,block:0}
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


  // appFlowChartSVG.append("defs").append("marker")
  //       .attr("id", "arrow1")
  //       .attr("markerUnits", "strokeWidth") 
  //       .attr("markerWidth", "2").attr("markerHeight", "2")
  //       .attr("viewBox", "0 -5 10 10")
  //       .attr("refX", "5").attr("refY", "0")
  //       .attr("orient", "auto")
  //       .append("path")
  //       .attr("d","M0,-5L10,0L0,5")
  //       .attr("stroke","none")
  //       .attr("fill","#f26e88")
  //       .attr("class","arrowHead");


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

    appNodeItem.append("text")
    		   .attr("class","blockText font-bold")
			   .attr("text-anchor","middle")
			   .attr("x",appFlowGridUnit)
			   .attr("y",appFlowChartSize.height/2 + 80)
			   .text(function(d){
			   		if(0<d.block){
			   			return "차단" + d.block + "건";
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
			    .attr("stroke-width",0.5)
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
		{title_eng:"reqData",title_kor:"전송량", value:app_reqData},
		{title_eng:"resData",title_kor:"수신량", value:app_resData},
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
			  	return "circle_legend " + d.title_eng + "_bg left_align";
			  })
			  .style("margin","3px 4px 0 0");

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
             		var color = d3.color("#FFAB00");
             	}
             	else if(d.dataType == "reqData"){
             		var color = d3.color("#00C853");
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
												return "양호";
											}
											else{
												return "불량";
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
		{node_title_eng:"user_node",node_title_kor:"사용자",index:1,value:flowData.user,block:flowData.user_block},
		{node_title_eng:"app_node",node_title_kor:"어플리케이션",index:2,value:flowData.application,block:flowData.application_block},
		{node_title_eng:"departure_node",node_title_kor:"출발지노드",index:3,value:flowData.source,block:flowData.source_block},
		{node_title_eng:"service_node",node_title_kor:"서비스",index:6,value:flowData.service,block:0},
		{node_title_eng:"arrival_node",node_title_kor:"도착지노드",index:7,value:flowData.destination,block:0}
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


	appNodeItem.append("text")
			   .attr("x",appFlowGridUnit)
			   .attr("y",appFlowChartSize.height/2 + 80)
			   .text(function(d){
			   		if(0<d.block){
			   			return "차단" + d.block + "건";
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


    appFlowParticleArray = [[],[],[],[]];
	numAppFlowParticle = appFlowParticleScale(flowData.flow);

	/*파티클에 바인딩할 객체*/
	for(j=0;j<4;j++){
		for(i=0;i<numAppFlowParticle;i++){
			var particle = {
				"delay_offset": Math.floor(Math.random() * 100),
				"group":j,
				"rOffset": Math.floor(Math.random()*1) + 1
			}
			appFlowParticleArray[j].push(particle);
		}
	}

	// appFlowParticle_set.interrupt();
	var newParticles = appParticle_group_set.selectAll("circle")
					     .data(function(d,i){
					   		return appFlowParticleArray[i];
					     });

	newParticles.exit().remove();
	
	newParticles.enter()
					   .append("circle")
					   .attr("class","particle")
					   .attr("r",2)
					   .attr("opacity",1);


	appParticle_group_set.selectAll("circle")
					   .attr("opacity",0)
					   .attr("cx",0)
					   .attr("cy",function(d,i){
				      		return appFlowChartSize.height/2 - 44/2 + i/numAppFlowParticle *44;
					    })
					   .transition()
					   .duration(function(d,i){
							return 550*appParticle_group_object[d.group].duration_offset;
							
						})
					   .ease(d3.easeCubicOut)
		    		   .delay(function(d){
		    				return d.delay_offset * 50;
		    		    })
					    .attr("cx",function(d,i){
					   		return (appParticle_group_object[d.group].to-appParticle_group_object[d.group].from)*appFlowGridUnit;
					    })
					    .attr("opacity",1);


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
			    .attr("stroke",function(){
			    	var color = d3.color(tunnelColorScale(flowData.flow_per));
			    	return color;
			    })
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