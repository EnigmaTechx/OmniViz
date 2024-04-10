const derryckChartA = () => {
  var margin = { top: 50, right: 200, bottom: 120, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // canvas
  var svg = d3
    .select("#d-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Relationship Between Gender-Race/Ethinicity & Academic Scores");

  // extracting data
  d3.csv("data/study_performance.csv", function (data) {
    var keys = data.columns.slice(5);
    var stack = d3.stack().keys(keys);
    var stackedData = stack(data);

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
    // .on("mouseover", function (event, d) {
    //   console.log(d);
    //   console.log(x(d.data.gender + " - " + d.data.race_ethnicity));
    //   // Append a new text element with the score
    //   svg
    //     .append("text")
    //     .attr("class", "scoreText")
    //     .attr(
    //       "x",
    //       x((d) => d.data.gender + " - " + d.data.race_ethnicity) +
    //         x.bandwidth() / 2
    //     )
    //     .attr("y", y(d[1]) - 5) // Adjust position as needed
    //     .attr("text-anchor", "middle")
    //     .text(d[1] - d[0]);
    // });

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dy", "0.5em");

    svg.append("g").call(d3.axisLeft(y));

    // x-axis lable
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 50) + ")"
      )
      .style("text-anchor", "middle")
      .text("Gender - Race/Ethnicity");

    // y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Score");

    // legend
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
};
//---------------------------
const derryckChartB = () => {
  d3.csv(
    "data/Ask_A_Manager_Salary Survey_2021 (Responses).csv",
    function (data) {
      const ageData = data.map((d) => +d["How old are you?"].split("-")[0]);
      // remove quotes from salary data
      const salaryData = data.map(
        (d) => +d["What is your annual salary?"].replace(/,/g, "")
      );

      const margin = { top: 50, right: 50, bottom: 50, left: 100 };
      const width = 900 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const svg = d3
        .select("#d-container2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Age vs Salary In North America & United Kingdom");

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(ageData)])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(salaryData)])
        .range([height, 0]);

      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(+d["How old are you?"].split("-")[0]))
        .attr("cy", (d) =>
          yScale(+d["What is your annual salary?"].replace(/,/g, ""))
        )
        .attr("r", 5);

      //x-axis label
      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .style("text-anchor", "middle")
        .text("Age");

      //y-axis label
      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .style("text-anchor", "middle")
        .text("Annual Salary");

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

      svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));
    }
  );
};

//-------------------------
//-------------------------
//=====CHRISTINA
//-------------------------
//-------------------------
const christinaChartA = () => {
  d3.csv("data/us_population_by_age.csv", function (data) {
    // console.log("data", data);
    data.forEach(function (d) {
      d.value = +d.value;
    });

    const margin = { top: 20, right: 50, bottom: 50, left: 10 };
    var width = 1000,
      height = 600,
      radius = Math.min(width, height) / 2;

    radius =
      Math.min(
        width - margin.left - margin.right,
        height - margin.top - margin.bottom
      ) / 2;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(
      data.map(function (d) {
        return d.name;
      })
    );

    var pie = d3
      .pie()
      .sort(null)
      .value(function (d) {
        return d.value;
      });

    var svg = d3
      .select("#c-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.attr(
      "transform",
      "translate(" +
        (width / 2 + margin.left) +
        "," +
        (height / 2 + margin.top) +
        ")"
    );

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -height / 2 + margin.top - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("US Population by Age");

    const arcHover = d3
      .arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius * 1.5);

    var g = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function (d) {
        return color(d.data.name);
      })
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arcHover);
        d3.select(this.parentNode)
          .select("text")
          .transition()
          .duration(200)
          .attr("transform", (d) => `translate(${arcHover.centroid(d)})`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arc);
        d3.select(this.parentNode)
          .select("text")
          .transition()
          .duration(200)
          .attr("transform", (d) => `translate(${arc.centroid(d)})`);
      });

    g.append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("x", "-0.9em")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", "-1.9em")
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString("en-US"))
      );
  });
};
christinaChartA();
derryckChartA();
derryckChartB();
