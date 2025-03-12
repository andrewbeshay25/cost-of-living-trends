import pandas as pd

def main():
    # -------------------------------
    # Step 1: Load the Rent CSV
    # -------------------------------
    rent_file = "Metro_total_monthly_payment.csv"
    df = pd.read_csv(rent_file)
    
    # The identifier columns we want to keep (adjust if necessary)
    id_vars = ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
    
    # -------------------------------
    # Step 2: Reshape the Data from Wide to Long Format
    # -------------------------------
    # The remaining columns (monthly rent values) become rows.
    df_long = pd.melt(df, 
                      id_vars=id_vars, 
                      var_name="Date", 
                      value_name="Rent")
    
    # Convert the Date column to datetime objects.
    df_long["Date"] = pd.to_datetime(df_long["Date"], errors="coerce")
    # Remove any rows where Date conversion failed.
    df_long = df_long.dropna(subset=["Date"])
    
    # -------------------------------
    # Step 3: Extract the Year and Clean the Rent Values
    # -------------------------------
    df_long["Year"] = df_long["Date"].dt.year
    
    # Ensure Rent is numeric (if not, coerce errors to NaN and drop them)
    df_long["Rent"] = pd.to_numeric(df_long["Rent"], errors="coerce")
    df_long = df_long.dropna(subset=["Rent"])
    
    # -------------------------------
    # Step 4: Aggregate the Data to Annual Average Rent per City
    # -------------------------------
    aggregated = (
        df_long
        .groupby(["RegionName", "Year"])["Rent"]
        .mean()
        .reset_index()
    )
    
    # Rename the aggregated column for clarity.
    aggregated.rename(columns={"Rent": "AvgRent"}, inplace=True)
    
    # -------------------------------
    # Step 5: Save the Aggregated Data
    # -------------------------------
    output_file = "aggregated_rent_by_city_year.csv"
    aggregated.to_csv(output_file, index=False)
    print(f"Aggregated rent data saved to '{output_file}'.")

if __name__ == "__main__":
    main()
