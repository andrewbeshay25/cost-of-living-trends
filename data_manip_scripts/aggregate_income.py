import pandas as pd
from uszipcode import SearchEngine

def get_major_city(zip_code, search_engine):
    try:
        result = search_engine.by_zipcode(zip_code)
        if result:
            city = result.major_city if hasattr(result, 'major_city') and result.major_city else result.city
            if city and hasattr(result, 'state') and result.state:
                return f"{city}, {result.state}"
            elif city:
                return city
        return None
    except Exception as e:
        print(f"Error retrieving city for ZIP code {zip_code}: {e}")
        return None

filtered_income_file = 'filtered_income.csv'
df_income = pd.read_csv(filtered_income_file, dtype={'ZIP': str})

df_income['ZIP'] = df_income['ZIP'].str.strip()

search = SearchEngine()
unique_zips = df_income['ZIP'].unique()

zip_to_city = {}
for zip_code in unique_zips:
    major_city = get_major_city(zip_code, search)
    if major_city:
        zip_to_city[zip_code] = major_city
    else:
        print(f"Warning: No major city found for ZIP code {zip_code}")

print(f"Created mapping for {len(zip_to_city)} out of {len(unique_zips)} unique ZIP codes.")

df_income['MajorCity'] = df_income['ZIP'].map(zip_to_city)

df_income = df_income.dropna(subset=['MajorCity'])

agg_income = (
    df_income
    .groupby(['MajorCity', 'Year'])['Households Median Income (Dollars)']
    .mean()
    .reset_index()
)

agg_income.rename(columns={'Households Median Income (Dollars)': 'AvgHouseholdMedianIncome'}, inplace=True)

output_file = 'aggregated_income_by_city_year.csv'
agg_income.to_csv(output_file, index=False)
print(f"Aggregated income data saved to '{output_file}'.")
