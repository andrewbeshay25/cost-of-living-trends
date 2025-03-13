// src/components/PieChartWithOther.jsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PieChartWithOther({ dataPath }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(dataPath).then(data => {
      data.forEach(d => {
        d.Year = +d.Year;
        d.AvgHouseholdMedianIncome = +d.AvgHouseholdMedianIncome;
      });

      // For demonstration, pick a single city + year
      const city = "Abilene, TX";
      const year = 2021;
      const filtered = data.filter(d => d.RegionName === city && d.Year === year);

      // If your data is already city-level, you might only see 1 row
      // This example lumps smaller slices (subregions) into "Other"
      // We'll pretend each row is a different subregion
      const total = d3.sum(filtered, d => d.AvgHouseholdMedianIncome);
      let slices = filtered.map((d, i) => ({
        label: `Subregion ${i + 1}`,
        value: d.AvgHouseholdMedianIncome,
      }));

      let mainSlices = [];
      let otherSum = 0;
      slices.forEach(s => {
        if (s.value / total < 0.02) {
          otherSum += s.value;
        } else {
          mainSlices.push(s);
        }
      });
      if (otherSum > 0) {
        mainSlices.push({ label: "Other", value: otherSum });
      }

      const width = 400, height = 400;
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
        .data(pie(mainSlices))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .on("mouseover", function() {
          g.selectAll("path").attr("opacity", 0.4);
          d3.select(this).attr("opacity", 1);
        })
        .on("mouseout", function() {
          g.selectAll("path").attr("opacity", 1);
        });
    });
  }, [dataPath]);

  return <svg ref={svgRef} className="mx-auto my-4"></svg>;
}
