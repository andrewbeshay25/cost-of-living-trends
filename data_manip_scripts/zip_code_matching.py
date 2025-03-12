import pandas as pd
from uszipcode import SearchEngine

# -------------------------------
# Step 1: Load the Metro Payments CSV and extract major regions
# -------------------------------
payments_file = 'Metro_total_monthly_payment.csv'
df_payments = pd.read_csv(payments_file)

# Extract unique region names; expected format: "City, ST" (e.g., "New York, NY")
unique_regions = df_payments['RegionName'].dropna().unique()

# -------------------------------
# Step 2: Use uszipcode to find ZIP codes for each major city
# -------------------------------
zip_set = set()  # To store unique ZIP codes

# Initialize the uszipcode SearchEngine
search = SearchEngine()

for region in unique_regions:
    # Only process regions that appear to be in "City, ST" format.
    if ',' not in region:
        print(f"Skipping region '{region}' because it does not match the format 'City, ST'.")
        continue
    try:
        # Split the region into city and state (using a single split in case there are extra commas)
        parts = region.split(',', 1)
        if len(parts) != 2:
            print(f"Skipping region '{region}' due to unexpected format.")
            continue
        city, state = parts
        city = city.strip()
        state = state.strip()
        
        # Use the new method by_city_and_state (the current API expects keyword arguments)
        zipcode_objs = search.by_city_and_state(city=city, state=state)
        
        # Ensure zipcode_objs is iterable
        if not isinstance(zipcode_objs, list):
            zipcode_objs = [zipcode_objs]
        
        for zipcode_obj in zipcode_objs:
            try:
                # Some results may be dicts, strings, or objects with a zipcode attribute.
                if isinstance(zipcode_obj, dict):
                    z = zipcode_obj.get('zipcode')
                    if z:
                        zip_set.add(str(z))
                elif isinstance(zipcode_obj, str):
                    zip_set.add(zipcode_obj)
                elif hasattr(zipcode_obj, 'zipcode'):
                    zip_set.add(str(zipcode_obj.zipcode))
                else:
                    zip_set.add(str(zipcode_obj))
            except Exception as inner_e:
                print(f"Error processing a zipcode object for region '{region}': {inner_e}")
    except Exception as e:
        print(f"Error processing region '{region}': {e}")

print(f"Found {len(zip_set)} ZIP codes corresponding to the major cities.")

# -------------------------------
# Step 3: Load the Income CSV and filter based on ZIP codes
# -------------------------------
income_file = 'us_income_zipcode.csv'
# Read the income CSV, ensuring the ZIP column is read as a string.
df_income = pd.read_csv(income_file, dtype={'ZIP': str})

# Clean the ZIP column (remove extra whitespace)
df_income['ZIP'] = df_income['ZIP'].str.strip()

# Filter the income data to keep only rows where the ZIP code is in our set
filtered_income = df_income[df_income['ZIP'].isin(zip_set)]
print(f"Filtered income data now contains {filtered_income.shape[0]} rows.")

# -------------------------------
# Step 4: Save the filtered income data for further analysis/visualization
# -------------------------------
output_file = 'filtered_income_by_major_cities.csv'
filtered_income.to_csv(output_file, index=False)
print(f"Filtered income data saved to '{output_file}'.")
