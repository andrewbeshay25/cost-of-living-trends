// src/components/Top5BarChart.jsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Top5BarChart({ dataPath }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.csv(dataPath).then((data) => {
      data.forEach(d => {
        d.Year = +d.Year;
        d.AvgRent = +d.AvgRent;
      });

      // Filter for 2021
      const data2021 = data.filter(d => d.Year === 2021);
      if (data2021.length === 0) {
        console.warn("No 2021 data found!");
        return;
      }

      // Group by city
      const rentByCity = d3.rollup(
        data2021,
        v => d3.mean(v, d => d.AvgRent),
        d => d.RegionName
      );

      let rentArray = Array.from(rentByCity, ([city, rent]) => ({ city, rent }));
      rentArray.sort((a, b) => b.rent - a.rent);
      rentArray = rentArray.slice(0, 5); // top 5

      const margin = { top: 20, right: 20, bottom: 40, left: 100 };
      const width = 600 - margin.left - margin.right;
      const height = 350 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const xMax = d3.max(rentArray, d => d.rent) || 0;
      const xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, width]);

      const yScale = d3.scaleBand()
        .domain(rentArray.map(d => d.city))
        .range([0, height])
        .padding(0.1);

      // Axes
      g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5));

      g.append("g")
        .call(d3.axisLeft(yScale));

      // Tooltip
      const tooltip = d3.select(tooltipRef.current)
        .style("position", "absolute")
        .style("padding", "6px 12px")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("visibility", "hidden");

      // Bars
      g.selectAll("rect")
        .data(rentArray)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.city))
        .attr("width", d => xScale(d.rent))
        .attr("height", yScale.bandwidth())
        .attr("fill", "teal")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "orange");
          tooltip
            .style("visibility", "visible")
            .text(`${d.city}: $${d.rent.toFixed(2)}`);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 40) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "teal");
          tooltip.style("visibility", "hidden");
        });
    });
  }, [dataPath]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
}
