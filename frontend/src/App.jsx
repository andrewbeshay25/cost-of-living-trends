// src/App.jsx
import React from "react";
import MultiLineTop3Chart from "./components/MultiLineTop3Chart";
import LineChart from "./components/LineChart";
import Top5BarChart from "./components/Top5BarChart";
import PieChartWithOther from "./components/PieChartWithOther";
import MermaidDiagram from "./components/MermaidDiagram";
import StoryParagraph from "./components/StoryParagraph";

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-8 text-center text-white mb-8">
        <h1 className="text-5xl font-bold mb-2">Cost of Living Trends</h1>
        <p className="text-xl">Exploring Incomes & Rents in Major U.S. Cities</p>
      </section>

      <main className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">
        {/* Single-City Income vs. Rent */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Income vs. Rent: A Closer Look at One City</h2>
          <StoryParagraph text="We start by focusing on a single city to see how median household incomes (blue) compare with average rents (red) over time. Hover over either line to see a tooltip describing which line you're on." />
          <LineChart dataPath="data/merged_data.csv" />
        </div>

        {/* Multi-City Top 3 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Top 3 Cities by Rent</h2>
          <StoryParagraph text="Next, let's compare the three cities with the highest average rents in 2021, to see how their rents evolve over multiple years. Each line represents a city; hover over a line to highlight which city it belongs to." />
          <MultiLineTop3Chart dataPath="data/merged_data.csv" />
        </div>

        {/* Bar Chart for Top 5 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Top 5 Cities by Average Rent (2021)</h2>
          <StoryParagraph text="This bar chart quickly shows which cities rank highest by average rent in 2021. Hover over a bar to see the exact rent value." />
          <Top5BarChart dataPath="data/merged_data.csv" />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Breaking Down a Single City</h2>
          <StoryParagraph text="For one city in 2021, smaller slices (under 2%) are grouped into 'Other' to avoid visual clutter. Hover over each slice to highlight it." />
          <PieChartWithOther dataPath="data/merged_data.csv" />
        </div>

        {/* Mermaid Diagram */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Conceptual Overview</h2>
          <StoryParagraph text="Here's a diagram showing how incomes and rents feed into affordability, influencing housing policies and future cost-of-living." />
          <MermaidDiagram
            definition={`
              graph LR;
                A[Median Incomes] --> Affordability;
                B[Average Rents] --> Affordability;
                Affordability --> Policy[Housing Policy];
                Policy --> Future[Future Cost of Living];
            `}
          />
        </div>
      </main>
    </div>
  );
}
