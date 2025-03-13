import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function InteractivePieChart({ dataPath }) {
  const ref = useRef();

  useEffect(() => {
    d3.csv(dataPath).then((data) => {
      // Filter for a specific year, e.g., 2021
      const filteredData = data.filter(d => +d.Year === 2021);
      filteredData.forEach(d => {
        d.AvgHouseholdMedianIncome = +d.AvgHouseholdMedianIncome;
      });

      // Aggregate data by RegionName
      const aggregated = d3.rollup(
        filteredData,
        (v) => d3.mean(v, (d) => d.AvgHouseholdMedianIncome),
        (d) => d.RegionName
      );

      // Convert to an array
      const entries = Array.from(aggregated, ([label, value]) => ({ label, value }));
      const total = d3.sum(entries, d => d.value);

      // Group small slices into "Other"
      const threshold = 0.02; // 2%
      let mainSlices = [];
      let otherSum = 0;

      entries.forEach(d => {
        if (d.value / total < threshold) {
          otherSum += d.value;
        } else {
          mainSlices.push(d);
        }
      });

      if (otherSum > 0) {
        mainSlices.push({ label: "Other", value: otherSum });
      }

      // Setup SVG
      const width = 400, height = 400, radius = Math.min(width, height) / 2;
      const svg = d3.select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pie = d3.pie().value(d => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      svg.selectAll("path")
        .data(pie(mainSlices))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .on("mouseover", function() {
          svg.selectAll("path").attr("opacity", 0.4);
          d3.select(this).attr("opacity", 1);
        })
        .on("mouseout", function() {
          svg.selectAll("path").attr("opacity", 1);
        });
    });
  }, [dataPath]);

  return <svg ref={ref} className="mx-auto my-4"></svg>;
}
