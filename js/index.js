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
      // Extract data and split age range to select lower bracket

      const ageData = data.map((d) => +d["How old are you?"].split("-")[0]);
      // remove quotes from salary data
      const salaryData = data.map(
        (d) => +d["What is your annual salary?"].replace(/,/g, "")
      );

      // console.log(ageData);
      // console.log(salaryData);

      const margin = { top: 50, right: 50, bottom: 50, left: 100 };
      const width = 900 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

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
    console.log(data);
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    // const height = Math.min(width, 500);
    const radius = Math.min(width, height) / 2;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const pie = d3
      .pie()
      .padAngle(1 / radius)
      .sort(null)
      .value((d) => d.value);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
      );

    const svg = d3
      .select("#c-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg
      .append("g")
      .selectAll()
      .data(pie(data))
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(data))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString("en-US"))
      );

    return svg.node();
  });
};
// christinaChartA();
derryckChartA();
derryckChartB();
