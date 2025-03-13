import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineChart({ dataPath }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.csv(dataPath).then((data) => {
      data.forEach(d => {
        d.Year = +d.Year;
        d.AvgHouseholdMedianIncome = +d.AvgHouseholdMedianIncome;
        d.AvgRent = +d.AvgRent;
      });

      // Filter for one city
      const cityData = data.filter(d => d.RegionName === "Abilene, TX");

      const margin = { top: 20, right: 60, bottom: 60, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 350 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      // Clear any existing content
      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Scales
      const xScale = d3.scaleLinear()
        .domain(d3.extent(cityData, d => d.Year))
        .range([0, width]);

      const yScaleIncome = d3.scaleLinear()
        .domain([
          d3.min(cityData, d => d.AvgHouseholdMedianIncome) * 0.9,
          d3.max(cityData, d => d.AvgHouseholdMedianIncome) * 1.1
        ])
        .range([height, 0]);

      const yScaleRent = d3.scaleLinear()
        .domain([
          d3.min(cityData, d => d.AvgRent) * 0.9,
          d3.max(cityData, d => d.AvgRent) * 1.1
        ])
        .range([height, 0]);

      // 1) X-axis (inline call, no variable assigned)
      g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

      // 2) Left y-axis
      g.append("g")
        .call(d3.axisLeft(yScaleIncome));

      // 3) Right y-axis
      g.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(yScaleRent));

      // Axis labels
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Year");

      g.append("text")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Median Income ($)");

      // Adjust transform so the right axis label doesn't overlap
      g.append("text")
        .attr("transform", `translate(${width + 40}, ${height / 2}) rotate(90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Average Rent ($)");

      // Tooltip
      const tooltip = d3.select(tooltipRef.current)
        .style("position", "absolute")
        .style("padding", "6px 12px")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("visibility", "hidden");

      // Lines
      const incomeLine = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScaleIncome(d.AvgHouseholdMedianIncome));

      const rentLine = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScaleRent(d.AvgRent));

      // Income line
      g.append("path")
        .datum(cityData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", incomeLine)
        .on("mouseover", function () {
          d3.select(this).attr("stroke-width", 4);
          tooltip.style("visibility", "visible").text("Median Income");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", (event.pageY - 40) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", 2);
          tooltip.style("visibility", "hidden");
        });

      // Rent line
      g.append("path")
        .datum(cityData)
        .attr("fill", "none")
        .attr("stroke", "tomato")
        .attr("stroke-width", 2)
        .attr("d", rentLine)
        .on("mouseover", function () {
          d3.select(this).attr("stroke-width", 4);
          tooltip.style("visibility", "visible").text("Average Rent");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", (event.pageY - 40) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", 2);
          tooltip.style("visibility", "hidden");
        });
    });
  }, [dataPath]);

  return (
    <div className="relative mx-auto my-4 bg-white p-4 shadow rounded max-w-xl">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
}
