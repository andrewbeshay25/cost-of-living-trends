import pandas as pd

# Load aggregated income and rent data
df_income = pd.read_csv('aggregated_income_by_city_year.csv')
df_rent = pd.read_csv('aggregated_rent_by_city_year.csv')

# Rename columns if necessary so the city columns match
df_income.rename(columns={'MajorCity': 'RegionName'}, inplace=True)

# Merge datasets on RegionName and Year
merged_df = pd.merge(df_income, df_rent, on=['RegionName', 'Year'], how='inner')

# Save merged data
merged_df.to_csv('merged_data.csv', index=False)
print("Merged data saved to 'merged_data.csv'")
