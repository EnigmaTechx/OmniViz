"use strict";
//-------------------------
//-------------------------
//=====CHRISTINA
//-------------------------
//-------------------------
const christinaChartA = () => {
  d3.csv("./data/us_population_by_age.csv", function (data) {
    data.forEach(function (d) {
      d.value = +d.value;
    });

    const margin = { top: 20, right: 50, bottom: 50, left: 10 };
    var width = 1000,
      height = 600,
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
  d3.csv("./data/us_population_by_age.csv", function (data) {
    var margin = { top: 50, right: 50, bottom: 90, left: 50 };
    var width = 1000 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select("#c-container2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("US Population by Age 2.0");

    var xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.value;
        }),
      ])
      .range([0, width]);

    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.name.split("-")[1];
        }),
      ])
      .range([height, 0]);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    svg
      .selectAll(".x-axis line")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    svg
      .selectAll(".y-axis line")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(+d.value);
      })
      .attr("cy", function (d) {
        return yScale((+d.name.split("-")[0] + +d.name.split("-")[1]) / 2);
      })
      .attr("r", 8)
      .attr("fill", "steelblue")
      .on("mouseover", mouseOver)
      .on("mouseout", mouseOut);

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + "," + (height + margin.top) + ")"
      )
      .style("text-anchor", "middle")
      .text("Population");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Age");

    function mouseOver(event, d) {
      console.log(d);
      d3.select(this).transition().duration(200).attr("r", 12);
      svg
        .append("text")
        .attr("class", "tooltip")
        .attr("x", xScale(+d.value))
        .attr(
          "y",
          yScale((+d.name.split("-")[0] + +d.name.split("-")[1]) / 2) - 15
        )
        .attr("text-anchor", "middle")
        .text(d.value);
    }

    function mouseOut(event, d) {
      d3.select(this).transition().duration(200).attr("r", 8);
      svg.selectAll(".tooltip").remove();
    }
  });
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

  d3.csv("./data/study_performance.csv", function (data) {
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
  const margin = { top: 50, right: 80, bottom: 200, left: 150 };
  const width = 1200 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;

  const svg = d3
    .select("#d-container2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Industry by US State");

  d3.csv(
    "./data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      data = data.slice(0, 500); //sliced because of the large dataset
      data.forEach(function (d) {
        d.salary = +d["What is your annual salary?"];
      });

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d["What industry do you work in?"]))
        .range([0, width])
        .padding(2.5);

      const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d["What state do you work in?"]))
        .range([height, 0])
        .padding(3.5);

      const rScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.salary)])
        .range([4, 10]);

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr(
          "cx",
          (d) =>
            xScale(d["What industry do you work in?"]) + xScale.bandwidth() / 2
        )
        .attr(
          "cy",
          (d) =>
            yScale(d["What state do you work in?"]) + yScale.bandwidth() / 2
        )
        .attr("r", (d) => rScale(d.salary))
        .attr("fill", "steelblue")
        .style("opacity", 0.7)
        .on("mouseover", function (d) {
          d3.select(this).transition().duration(200).style("opacity", 1.0);
        })
        .on("mouseout", function (d) {
          d3.select(this).transition().duration(200).style("opacity", 0.7);
        });

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.9em")
        .attr("dy", ".15em")
        .style("font-size", "10px");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .text("Industry")
        .style("font-size", "14px");

      svg
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .attr("y", -margin.left / 1.2)
        .attr("x", -height / 2);

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("US State")
        .style("font-size", "14px");
    }
  );
};

//-------------------------
//-------------------------
//=====VIJAY
//-------------------------
//-------------------------
const vijayChartA = () => {
  const margin = { top: 50, right: 120, bottom: 200, left: 90 };
  var width = 800,
    height = 400;

  d3.csv(
    "./data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      var industries = data.map(function (d) {
        return d["What industry do you work in?"];
      });

      var industryFrequency = {};

      industries.forEach(function (industry) {
        industryFrequency[industry] = (industryFrequency[industry] || 0) + 1;
      });

      var words = Object.keys(industryFrequency).map(function (industry) {
        return { text: industry, size: industryFrequency[industry] * 10 };
      });

      words.sort(function (a, b) {
        return b.size - a.size;
      });

      var layout = d3.layout
        .cloud()
        .size([width, 400])
        .words(words)
        .padding(5)
        .rotate(function () {
          return 0;
        })
        .fontSize(function (d) {
          return d.size;
        })
        .on("end", draw);

      layout.start();

      function draw(words) {
        var svg = d3
          .select("#v-container")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("text-decoration", "underline")
          .text("Industry by US State");

        var g = svg.append("g").attr("transform", "translate(400,200)");

        g.selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", function (d) {
            return d.size + "px";
          })
          .style("fill", function (d, i) {
            return d3.schemeCategory10[i % 10];
          })
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function (d) {
            return d.text;
          })
          .on("mouseover", mouseOver)
          .on("mouseout", mouseOut);

        function mouseOver() {
          d3.select(this).transition().duration(200).style("font-size", "20px");
        }

        function mouseOut() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("font-size", function (d) {
              return d.size + "px";
            });
        }
      }
    }
  );
};

