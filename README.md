# Cost of Living Trends in Major U.S. Cities

## Overview
This project is an interactive data visualization built with React that explores trends in median household incomes and average rents across major U.S. cities. By comparing these two datasets over time, the goal is to shed light on regional cost-of-living differences and overall affordability.

## Essential Question
**How have median household incomes and average rents changed over time in major U.S. cities, and what does this reveal about cost-of-living differences?**

## Data Sources
To ensure that the analysis is both reliable and relevant, I plan to gather data from these reputable sources:

- **Kaggle Datasets:**  
  Visit [https://www.kaggle.com/datasets](https://www.kaggle.com/datasets/) for income data and demographic information.

- **Zillow Research Data:**  
  Explore [https://www.zillow.com/research/data/](https://www.zillow.com/research/data/) for insights on average rents and other housing market data.

## Visualization Approach
Here’s how I plan to visualize the data:
- **Line Charts:** To display trends in median income and average rents over time.
- **Dual-Axis Charts:** For a side-by-side comparison of the two metrics on the same timeline.
- **Interactive Filters:** Allowing users to select specific cities or time ranges for a more detailed analysis.

## Repository Structure
```
cost-of-living-trends/
├── FILE_STRUCTURE.txt
├── README.md
├── app
├── data_manip_scripts
│   ├── aggregate_income.py
│   ├── aggregate_rent.py
│   ├── merging.py
│   └── zip_code_matching.py
├── frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── data
│   │   │   ├── aggregated_income_by_city_year.csv
│   │   │   ├── aggregated_rent_by_city_year.csv
│   │   │   └── merged_data.csv
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── BarChart.jsx
│   │   │   ├── IncomePieChart.jsx
│   │   │   ├── IncomeVsRentLineChart.jsx
│   │   │   ├── InteractivePieChart.jsx
│   │   │   ├── LineChart.jsx
│   │   │   ├── MermaidDiagram.jsx
│   │   │   ├── MultiLineChart.jsx
│   │   │   ├── MultiLineTop3Chart.jsx
│   │   │   ├── PieChartWithOther.jsx
│   │   │   ├── StoryParagraph.jsx
│   │   │   └── Top5BarChart.jsx
│   │   ├── index.css
│   │   └── index.js
│   └── tailwind.config.js
├── index.html
├── requirements.txt
└── script.js
```

# How to run:

## Getting Started
1. **Clone the repository:**
   ```
   git clone https://github.com/andrewbeshay25/cost-of-living-trends.git
   ```
2. **Install dependencies**:
    ```
    npm install
    ```
3. **Run the project**:
    ```
    npm start
    ```
