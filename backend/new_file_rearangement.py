import pandas as pd

# Load the Excel file
input_file = '/home/sxph/Downloads/AGRIBALYSE.xlsx'  # Replace with your input file name
output_file = '/home/sxph/Downloads/output.xlsx'  # Replace with your desired output file name

# Read all sheets from the Excel file into a dictionary of DataFrames
dfs = pd.read_excel(input_file, sheet_name=None)

# Dictionary to store processed DataFrames
processed_dfs = {}

# Specify the columns you want to combine
columns_to_combine = ["Sous-groupe d'aliment", 'Livraison', "Materiau d'emballage", "Preparation"]  # Replace with your column names

# Iterate over each sheet in the Excel file
for sheet_name, df in dfs.items():
    # Rename the specified columns
     
    try:
        if "Catégorie" in df.columns:
        # Replace backslashes with " > " in the "Catégorie" column
            df["Catégorie"] = sheet_name + " > " + df["Catégorie"].str.replace("\\", " > ", regex=False)
    except Exception as e:
        # Log the exception message or handle it accordingly
        print(f"An error occurred: {e}")


    df.rename(columns={
        'Code AGB': "Identifiant de l'élément",
        'kg CO2 eq/kg': "Total poste non décomposé",
        'Nom du Produit en Francais': "name",
        "Catégorie":"Code de la catégorie"
    }, inplace=True)
    
    # Check if all specified columns exist in the DataFrame
    for col in columns_to_combine:
        if col not in df.columns:
            print(f"Warning: Column '{col}' not found in sheet '{sheet_name}'. Skipping this sheet.")
            continue
    
    # Create a new column with combined values
    if all(col in df.columns for col in columns_to_combine):
     
        df['Code de la catégorie'] = sheet_name + ' > '+ df[columns_to_combine].fillna('').astype(str).agg(' > '.join, axis=1)
       
    
        
    # Store the processed DataFrame in the dictionary
    processed_dfs[sheet_name] = df

# Save all processed DataFrames to a new Excel file
with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
    for sheet_name, df in processed_dfs.items():
        df.to_excel(writer, sheet_name=sheet_name, index=False)

print(f"Processed Excel file saved to {output_file}")
