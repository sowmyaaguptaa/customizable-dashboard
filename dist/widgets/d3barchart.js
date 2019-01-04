//d3

var svg_bar = new Array();
var margin_bar = '',
	x_bar = '',
	y_bar = '';
var theData_bar = new Array();

var g_bar = new Array();


function makeBarChartWidget(gridstack,node){
	widget_count++;
	var id='svg'+widget_count;
	gridstack.grid.addWidget($('<div><div class="grid-stack-item-content" ><svg id="'+id+'" width="100%" height="90%"></svg></div><div/>'),
		node.x, node.y, node.width, node.height);			
	addBarChart(id,widget_count);
}
function addBarChart(id,i){
	
	var svg_child = d3.select("svg#"+id);
		margin_bar = { top: 20, right: 20, bottom: 30, left: 40 },
		x_bar = d3.scaleBand().padding(0.1),
		y_bar = d3.scaleLinear();
		theData_bar[i] = undefined;

	var g_child = svg_child.append("g")
		.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

	  g_child.append("g")
		.attr("class", "axis axis--x");

	  g_child.append("g")
		.attr("class", "axis axis--y");

	  g_child.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency");
	svg_bar.push(svg_child);
	g_bar.push(g_child);
	loadBarData("data.tsv",i);
}

function drawBarChart(i) {

	var svg_child=svg_bar[i-1];
	var g_child=g_bar[i-1];
	var bounds = svg_child.node().getBoundingClientRect(),
	  width = bounds.width - margin_bar.left - margin_bar.right,
	  height = bounds.height - margin_bar.top - margin_bar.bottom;

	x_bar.rangeRound([0, width]);
	y_bar.rangeRound([height, 0]);

	g_child.select(".axis--x")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x_bar));

	g_child.select(".axis--y")
	  .call(d3.axisLeft(y_bar).ticks(10, "%"));

	var bars = g_child.selectAll(".bar")
	  .data(theData_bar[i]);

	// ENTER
	bars
	  .enter().append("rect")
	  .attr("class", "bar")
	  .attr("x", function (d) { return x_bar(d.letter); })
	  .attr("y", function (d) { return y_bar(d.frequency); })
	  .attr("width", x_bar.bandwidth())
	  .attr("height", function (d) { return height - y_bar(d.frequency); });

	// UPDATE
	bars.attr("x", function (d) { return x_bar(d.letter); })
	  .attr("y", function (d) { return y_bar(d.frequency); })
	  .attr("width", x_bar.bandwidth())
	  .attr("height", function (d) { return height - y_bar(d.frequency); });

	// EXIT
	bars.exit()
	  .remove();

}

  // LOADING DATA

function loadBarData(tsvFile,i) {

	d3.tsv(tsvFile, function (d) {
	  d.frequency = +d.frequency;
	  return d;

	}, function (error, data) {
	  if (error) throw error;

	  theData_bar[i] = data;

	  x_bar.domain(theData_bar[i].map(function (d) { return d.letter; }));
	  y_bar.domain([0, d3.max(theData_bar[i], function (d) { return d.frequency; })]);

	  drawBarChart(i);

	});
}