const vijayChartB = () => {
  const margin = { top: 50, right: 120, bottom: 220, left: 90 };
  const width = 1000 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select("#v-container2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Industry by Gender");

  d3.csv(
    "./data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      data = data.slice(0, 1000);
      const nestedData = d3
        .nest()
        .key((d) => d["What industry do you work in?"])
        .key((d) => d["What is your gender?"])
        .rollup((values) =>
          d3.sum(values, (d) => d["What is your annual salary?"])
        )
        .entries(data);

      const genders = [...new Set(data.map((d) => d["What is your gender?"]))];

      const colorScale = d3
        .scaleOrdinal()
        .domain(genders)
        .range(["steelblue", "salmon", "lightgreen"]);

      const xScale = d3
        .scaleBand()
        .domain(nestedData.map((d) => d.key))
        .range([0, width])
        .padding(0.2);

      const yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(nestedData, (d) => d3.max(d.values, (d) => d.value)),
        ])
        .range([height, 0]);

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-65)");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .text("Industry")
        .style("font-size", "14px");

      svg
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left / 1.5)
        .attr("x", -height / 2)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .text("Annual Salary");

      svg
        .selectAll(".bar")
        .data(nestedData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", (d) => "translate(" + xScale(d.key) + ",0)")
        .selectAll("rect")
        .data((d) => d.values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale.bandwidth() / 2 - 15)
        .attr("y", (d) => yScale(d.value))
        .attr("width", 30)
        .attr("height", (d) => height - yScale(d.value))
        .attr("fill", (d) => colorScale(d.key));

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr(
          "transform",
          "translate(" + (width - 250) + "," + (height - 20) + ")"
        );

      legend
        .selectAll("rect")
        .data(genders)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 100)
        .attr("y", -320)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d) => colorScale(d));

      legend
        .selectAll("text")
        .data(genders)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 100 + 15)
        .attr("y", -310)
        .text((d) => d);
    }
  );
};

//-------------------------
//-------------------------
//=====KENNEDY
//-------------------------
//-------------------------

const kennedyChartA = () => {
  d3.csv(
    "./data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
    function (data) {
      var educationData = d3
        .nest()
        .key(function (d) {
          return d["What is your highest level of education completed?"];
        })
        .rollup(function (values) {
          return values.length;
        })
        .entries(data);

      var pieData = educationData.map(function (d) {
        return { education: d.key, count: d.value };
      });
      var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 1000,
        height = 600,
        radius =
          Math.min(
            width - margin.left - margin.right,
            height - margin.top - margin.bottom
          ) / 2;

      var svg = d3
        .select("#k-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var pie = d3.pie().value(function (d) {
        return d.count;
      });

      var arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - margin.top);

      var arcs = pie(pieData);

      svg
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("fill", function (d, i) {
          return d3.schemeCategory10[i];
        })
        .attr("d", arc)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .transition()
        .duration(1000)
        .attrTween("d", arcTween);

      svg
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
          return d.data.education;
        });

      svg
        .append("text")
        .attr("x", width / 30)
        .attr("y", -height / 2 + margin.top - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Level of Education");

      function handleMouseOver(event, d) {
        d3.select(this).attr("fill", "orange");
        d3.select(this)
          .transition()
          .duration(200)
          .attr(
            "d",
            d3
              .arc()
              .innerRadius(0)
              .outerRadius(radius * 0.9)
          );
      }

      function handleMouseOut(event, d) {
        d3.select(this).attr("fill", function (d, i) {
          return d3.schemeCategory10[Math.floor(Math.random() * 10)];
        });
        d3.select(this).transition().duration(200).attr("d", arc);
        d3.select(this.parentNode)
          .select("text")
          .transition()
          .duration(200)
          .attr("transform", (d) => `translate(${arc.centroid(d)})`);
      }

      function arcTween(d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      }
    }
  );
};

const kennedyChartB = () => {
  d3.csv(
    "./data/Ask_A_Manager_Salary_Survey_2021_(Responses).csv",
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

      var container = d3.select("#k-container2");

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

christinaChartA();
christinaChartB();
derryckChartA();
derryckChartB();
vijayChartA();
vijayChartB();
kennedyChartA();
kennedyChartB();
