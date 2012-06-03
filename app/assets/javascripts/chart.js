var width = 600,
    height = 600,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

var currentYear = '12_13';

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
//  .append("g")
//    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// group for pie
var pie_group = vis.append("svg:g")
    .attr("class", "pie")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.value; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

d3.json("http://onegrain.herokuapp.com/data.json", function(json) {
    path = pie_group.data([json]).selectAll("path")
          .data(partition.nodes).enter().append("path")
          //.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
  .style("opacity", 0.6)
          .style("stroke", "#fff")
          .style("fill", function(d, i) {
        if (d.depth == 0) {
          return '#fff';
        }
          return color(i);
        //return color((d.children ? d : d.parent).name);
      })
          .each(stash)
      .on("click", function(d) {
        dive(d.name);
      })
      .on("mouseover", function(d) {
        highlight(d);
        populateSidebar(d);
      });
    updatePie(currentYear);
    populateSidebar([json][0]);
  });

$('#11_12').click(function() {
  updatePie('11_12');
});
$('#12_13').click(function() {
  updatePie('12_13');
});

// group for centre text
var centre_group = vis.append("svg:g")
  .attr("class", "centre_group")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var totalLabel = centre_group.append("svg:text")
  .attr("class", "total_head")
  .attr("dy", -15)
  .attr("text-anchor", "middle") // text-align: right
  .text("Total Government Expenditure");
centre_group.append("svg:text")
  .attr("class", "total_body")
  .attr("dy", 15)
  .attr("text-anchor", "middle") // text-align: right
  .text("$376.3 Billion");

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

function dive(name) {
  // reset all values if click total
  if (name == "total") {
    updatePie(currentYear);
  }
  else {
  path.data(partition.value(function(d) {
    if (d.name != name && !isChild(d, name)) {
      return 0;
    } else {
      return d.value;
    }
  }))
    .transition()
    .duration(1500)
    .attrTween("d", arcTween);
  }
}

function isChild(child, name) {
  var parent = child.parent;
  while (parent != null) {
    if (parent.name == name) {
      return true;
    }
    else {
      parent = parent.parent;
    }
  }
  return false;
}

function updatePie(year) {
  path.data(partition.value(function(d) {
    if (d.value12_13 === null){
      return d.value;
    }
    else {
      if (year == '12_13' ) {
        return d.value12_13;
      }
      else if (year == '11_12') {
        return d.value11_12;
      }
    }
    }))
        .transition()
          .duration(1500)
          .attrTween("d", arcTween);
  currentYear = year;

  if (year == '11_12') {
    $('.total_body').text('$365.8 Billion');
  } else {
    $('.total_body').text('$376.3 Billion');
  }
}

function highlight(budgetItem) {
  d3.selectAll("path")
       .transition()
         .style("opacity", function(d) {
  if (d.name != budgetItem.name && !isChild(d, budgetItem.name)) {
    return 0.6;
  } else {
    return 1;
  }});
}
