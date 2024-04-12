//-------------------------
//-------------------------
//=====CHRISTINA
//-------------------------
//-------------------------
const christinaChartA = () => {
  d3.csv("data/us_population_by_age.csv", function (data) {
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

const christinaChartB = () => {
  d3.csv(
    "data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      data = data.slice(0, 500);
      var industries = Array.from(
        new Set(data.map((d) => d["What industry do you work in?"]))
      );
      var salariesByIndustry = industries.map((industry) => {
        var filteredData = data.filter(
          (d) => d["What industry do you work in?"] === industry
        );
        return {
          industry: industry,
          averageSalary: d3.mean(
            filteredData,
            (d) => +d["What is your annual salary?"].replace(/,/g, "")
          ),
        };
      });

      salariesByIndustry.sort((a, b) => b.averageSalary - a.averageSalary);

      var margin = { top: 50, right: 50, bottom: 200, left: 100 };
      var width = 1000 - margin.left - margin.right;
      var height = 600 - margin.top - margin.bottom;

      var container = d3.select("#c-container2");

      var svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var xScale = d3
        .scaleBand()
        .domain(industries)
        .range([0, width])
        .padding(0.1);

      var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(salariesByIndustry, (d) => d.averageSalary)])
        .range([height, 0]);

      svg
        .selectAll(".bar")
        .data(salariesByIndustry)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.industry))
        .attr("y", height)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", "steelblue")
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("y", (d) => yScale(d.averageSalary))
        .attr("height", (d) => height - yScale(d.averageSalary));

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("font-size", "10px");

      svg
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .style("font-size", "12px");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Average Salary (USD) by Industry");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Salary (USD)")
        .style("font-size", "14px");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .text("Industry")
        .style("font-size", "14px");

      setInterval(() => {
        svg
          .selectAll(".bar")
          .transition()
          .duration(1000)
          .delay((d, i) => i * 100)
          .attr("y", height)
          .attr("height", 0)
          .transition()
          .duration(500)
          .delay((d, i) => i * 100)
          .attr("y", (d) => yScale(d.averageSalary))
          .attr("height", (d) => height - yScale(d.averageSalary));
      }, 15000);
    }
  );
};

