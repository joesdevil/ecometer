# import pandas as pd
# from pymongo import MongoClient

# # Read the Excel file
# excel_file_path = "c:/Users/momoh/OneDrive/Desktop/NvBdd2.xlsx"
# excel_data = pd.read_excel(excel_file_path, sheet_name=None)  # Read all sheets

# # MongoDB connection URI
# mongo_uri = 'mongodb://localhost:27017/'

# # Connect to MongoDB
# client = MongoClient(mongo_uri)

# # Select the database
# db = client['ecometer']
# db_categories=client['categories']

# # Iterate through each sheet and insert the data into separate collections
# for sheet_name, df in excel_data.items():
#     print(f"Processing sheet: {sheet_name}...")
    
#     # Convert the DataFrame to JSON
#     json_data = df.to_dict(orient='records')
#     sheet_name_coll=sheet_name.replace(" ","").replace('É', 'E').replace('é', 'e').lower()
#     print("[+] sheet " ,sheet_name_coll)
#     # Select the collection (using sheet name as collection name)
#     collection = db[sheet_name_coll]
    
#     # Insert the JSON data into the collection
#     collection.insert_many(json_data)
    
#     print(f"Inserted {len(json_data)} records into the {sheet_name} collection.")
    
 
#     for record in json_data:
#         try:
#             category_code = record.get('Code de la catégorie')
#             if category_code:
#                 categories= category_code.split(' > ')
#                 record["categories"]=categories
#                 # record["name"]=sheet_name
#                 db_categories[sheet_name_coll].insert_one(record)
#         except:
#             try:
#                 category_code = record.get('Catégorie')
#                 if category_code:
#                     categories= category_code.split('\\')
#                     record["categories"]=categories
#                     # record["name"]=sheet_name
#                     db_categories[sheet_name_coll].insert_one(record)
#             except:
#                 category_code = record.get("Groupe d'aliment")
#                 if category_code:
#                     categories= category_code
#                     record["categories"]=categories 
#                     db_categories[sheet_name_coll].insert_one(record)
                

    
    
# print("Data inserted successfully!")
import sys
import pandas as pd
from pymongo import MongoClient

def upload_excel_to_mongodb(excel_file_path, mongo_uri):
    # Read the Excel file
    excel_data = pd.read_excel(excel_file_path, sheet_name=None)  # Read all sheets

    # Connect to MongoDB
    client = MongoClient(mongo_uri)

    # Select the database
    db = client['ecometer']
    db_categories = client['categories']

    # Iterate through each sheet and insert the data into separate collections
    for sheet_name, df in excel_data.items():
        print(f"Processing sheet: {sheet_name}...")
        
        # Convert the DataFrame to JSON
        json_data = df.to_dict(orient='records')
        sheet_name_coll = sheet_name.replace(" ", "").replace('É', 'E').replace('é', 'e').lower()
        print(f"[+] sheet {sheet_name_coll}")
        # Select the collection (using sheet name as collection name)
        collection = db[sheet_name_coll]
        
        # Insert the JSON data into the collection
        collection.insert_many(json_data)
        
        print(f"Inserted {len(json_data)} records into the {sheet_name} collection.")
        print("json_data ",json_data[0:5])
        # for record in json_data:
        #     category_code = record.get('Code de la catégorie')
        #     if category_code:
        #         categories = category_code.split(' > ')
        #         record["categories"] = categories
        #         db_categories[sheet_name_coll].insert_one(record)
        for record in json_data:
            
            try:
                print("+")
                category_code = record.get('code de la categorie')
                if category_code:
                    categories= category_code.split(' > ')
                    record["categories"]=categories
                    # record["name"]=sheet_name
                    db_categories[sheet_name_coll].insert_one(record)
            except:
                print("*")
                try:
                    print("**")
                    category_code = record.get('categorie')
                    if category_code:
                        print("categories0 ",category_code)

                        categories= category_code.split('\\')
                        print("categories ",categories)
                        record["categories"]=categories
                        # record["name"]=sheet_name
                        db_categories[sheet_name_coll].insert_one(record)
                        print(".")
                except:
                    print("***")
                    category_code = record.get("groupe d'aliment")
                    if category_code:
                        print("categories1")
                        categories= category_code
                        record["categories"]=categories 
                        db_categories[sheet_name_coll].insert_one(record)
                         
                    


         
    print("Data inserted successfully!")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python upload_to_mongo.py <excel_file_path> <mongo_uri>")
    else:
        upload_excel_to_mongodb(sys.argv[1], sys.argv[2])
