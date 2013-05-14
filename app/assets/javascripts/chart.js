var width = 600,
    height = 600,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

var currentYear = '13_14';

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

d3.json("/data.json", function(json) {

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
        window.location.hash = '#' + encodeURIComponent(d.name);
        dive(d.name);
      })
      .on("mouseover", function(d) {
        highlight(d);
        populateSidebar(d);
      });
    updatePie(currentYear);
    if (window.location.hash){
      dive(decodeURIComponent(window.location.hash.replace("#", "")));
    }
    populateSidebar([json][0]);
  });

$('#12_13').click(function() {
  updatePie('12_13');
});
$('#13_14').click(function() {
  updatePie('13_14');
});

// group for centre text
var centre_group = vis.append("svg:g")
  .attr("class", "centre_group")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var totalLabel = centre_group.append("svg:text")
  .attr("class", "total_head")
  .attr("dy", -15)
  .attr("text-anchor", "middle") // text-align: right
  .text("");
centre_group.append("svg:text")
  .attr("class", "total_body")
  .attr("dy", 15)
  .attr("text-anchor", "middle") // text-align: right
  .text("");
  centre_group.append("svg:text")
    .attr("class", "click_reset")
    .attr("dy", 60)
    .attr("text-anchor", "middle") // text-align: right
    .text("click to zoom out");

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
    $(".click_reset").hide();
    updatePie(currentYear);
  }
  else {
  path.data(partition.value(function(d) {
    if (d.name != name && !isChild(d, name)) {
      return 0;
    } else {
      if (currentYear == '13_14' ) {
        return d.value13_14;
      }
      else if (currentYear == '12_13') {
        return d.value12_13;
      }
    }
  }))
    .transition()
    .duration(1500)
    .attrTween("d", arcTween);
    $(".total_body").text("$" + commaSeparateNumber((path[0].parentNode.__data__.value/1000).toFixed(0)) + "m");
    if (name == "total") {
      $(".total_head").text("Total Government Expenditure");
    } else {
      $(".total_head").text(name);
    }

    console.log(path);
    $(".click_reset").show();
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
    if (d.value13_14 === null){
      return d.value;
    }
    else {
      if (year == '13_14' ) {
        return d.value13_14;
      }
      else if (year == '12_13') {
        return d.value12_13;
      }
    }
    }))
        .transition()
          .duration(1500)
          .attrTween("d", arcTween);
  currentYear = year;

  $(".total_head").text("Total Government Expenditure");
  if (year == '12_13') {
    $('.total_body').text('$381,400m');
  } else {
    $('.total_body').text('$398,300m');
  }
}

function highlight(budgetItem) {
  d3.selectAll("path")
         .style("opacity", function(d) {
  if (d.name != budgetItem.name && !isChild(d, budgetItem.name)) {
    return 0.6;
  } else {
    return 1;
  }});
}

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

$(".total_head, .total_body, .click_reset").click(function(){
  dive("total");
});

$(".click_reset").hide();