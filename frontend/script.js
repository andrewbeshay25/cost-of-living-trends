// Define dimensions for the chart
const margin = { top: 20, right: 60, bottom: 50, left: 60 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Create an SVG element
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load merged data
d3.csv("../data/merged_data.csv").then(data => {
  // Parse the year as a number and income/rent as numbers
  data.forEach(d => {
    d.Year = +d.Year;
    d.AvgHouseholdMedianIncome = +d.AvgHouseholdMedianIncome;
    d.AvgRent = +d.AvgRent;
  });

  // Filter for a specific city or implement a dropdown for user selection.
  const selectedCity = "Abilene, TX"; // For example
  const cityData = data.filter(d => d.RegionName === selectedCity);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(cityData, d => d.Year))
    .range([0, width]);
  
  const yScaleIncome = d3.scaleLinear()
    .domain([d3.min(cityData, d => d.AvgHouseholdMedianIncome) * 0.9,
             d3.max(cityData, d => d.AvgHouseholdMedianIncome) * 1.1])
    .range([height, 0]);

  const yScaleRent = d3.scaleLinear()
    .domain([d3.min(cityData, d => d.AvgRent) * 0.9,
             d3.max(cityData, d => d.AvgRent) * 1.1])
    .range([height, 0]);

  // Define line generators for income and rent
  const incomeLine = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScaleIncome(d.AvgHouseholdMedianIncome));
  
  const rentLine = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScaleRent(d.AvgRent));

  // Append axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  
  svg.append("g")
    .call(d3.axisLeft(yScaleIncome));

  svg.append("g")
    .attr("transform", `translate(${width}, 0)`)
    .call(d3.axisRight(yScaleRent));

  // Draw income line
  svg.append("path")
    .datum(cityData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", incomeLine);
  
  // Draw rent line
  svg.append("path")
    .datum(cityData)
    .attr("fill", "none")
    .attr("stroke", "tomato")
    .attr("stroke-width", 2)
    .attr("d", rentLine);

  // Optionally, add labels, tooltips, and interactivity here.
});
