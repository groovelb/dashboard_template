var topology1_size = {
					  margin_left:16,
					  margin_top:16,
					  margin_right:16,
					  margin_bottom:16,
					  width:0,
					  height:200,
					  inner_width:0,
					  inner_height:680
					}
var topology1_svg;
var topology1_g;
var toplogy1_force;
var topology1_cluster1 ={
	"nodes":[
		{
		 "id":1,
		 "id_kor":"컨트롤러0",
		 "level":0,
		 "blocks": 72
		},
		{
		 "id":2,
		 "id_kor":"컨트롤러1",
		 "level":1,
		 "blocks": 0
		},
		{
		 "id":3,
		 "id_kor":"컨트롤러2",
		 "level":1,
		 "blocks": 0
		}
	],
	"links":[
		{
		 "source":1,
		 "target":2
		},
		{
		 "source":1,
		 "target":3
		}
	]
}

function setTopology1(){
	topology1_size.width = $('#topology_threat').width();
	topology1_size.inner_width = topology1_size.width - topology1_size.margin_left - topology1_size.margin_right;

	topology1_svg = d3.select("#topology_threat").append("svg")
								.attr("width",topology1_size.width)
								.attr("height",topology1_size.height);

	topology1_g = topology1_svg.append("g")
							   .attr("transform","translate(" + topology1_size.margin_left + "," + topology1_size.margin_top + ")");


	toplogy1_force = d3.forceSimulation()
						   .force("link", d3.forceLink().id(function(d){return d.id;}))
						   .force("charge", d3.forceManyBody().strength(0).distanceMax(800))
						   .force('fx',d3.forceX().x(function(d,i){
						   	return i*800;
						   }))
						   .force('fy',d3.forceY().y(function(d){
						   	return d.level * 400;
						   }))
						   .force("center", d3.forceCenter(topology1_size.inner_width/2,100))
						   .alpha(0);
						  
					

    var link = topology1_svg.append("g").attr("class", "links")
					    .selectAll("line")
					    .data(topology1_cluster1.links)
					    .enter()
					    .append("line")
					    .attr("stroke", "#aaa")
					    .attr("stroke-width", "1px");

	var node = topology1_svg.append("g").attr("class", "node")
					    .selectAll("circle")
					    .data(topology1_cluster1.nodes)
					    .enter()
					    .append("circle")
					    .attr("r", 24)
					    .attr("fill", function(d) { return "#fe2314"; })
					    .call(d3.drag()
				        .on("start", dragstarted)
				        .on("drag", dragged)
				        .on("end", dragended));

	toplogy1_force.nodes(topology1_cluster1.nodes).on("tick", ticked);
	toplogy1_force.force("link").links(topology1_cluster1.links);


	function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("r", 24)
         .style("fill", "#efefef")
         .attr("cx", function (d) { return d.x+5; })
         .attr("cy", function(d) { return d.y-3; });
  }
						   
}



function dragstarted(d) {
  if (!d3.event.active) toplogy1_force.alphaTarget(0.3).restart()
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
  if (!d3.event.active) toplogy1_force.alphaTarget(0);
  //simulation.unfix(d);
}




