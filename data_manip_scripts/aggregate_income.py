import pandas as pd
from uszipcode import SearchEngine

def get_major_city(zip_code, search_engine):
    """
    Given a ZIP code, returns a string in the format "City, ST" using uszipcode.
    """
    try:
        result = search_engine.by_zipcode(zip_code)
        if result:
            # Try to get the major city; if not available, use the city attribute.
            city = result.major_city if hasattr(result, 'major_city') and result.major_city else result.city
            # Append the state if available.
            if city and hasattr(result, 'state') and result.state:
                return f"{city}, {result.state}"
            elif city:
                return city
        return None
    except Exception as e:
        print(f"Error retrieving city for ZIP code {zip_code}: {e}")
        return None

# -------------------------------
# Step 1: Load the filtered income CSV
# -------------------------------
filtered_income_file = 'filtered_income.csv'
df_income = pd.read_csv(filtered_income_file, dtype={'ZIP': str})

# Clean the ZIP column (remove extra whitespace)
df_income['ZIP'] = df_income['ZIP'].str.strip()

# -------------------------------
# Step 2: Build a mapping from ZIP code to MajorCity using uszipcode
# -------------------------------
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

# -------------------------------
# Step 3: Add a MajorCity column to the income dataframe
# -------------------------------
df_income['MajorCity'] = df_income['ZIP'].map(zip_to_city)

# Optionally drop rows where mapping failed
df_income = df_income.dropna(subset=['MajorCity'])

# -------------------------------
# Step 4: Aggregate the data by MajorCity and Year
# -------------------------------
# This step assumes that your income CSV has a "Year" column
# and the income metric is in "Households Median Income (Dollars)".
# Adjust these column names if necessary.
agg_income = (
    df_income
    .groupby(['MajorCity', 'Year'])['Households Median Income (Dollars)']
    .mean()
    .reset_index()
)

# Rename the aggregated column for clarity
agg_income.rename(columns={'Households Median Income (Dollars)': 'AvgHouseholdMedianIncome'}, inplace=True)

# Save the aggregated data to a new CSV file
output_file = 'aggregated_income_by_city_year.csv'
agg_income.to_csv(output_file, index=False)
print(f"Aggregated income data saved to '{output_file}'.")
