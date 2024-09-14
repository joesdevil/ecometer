import sys
import pandas as pd
from pymongo import MongoClient

def upload_excel_to_mongodb(excel_file_path, mongo_uri):
    
    file_name= excel_file_path.split("\\")[-1].replace(".xlsx","")
    print("file_name ",file_name)
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
        
        
       
        # for record in json_data:
        #     category_code = record.get('Code de la catégorie')
        #     if category_code:
        #         categories = category_code.split(' > ')
        #         record["categories"] = categories
        #         db_categories[sheet_name_coll].insert_one(record)
        for record in json_data:
            
            try:
                
                category_code = record.get('Code de la catégorie')
                category_code1 = record.get('Catégorie')
                categorie_alim = record.get("Groupe d'aliment")
                if category_code:
                    
                    if category_code1 != "NoneType":
                        categories= category_code.split(' > ')
                        record["categories"]=categories
                        record["db_type"]=file_name
                        # record["name"]=sheet_name
                        db_categories[sheet_name_coll].insert_one(record)
               
                if category_code1:
                
                 
                    if category_code1 != "NoneType":
                        categories= category_code1.split('\\')
                        record["categories"]=categories
                        record["db_type"]=file_name
                        # record["name"]=sheet_name
                        db_categories[sheet_name_coll].insert_one(record)

                # if categorie_alim:
                
                #     if categorie_alim != None:
                        
                #         categories= categorie_alim.replace('É', 'E').replace('é', 'e').replace("œ","oe").replace("è","e").lower()
                        
                #         cat_arr=[]
                #         cat_arr.append(sheet_name)
                #         cat_arr.append(categories)
                #         cat_arr.append(record["Materiau d'emballage"])
                #         cat_arr.append(record["Preparation"])
                #         cat_arr.append(record["Livraison"])
                #         record["db_type"]=file_name
                #         record["categories"]=cat_arr
                #         db_categories[sheet_name_coll].insert_one(record)
            except:
                pass
        print(f"Inserted {len(json_data)} records into the {sheet_name} collection.")
                
        
                    


         
    print("Data inserted successfully!")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python upload_to_mongo.py <excel_file_path> <mongo_uri>")
    else:
        upload_excel_to_mongodb(sys.argv[1], sys.argv[2])
