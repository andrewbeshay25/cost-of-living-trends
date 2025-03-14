import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function MultiLineTop3Chart({ dataPath }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.csv(dataPath).then((data) => {
      data.forEach(d => {
        d.Year = +d.Year;
        d.AvgRent = +d.AvgRent;
      });

      const data2021 = data.filter(d => d.Year === 2021);
      const avgRentByCity = d3.rollup(
        data2021,
        v => d3.mean(v, d => d.AvgRent),
        d => d.RegionName
      );
      let rentArray = Array.from(avgRentByCity, ([city, rent]) => ({ city, rent }));
      rentArray.sort((a, b) => b.rent - a.rent);
      const top3Cities = rentArray.slice(0, 3).map(d => d.city);

      const filteredData = data.filter(d => top3Cities.includes(d.RegionName));

      const cityGroups = d3.groups(filteredData, d => d.RegionName).map(([city, values]) => ({
        city,
        values: values.sort((a, b) => a.Year - b.Year),
      }));

      // Dimensions
      const margin = { top: 20, right: 80, bottom: 50, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 350 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const allValues = filteredData.map(d => d.AvgRent);
      const xExtent = d3.extent(filteredData, d => d.Year);

      const xScale = d3.scaleLinear()
        .domain(xExtent)
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([
          d3.min(allValues) * 0.9,
          d3.max(allValues) * 1.1
        ])
        .range([height, 0]);

      const color = d3.scaleOrdinal(d3.schemeSet2)
        .domain(top3Cities);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

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

      // Line generator
      const line = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d.AvgRent));

      // Draw lines
      g.selectAll(".city-line")
        .data(cityGroups)
        .enter()
        .append("path")
        .attr("class", "city-line")
        .attr("fill", "none")
        .attr("stroke", d => color(d.city))
        .attr("stroke-width", 2)
        .attr("d", d => line(d.values))
        .on("mouseover", function(event, d) {
          d3.select(this).attr("stroke-width", 4);
          tooltip.style("visibility", "visible").text(d.city);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 40) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke-width", 2);
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
