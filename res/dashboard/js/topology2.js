/*size setting*/
var topology_size = {
					  margin_left:32,
					  margin_top:32,
					  margin_right:32,
					  margin_bottom:32,
					  width:0,
					  height:716,
					  inner_width:0,
					  inner_height:680
					}

/*global variation for svg,g,node,link object*/
var topology_svg;
var svg_g;
var topology_g;
var topology_force;
var nodes;
var links;

/*DRAW NODE LEGEND*/
var topologyThreatLegendList = [
		{title_eng:"red",title_kor:"비동작"},
		{title_eng:"controller",title_kor:"컨트롤러"},
		{title_eng:"interface",title_kor:"인터페이스"},
		{title_eng:"gateway",title_kor:"게이트웨이"},
		{title_eng:"perimeter",title_kor:"파라미터"}
	];

/*Set Initial Zoom Level*/
var initial_zoom_level = 0.64;
var initial_group_margin = (1 - initial_zoom_level)/2;

function setTopology(topology_threat_data){
	nodes = topology_threat_data.NODES;
    links = topology_threat_data.LINKS;

	topology_size.width = $('#topology_threat').width();
	topology_size.inner_width = topology_size.width - topology_size.margin_left - topology_size.margin_right;

	topology_svg = d3.select("#topology_threat").append("svg")
								.attr("width",topology_size.width)
								.attr("height",topology_size.height);

	var topology_threat_legend = d3.select('#topology_threat_legend').selectAll("div")
																     .data(topologyThreatLegendList)
																     .enter();

	var topology_threat_legend_item  = topology_threat_legend.append("div")
														     .attr("class","flex_row align_center");

	topology_threat_legend_item.append("div")
							   .attr("class",function(d){
							   		return d.title_eng + "_node circle_legend";
							   });

	topology_threat_legend_item.append("span")
							   .attr("class",function(d){
							  	return " " + d.title_eng;
							   })
							   .style("margin-right","12px")
							   .html(function(d){
							  	return d.title_kor;
							   });

	svg_g = topology_svg.append("g")
					    .attr("transform","translate(" + topology_size.margin_left + "," + topology_size.margin_top + ")");

	topology_g = svg_g.append("g")
					  .attr("transform","translate(" + topology_size.margin_left + "," + topology_size.margin_top + ")");

	/*Push Controller to Node*/
	// var controller_node = topology_g.selectAll(".controller_node")
	// 								 .data(topology_threat_data.CONTROLLERS)
	// 								 .enter()
	// 								 .append("g")
	// 								 .attr("transform","translate(" + topology_size.inner_width/2 + ","+ 64 + ")");

 //    controller_node.append("circle")
	// 			   .attr("class","node_circle controller_node")
	// 			   .attr("cx",24)
	// 			   .attr("cy",24)
	// 			   .attr("r",24);

	// controller_node.append("text")
 //    	.attr("class",function(d){
 //    		return d.type +"_node" + " node_title font-bold";
 //    	})
 //    	.attr("text-anchor","middle")
 //    	.attr("x",24)
 //    	.attr("y",-6)
 //    	.text(function(d){
 //    		return d.name;
 //    	});

 //   	controller_node.append("text")
 //    	.attr("class",function(d){
 //    		return "font-bold node_count";
 //    	})
 //    	.attr("text-anchor","middle")
 //    	.attr("x",24)
 //    	.attr("y",28)
 //    	.attr("fill","#ffffff")
 //    	.text(function(d){
 //    		return d.count;
 //    	});

 //    controller_node.append("circle")
 //        .attr("class","red_circle")
 //        .attr("cx",48 - 6)
 //        .attr("cy",8)
 //        .attr("r",function(d){
 //        	if(0<d.block_count){
 //        		return 12;
 //        	}
 //        	else{
 //        		return 0;
 //        	}
 //        });

 //     controller_node.append("text")
 //    	.attr("class","block_count font-bold")
 //    	.attr("text-anchor","middle")
 //    	.attr("x",48 - 6)
 //    	.attr("y",12)
 //    	.text(function(d){
 //    		if(0<d.block_count){
 //    			return d.block_count;
 //    		}
 //    		else{
 //    			return "";
 //    		}

 //    	});

 	topology_threat_data.CONTROLLERS[0].isFirst = true;
  	console.log(topology_threat_data.CONTROLLERS);
  	topology_threat_data.CONTROLLERS.forEach(function(item){
  		nodes.unshift(item);
  	});

  	topology_threat_data.CONTROLLER_LINKS.forEach(function(item){
  		links.unshift(item);
  	});

	/*Node Topology*/
	topology_force = d3.forceSimulation()
						    .force("link", d3.forceLink().id(function(d){return d.id;}))
                            .force("charge", d3.forceManyBody())
                            .force("collide", d3.forceCollide())
						    .force("center", d3.forceCenter(topology_size.inner_width/2,topology_size.inner_height/2))
						    .alpha(1)
						    .force("forceY", d3.forceY().strength(0.2));
						  
					

    var link = topology_g
					    .selectAll("line")
					    .data(links)
					    .enter()
					    .append("line")
					    .attr("class","link")
					    .attr("stroke", "#aaa")
					    .attr("stroke-width", "1px");

	var node = topology_g
					    .selectAll(".node_g")
					    .data(nodes)
					    .enter()
					    .append("g");


	node.append("circle")
	    .attr("class",function(d){
	    	return d.type + "_node" + " node_circle";
	    })
	    .attr("r", 24)
	    .attr("cx",12)
	    .attr("cy",12)
	    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("text")
    	.attr("class",function(d){
    		return d.type +"_node" + " node_title font-bold";
    	})
    	.attr("text-anchor","middle")
    	.attr("x",0)
    	.attr("y",0)
    	.text(function(d){
    		return d.name;
    	});

   	node.append("text")
    	.attr("class",function(d){
    		return "font-bold node_count";
    	})
    	.attr("text-anchor","middle")
    	.attr("x",0)
    	.attr("y",0)
    	.attr("fill","#ffffff")
    	.text(function(d){
    		return d.count;
    	});

    node.append("circle")
        .attr("class","red_circle")
        .attr("r",function(d){
        	if(d.status=="비동작"){
        		return 8;
        	}
        	else{
        		return 0;
        	}
        });



	 /*Add ticked event*/
    topology_force.nodes(nodes).on("tick", ticked);
    topology_force.tick(4);
    /*Setting initial status of force simulation*/
    topology_force.force("charge").strength(100)
    topology_force.force("link").distance(36).links(topology_threat_data.LINKS);
    topology_force.force("collide")
				  .strength(0.1)
				  .radius(64);

	/*Set user node x-Position*/
    var firstConterNode = nodes.filter(function(item){
        return (item.type=="controller")&&(item.isFirst == true);
    });

    firstConterNode.forEach(function(item){
    	item.fx = topology_size.inner_width/2;
    	item.fy = 0;

    	console.log(item);
    });
    
    /*update inital setting*/
    topology_force.alpha(1).restart();

	 /*Node Click Event Listner*/
	 d3.selectAll(".node_circle").on("click",function(d){
	 	console.log(d);
	 	$(this).addClass("selected_node");
	 	$(".selected_node").not(this).removeClass("selected_node");

	 	/*Add ToopTip*/
	 	var tooltipInfo = [
	 		{
	 			"title": "processor",
	 			"title_kor": "프로세서",
	 			"value": d.cpuRatio	
	 		},
	 		{
	 			"title": "memory",
	 			"title_kor": "메모리",
	 			"value": d.ramRatio	
	 		},
	 		{
	 			"title": "network",
	 			"title_kor": "네트워크",
	 			"value": d.nicRatio	
	 		},
	 		{
	 			"title": "sentPacket",
	 			"title_kor": "전송패킷",
	 			"value": d.sentPacketPerSecond	
	 		},
	 		{
	 			"title": "receivedPacket",
	 			"title_kor": "수신패킷",
	 			"value": d.receivedPacketPerSecond	
	 		},
	 		{
	 			"title": "appFlow",
	 			"title_kor": "애플리케이션 플로우수",
	 			"value": d.applicationFlowCount	
	 		},
	 		{
	 			"title": "generalFlow",
	 			"title_kor": "일반 플로우수",
	 			"value": d.nonApplicationFlowCount	
	 		},
	 		{
	 			"title": "threat",
	 			"title_kor": "위협차단수",
	 			"value": d.threatCount	
	 		},
	 		{
	 			"title": "status",
	 			"title_kor": "상태",
	 			"value": d.status	
	 		}
	 	];
	 
	 	/*Selected Node Color Marked*/
	 	d3.select('.node_mark').remove();
	 	d3.select(".tooltip_title").remove();
	 	d3.selectAll(".tooltip_list").remove();
	 	d3.select("#topology_status_tooltip").append("div")
	 										 .attr("class",d.type + "_node col1 node_mark")
	 										 .style("height","4px");

	 	var tooptip_title = d3.select("#topology_status_tooltip").append("div")
												 				 .attr("class","font-bold tooltip_title")
												 				 .html(d.name);
	 	
	 	var tooptip_list = d3.select("#topology_status_tooltip").selectAll(".tooltip_list")
	 										 .data(tooltipInfo)
	 										 .enter()
	 										 .append("div")
	 										 .attr("class","flex_row space_between tooltip_list");

	 	tooptip_list.append("span")
	 				.html(function(d){
	 					return d.title_kor;
	 				});

	 	tooptip_list.append("span")
	 				.attr("class","font-bold")
	 				.html(function(d){
	 					return d.value;
	 				});


	 });

	function ticked() {
			links.forEach(function(d, i) {
	              var x1 = d.source.x,
	                  x2 = d.target.x,
	                  y1 = d.source.y,
	                  y2 = d.target.y,
	                  slope = (y2 - y1) / (x2  - x1);
	              d.x = (x2 + x1)/ 2;
	              d.y = (x2 - x1) * slope / 2 + y1;
	            });

		    link.attr("x1", function(d) { return d.source.x;})
		        .attr("y1", function(d) { return d.source.y;})
		        .attr("x2", function(d) { return d.target.x;})
		        .attr("y2", function(d) { return d.target.y;});

		    node.select(".node_circle")
		         .attr("cx", function(d) { return d.x;})
		       	 .attr("cy", function(d) { return d.y;});

		    node.select(".node_count")
		         .attr("x", function(d) { return d.x})
		       	 .attr("y", function(d) { return d.y + 4});

		    node.select(".red_circle")
		         .attr("cx", function(d) { return d.x + 18;})
		       	 .attr("cy", function(d) { return d.y - 18;});

		    node.select(".node_title")
		        .attr("x", function(d) { return d.x;})
		        .attr("y", function(d) { return d.y - 30;});
	  }


	 //add zoom capabilities 
	 /*set initial scale regardless of zoom level*/
	svg_g.attr("transform","translate("+ initial_group_margin*topology_size.width + "," + initial_group_margin*topology_size.height + ")" + "scale(" + initial_zoom_level + ")");
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(topology_svg);

    //Zoom functions 
    function zoom_actions(){
        topology_g.attr("transform", d3.event.transform);
        d3.select("#topology_threat_zoom_info").select("span").html(d3.format(",.1%")(d3.event.transform.k));
    }
						   
}



function dragstarted(d) {
  if (!d3.event.active) topology_force.alphaTarget(0.01).restart()
  d.fx = d.x
  d.fy = d.y
//  simulation.fix(d);
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
//  simulation.fix(d, d3.event.x, d3.event.y);
}

function dragended(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
  if (!d3.event.active) topology_force.alphaTarget(0);
  //simulation.unfix(d);
}




