// Set the dimensions and margins of the graph
var margin = { top: 30, right: 5, bottom: 50, left: 60 },
  width = 900 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Append the svg object to the container
var svg = d3
  .select("#container")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "650px")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the data
d3.csv("data/study_performance.csv", function (data) {
  // Define the keys and stack the data
  var keys = data.columns.slice(5); // Get the subjects (math, reading, writing)
  var stack = d3.stack().keys(keys);

  // Process the data
  var stackedData = stack(data);

  // Define the scales
  var x = d3
    .scaleBand()
    .domain(
      data.map(function (d) {
        return d.gender + " - " + d.race_ethnicity;
      })
    )
    .range([0, width])
    .padding(0.2);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(stackedData, function (d) {
        return d3.max(d, function (d) {
          return d[1];
        });
      }),
    ])
    .nice()
    .range([height, 0]);

  var color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  // Draw the bars
  svg
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.data.gender + " - " + d.data.race_ethnicity);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());

  // Add X axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dy", "0.5em");

  // Add Y axis
  svg.append("g").call(d3.axisLeft(y));

  // Add X axis label
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 50) + ")"
    )
    .style("text-anchor", "middle")
    .text("Gender - Race/Ethnicity");

  // Add Y axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Score");

  // Add legend
  var legend = svg
    .selectAll(".legend")
    .data(keys)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", width + 110)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d) {
      return color(d);
    });

  legend
    .append("text")
    .attr("x", width + 100)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      return d;
    });
});
