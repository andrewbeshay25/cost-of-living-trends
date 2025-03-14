// src/App.jsx
import React from "react";
import MultiLineTop3Chart from "./components/MultiLineTop3Chart";
import LineChart from "./components/LineChart";
import Top5BarChart from "./components/Top5BarChart";
import PieChart from "./components/PieChart";  // Renamed from PieChartWithOther if needed
import MermaidDiagram from "./components/MermaidDiagram";
import StoryParagraph from "./components/StoryParagraph";

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-8 text-center text-white mb-8">
        <h1 className="text-5xl font-bold mb-2">Are We Headed for a Cost-of-Living Crisis?</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Examining How Median Incomes and Rents Shape Our Economic Future
        </p>
      </section>

      <main className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">
        {/* Section 1: Single-City Income vs. Rent */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Incomes vs. Rents: The Growing Gap</h2>
          <StoryParagraph text="Let's start by zooming in on one city. Over the past several years, rents (red) have often outpaced median household incomes (blue). When rents rise faster than incomes, families face an increased cost burden that can limit their financial freedom. Hover over either line to see which metric you're examining." />
          <LineChart dataPath="data/merged_data.csv" />
          <StoryParagraph text="This chart may look modest, but it reveals an important trend: even a small difference between income and rent growth can compound over time, leading to housing insecurity and reduced savings for many households." />
        </div>

        {/* Section 2: Multi-City Top 3 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Three Cities Feeling the Heat</h2>
          <StoryParagraph text="Here, we compare three U.S. cities that have shown the highest average rents in the most recent data. Notice how their rent trajectories change year to year, and think about how rising housing costs could push residents out of these markets." />
          <MultiLineTop3Chart dataPath="data/merged_data.csv" />
          <StoryParagraph text="While some cities try to balance rising rents with local policies, others are quickly becoming unaffordable. The steep climbs you see here often correlate with rapid urban development, limited housing supply, and growing demand." />
        </div>

        {/* Section 3: Bar Chart for Top 5 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Top 5 Cities by Rent (2021)</h2>
          <StoryParagraph text="Which cities rank highest for average rent in 2021? This bar chart highlights the top five, revealing just how wide the gap can be between relatively affordable and extremely expensive regions. Hover over each bar to see the exact rent." />
          <Top5BarChart dataPath="data/merged_data.csv" />
          <StoryParagraph text="Cities topping this list often grapple with housing shortages, job growth outpacing construction, or a lack of affordable units. Over time, these factors can exacerbate a cost-of-living crisis that disproportionately affects lower-income residents." />
        </div>

        {/* Section 4: Pie Chart of All Cities in 2021 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Distribution of Average Rents (2021)</h2>
          <StoryParagraph text="This pie chart shows the share of average rent for each city in 2021, allowing us to compare how much rent contributes to the overall cost-of-living across regions." />
          <PieChart dataPath="data/merged_data.csv" />
        </div>


        {/* Section 5: Mermaid Diagram - Conceptual Flow */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">How Does This All Connect?</h2>
          <StoryParagraph text="This diagram shows how median incomes and rents feed into affordability, influencing housing policies that shape our future cost-of-living. Without balanced growth, we risk a deeper crisis affecting everything from family budgets to local economies." />
          <MermaidDiagram
            definition={`
              graph LR;
                A[Median Incomes] --> Affordability;
                B[Average Rents] --> Affordability;
                Affordability --> Policy[Housing Policy];
                Policy --> Future[Future Cost of Living];
            `}
          />
          <StoryParagraph text="Policymakers often weigh economic incentives against affordability goals. If rents keep climbing faster than incomes, the 'Affordability' node shrinks, putting pressure on 'Housing Policy' to intervene—or face a potential cost-of-living crisis." />
        </div>
      </main>

      {/* Conclusion Section */}
      <footer className="max-w-screen-lg mx-auto px-4 py-8 text-center">
        <h3 className="text-xl font-bold mb-2">Looking Ahead</h3>
        <p className="text-gray-700">
          As cities evolve and populations shift, the delicate balance between incomes and rents
          remains a key indicator of economic health. Monitoring these trends helps us anticipate
          potential crises and shape policies that keep housing within reach for everyone.
        </p>
      </footer>
    </div>
  );
}
