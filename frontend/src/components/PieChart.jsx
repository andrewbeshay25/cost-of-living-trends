import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PieChart({ dataPath }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(dataPath).then(data => {
      data.forEach(d => {
        d.Year = +d.Year;
        d.AvgRent = +d.AvgRent;
      });

      const filtered = data.filter(d => d.Year === 2021);

      const rentByCity = d3.rollup(
        filtered,
        v => d3.mean(v, d => d.AvgRent),
        d => d.RegionName
      );

      let slices = Array.from(rentByCity, ([label, value]) => ({ label, value }));
      slices.sort((a, b) => b.value - a.value);

      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie().value(d => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      g.selectAll("path")
        .data(pie(slices))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .on("mouseover", function (event, d) {

          g.selectAll("path").attr("opacity", 0.4);
          d3.select(this).attr("opacity", 1);

          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.data.label}</strong><br/>Avg Rent: $${d.data.value.toFixed(2)}`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function () {
          g.selectAll("path").attr("opacity", 1);
          tooltip.style("opacity", 0);
        });

      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background", "#fff")
        .style("padding", "6px 8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("font-size", "0.9rem")
        .style("opacity", 0);
        
      return () => {
        tooltip.remove();
      };
    }).catch(error => {
      console.error("Error loading pie chart data:", error);
    });
  }, [dataPath]);

  return <svg ref={svgRef} className="mx-auto my-4"></svg>;
}
