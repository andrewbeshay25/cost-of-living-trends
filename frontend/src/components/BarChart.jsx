import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChart({ dataPath }) {
  const ref = useRef();

  useEffect(() => {
    d3.csv(dataPath).then((data) => {
      data.forEach(d => {
        d.Year = +d.Year;
        d.AvgRent = +d.AvgRent;
      });

      // Filter for 2021 and group by city
      const data2021 = data.filter(d => d.Year === 2021);
      const rentByCity = d3.rollup(
        data2021,
        v => d3.mean(v, d => d.AvgRent),
        d => d.RegionName
      );

      // Convert to array and sort descending
      let rentArray = Array.from(rentByCity, ([city, rent]) => ({ city, rent }));
      rentArray.sort((a, b) => b.rent - a.rent);

      // Take top 5
      rentArray = rentArray.slice(0, 5);

      const margin = { top: 20, right: 20, bottom: 40, left: 80 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(ref.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      // Clear in case of re-renders
      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(rentArray, d => d.rent)])
        .range([0, width]);

      const yScale = d3.scaleBand()
        .domain(rentArray.map(d => d.city))
        .range([0, height])
        .padding(0.1);

      // X axis
      g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      // Y axis
      g.append("g")
        .call(d3.axisLeft(yScale));

      // Bars
      g.selectAll("rect")
        .data(rentArray)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.city))
        .attr("width", d => xScale(d.rent))
        .attr("height", yScale.bandwidth())
        .attr("fill", "teal")
        .on("mouseover", function() {
          d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "teal");
        });
    });
  }, [dataPath]);

  return <svg ref={ref} className="mx-auto my-4"></svg>;
}
