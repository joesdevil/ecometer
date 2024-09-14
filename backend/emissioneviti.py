# import pandas as pd

# # Load the Excel file
# input_file = '/home/sxph/Downloads/ADEM.xlsx'  # Replace with your input file name
# output_file = '/home/sxph/Downloads/out_ADEM.xlsx'  # Replace with your desired output file name

# # Read all sheets from the Excel file into a dictionary of DataFrames
# dfs = pd.read_excel(input_file, sheet_name=None)
# processed_dfs={}
# elementPOst=dfs
 
# # Iterate over each sheet in the Excel file
# for sheet_name, df in dfs.items():
#     print("sheet=> ",sheet_name)
 
    
#     if 'Type Ligne' in df.columns and df['Type Ligne'].eq('Elément').any():
#         elementPOst=df


#     if 'Nom base français' in df.columns and 'Nom attribut français' in df.columns:
#         value = df["Total poste non décomposé"]
#         elementPOst["Emissions évitées"]=value

#     processed_dfs[sheet_name] = df

# # Save all processed DataFrames to a new Excel file
# with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
#     for sheet_name, df in processed_dfs.items():
#         df.to_excel(writer, sheet_name=sheet_name, index=False)

# print(f"Processed Excel file saved to {output_file}")

import pandas as pd

# Load the Excel file
input_file = '/home/sxph/Downloads/ADEM.xlsx'  # Replace with your input file name
output_file = '/home/sxph/Downloads/out_ADEM.xlsx'  # Replace with your desired output file name

# Read the Excel file into a DataFrame
df = pd.read_excel(input_file)

# Step 1: Filter rows where 'Type Ligne' is 'Elément'
element_df = df[df['Type Ligne'] == 'Elément'].copy()


# Step 2: Identify and extract value where 'Nom base français' is "Evite"
if 'Nom base français' in element_df.columns:
    
    evite_row = element_df[element_df['Nom base français'] == "Emissions évitées"]
    evite_row2 = element_df[element_df['Nom attribut français'].str.contains("fin de vie moyenne", case=False, na=False)  ]
    print(evite_row , evite_row2)

    if not evite_row.empty and evite_row2:
        evite_value = evite_row['Total poste non décomposé'].values[0]
        print(f"Value for 'Evite': {evite_value}")


# Step 3: Update the last 'Non Evite' entry
# non_evite_df = df[df['Type Ligne'] == 'Non Evite'].copy()
# if not non_evite_df.empty:
#     # Ensure that the DataFrame is sorted if needed, e.g., by a specific column
#     # non_evite_df = non_evite_df.sort_values(by='SomeColumn')
    
#     last_non_evite_index = non_evite_df.index[-1]  # Get the index of the last row
#     df.at[last_non_evite_index, 'Total'] = evite_value  # Update the 'Total' column value

# # Save the processed DataFrame to a new Excel file
# df.to_excel(output_file, index=False)

print(f"Processed Excel file saved to {output_file}")