//-------------------------
//-------------------------
//=====DERRYCK
//-------------------------
//-------------------------
const derryckChartA = () => {
  var margin = { top: 50, right: 200, bottom: 120, left: 60 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var svg = d3
    .select("#d-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Relationship Between Gender-Race/Ethinicity & Academic Scores");

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
      .attr("y", height)
      .attr("height", 0)
      .attr("width", x.bandwidth())
      .transition()
      .duration(500)
      .delay(function (d, i) {
        return i * 100;
      })
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      });

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dy", "0.5em");

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 50) + ")"
      )
      .style("text-anchor", "middle")
      .text("Gender - Race/Ethnicity");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Score");

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
    "data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      const ageData = data.map((d) => +d["How old are you?"].split("-")[0]);
      // remove quotes from salary data
      const salaryData = data.map(
        (d) => +d["What is your annual salary?"].replace(/,/g, "")
      );

      const margin = { top: 20, right: 90, bottom: 100, left: 20 };
      const width = 1000;
      const height = 500;
      const marginTop = 25;
      const marginRight = 100;
      const marginBottom = 35;
      const marginLeft = 50;

      const svg = d3
        .select("#d-container2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const x = d3
        .scaleLinear()
        .domain(d3.extent(ageData, (d) => d))
        .nice()
        .range([marginLeft, width - marginRight]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(salaryData, (d) => d))
        .nice()
        .range([height - marginBottom, marginTop]);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 50))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", width - 30)
            .attr("y", marginBottom - 5)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("Average Salary (USD)")
        );

      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("Age")
        );

      // Create the grid.
      svg
        .append("g")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call((g) =>
          g
            .append("g")
            .selectAll("line")
            .data(x.ticks())
            .enter()
            .append("line")
            .attr("x1", (d) => 0.5 + x(d))
            .attr("x2", (d) => 0.5 + x(d))
            .attr("y1", marginTop)
            .attr("y2", height - marginBottom)
        )
        .call((g) =>
          g
            .append("g")
            .selectAll("line")
            .data(y.ticks())
            .enter()
            .append("line")
            .attr("y1", (d) => 0.5 + y(d))
            .attr("y2", (d) => 0.5 + y(d))
            .attr("x1", marginLeft)
            .attr("x2", width - marginRight)
        );

      // Add a layer of dots.
      svg
        .append("g")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(+d["How old are you?"].split("-")[0]))
        .attr("cy", (d) =>
          y(+d["What is your annual salary?"].replace(/,/g, ""))
        )
        .attr("r", 3);

      // Add a layer of labels.
      svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dy", "0.35em")
        .attr("x", (d) => x(+d["How old are you?"].split("-")[0]) + 7)
        .attr("y", (d) =>
          y(+d["What is your annual salary?"].replace(/,/g, ""))
        )
        .text((d) => d.name);
    }
  );

  // d3.csv(
  //   "data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
  //   function (data) {
  //     const ageData = data.map((d) => +d["How old are you?"].split("-")[0]);
  //     // remove quotes from salary data
  //     const salaryData = data.map(
  //       (d) => +d["What is your annual salary?"].replace(/,/g, "")
  //     );

  //     const margin = { top: 50, right: 50, bottom: 50, left: 100 };
  //     const width = 900 - margin.left - margin.right;
  //     const height = 400 - margin.top - margin.bottom;

  //     const svg = d3
  //       .select("#d-container2")
  //       .append("svg")
  //       .attr("width", width + margin.left + margin.right)
  //       .attr("height", height + margin.top + margin.bottom)
  //       .append("g")
  //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //     svg
  //       .append("text")
  //       .attr("x", width / 2)
  //       .attr("y", -margin.top / 2)
  //       .attr("text-anchor", "middle")
  //       .style("font-size", "20px")
  //       .style("text-decoration", "underline")
  //       .text("Age vs Salary In North America & United Kingdom");

  //     const xScale = d3
  //       .scaleLinear()
  //       .domain([0, d3.max(ageData)])
  //       .range([0, width]);

  //     const yScale = d3
  //       .scaleLinear()
  //       .domain([0, d3.max(salaryData)])
  //       .range([height, 0]);

  //     const xAxis = d3.axisBottom(xScale);
  //     const yAxis = d3.axisLeft(yScale);

  //     const dots = svg
  //       .selectAll(".dot")
  //       .data(data)
  //       .enter()
  //       .append("circle")
  //       .attr("class", "dot")
  //       .attr("cx", (d) => xScale(+d["How old are you?"].split("-")[0]))
  //       .attr("cy", (d) =>
  //         yScale(+d["What is your annual salary?"].replace(/,/g, ""))
  //       )
  //       .attr("r", 5);

  //     const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  //     svg.call(zoom);

  //     function zoomed() {
  //       const newXScale = d3.event.transform.rescaleX(xScale);
  //       const newYScale = d3.event.transform.rescaleY(yScale);
  //       dots
  //         .attr("cx", (d) => newXScale(+d["How old are you?"].split("-")[0]))
  //         .attr("cy", (d) =>
  //           newYScale(+d["What is your annual salary?"].replace(/,/g, ""))
  //         );
  //       svg.select(".x-axis").call(xAxis.scale(newXScale));
  //       svg.select(".y-axis").call(yAxis.scale(newYScale));
  //     }

  //     svg
  //       .append("g")
  //       .attr("class", "x-axis")
  //       .attr("transform", "translate(0," + height + ")")
  //       .call(xAxis);

  //     svg.append("g").attr("class", "y-axis").call(yAxis);

  //     svg
  //       .append("text")
  //       .attr("class", "axis-label")
  //       .attr("x", width / 2)
  //       .attr("y", height + margin.bottom - 5)
  //       .style("text-anchor", "middle")
  //       .text("Age");

  //     svg
  //       .append("text")
  //       .attr("class", "axis-label")
  //       .attr("transform", "rotate(-90)")
  //       .attr("x", -height / 2)
  //       .attr("y", -margin.left + 20)
  //       .style("text-anchor", "middle")
  //       .text("Annual Salary");
  //   }
  // );
};

//-------------------------
//-------------------------
//=====VIJAY
//-------------------------
//-------------------------
const vijayChartA = () => {
  var width = 800,
    height = 400;

  d3.csv(
    "data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      var industries = data.map(function (d) {
        return d["What industry do you work in?"];
      });

      var industryFrequency = {};

      industries.forEach(function (industry) {
        industryFrequency[industry] = (industryFrequency[industry] || 0) + 1;
      });

      // Convert frequency data to array of word objects
      var words = Object.keys(industryFrequency).map(function (industry) {
        return { text: industry, size: industryFrequency[industry] * 10 }; // Adjust size multiplier as needed
      });

      // Sort words by frequency
      words.sort(function (a, b) {
        return b.size - a.size;
      });

      // Create the word cloud layout
      var layout = d3.layout
        .cloud()
        .size([width, 400]) // Set size of the word cloud container
        .words(words)
        .padding(5) // Adjust padding between words
        .rotate(function () {
          return 0;
        }) // Disable word rotation
        .fontSize(function (d) {
          return d.size;
        }) // Set font size based on word size
        .on("end", draw);

      layout.start();

      function draw(words) {
        // Create the SVG container for the word cloud
        var svg = d3
          .select("#v-container")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        // Append a group for the word cloud
        var g = svg.append("g").attr("transform", "translate(400,200)");

        // Append the words as text elements
        g.selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function (d) {
            return d.size + "px";
          })
          .style("fill", function (d, i) {
            return d3.schemeCategory10[i % 10];
          }) // Use a categorical color scale for variety
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) {
            return d.text;
          })
          .on("mouseover", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .style("font-size", "20px"); // Increase font size on hover
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .style("font-size", function (d) {
                return d.size + "px";
              }); // Restore font size on mouseout
          })
          .on("click", function () {
            // shuffle the words
            // layout.stop().words(words).start();
          });
      }
    }
  );
};

//-------------------------
//-------------------------
//=====KENNEDY
//-------------------------
//-------------------------

christinaChartA();
christinaChartB();
derryckChartA();
derryckChartB();
vijayChartA();
