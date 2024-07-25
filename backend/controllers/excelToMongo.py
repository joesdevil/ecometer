import pandas as pd
from pymongo import MongoClient

# Read the Excel file
excel_file_path = "c:/Users/momoh/OneDrive/Desktop/NvBdd2.xlsx"
excel_data = pd.read_excel(excel_file_path, sheet_name=None)  # Read all sheets

# MongoDB connection URI
mongo_uri = 'mongodb://localhost:27017/'

# Connect to MongoDB
client = MongoClient(mongo_uri)

# Select the database
db = client['ecometer']
db_categories=client['categories']

# Iterate through each sheet and insert the data into separate collections
for sheet_name, df in excel_data.items():
    print(f"Processing sheet: {sheet_name}...")
    
    # Convert the DataFrame to JSON
    json_data = df.to_dict(orient='records')
    sheet_name_coll=sheet_name.replace(" ","").replace('É', 'E').replace('é', 'e').lower()
    # Select the collection (using sheet name as collection name)
    collection = db[sheet_name_coll]
    
    # Insert the JSON data into the collection
    collection.insert_many(json_data)
    
    print(f"Inserted {len(json_data)} records into the {sheet_name} collection.")
    
 
    for record in json_data:
        
        category_code = record.get('Code de la catégorie')
        if category_code:
            categories= category_code.split(' > ')
            record["categories"]=categories
            # record["name"]=sheet_name
            db_categories[sheet_name_coll].insert_one(record)


    
    print("categories set",categories)
print("Data inserted successfully!")
