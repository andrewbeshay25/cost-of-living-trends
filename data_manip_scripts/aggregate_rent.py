import pandas as pd

def main():
    rent_file = "Metro_total_monthly_payment.csv"
    df = pd.read_csv(rent_file)
    
    id_vars = ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
    
    df_long = pd.melt(df, 
                      id_vars=id_vars, 
                      var_name="Date", 
                      value_name="Rent")
    
    df_long["Date"] = pd.to_datetime(df_long["Date"], errors="coerce")
    df_long = df_long.dropna(subset=["Date"])
    
    df_long["Year"] = df_long["Date"].dt.year
    
    df_long["Rent"] = pd.to_numeric(df_long["Rent"], errors="coerce")
    df_long = df_long.dropna(subset=["Rent"])
    
    aggregated = (
        df_long
        .groupby(["RegionName", "Year"])["Rent"]
        .mean()
        .reset_index()
    )
    
    aggregated.rename(columns={"Rent": "AvgRent"}, inplace=True)
    
    output_file = "aggregated_rent_by_city_year.csv"
    aggregated.to_csv(output_file, index=False)
    print(f"Aggregated rent data saved to '{output_file}'.")

if __name__ == "__main__":
    main()
