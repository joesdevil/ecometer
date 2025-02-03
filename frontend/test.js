
import axios from "axios";

async function Test() {
  const data = ["Electricité"];
  //   const [matchingDocuments, setMatchingDocuments] = useState([]);
  const url = "http://localhost:3000/api/categories/nextCategories";
    const { data: res } = await axios.post(url, {
      userSelectedCategories: data,
    });
    console.log(res.nextCategories);
    
}

Test();
// {
//      "year": 2025,
//      "clientId":"662ab68cad78855301c901b5",
//      "selectedCategoryElements": [
//   [
//     { "quantity": 10, "categoryElement": "66101ed3aad307245468b1db" },
//     { "quantity": 5, "categoryElement": "66101ed3aad307245468b1d8" }
//   ],
//   [],
//   [{ "quantity": 3, "categoryElement": "66101ed3aad307245468b5e1" }],
//   [],
//   [{ "quantity": 8, "categoryElement": "66101ed4aad307245468c338" }],
//   [],
//   [{ "quantity": 15, "categoryElement": "66101ed3aad307245468b65a" }],
//   [],
//   [{ "quantity": 6, "categoryElement": "66101ed3aad307245468bd8e" }],
//   [],
//   [{ "quantity": 2, "categoryElement": "66101ed4aad307245468c0f7" }],
//   [{ "quantity": 7, "categoryElement": "66101ed4aad307245468c0ff" }],
//   [],
//   [],
//   [{ "quantity": 4, "categoryElement": "66101ed3aad307245468bce6" }],
//   [],
//   [{ "quantity": 12, "categoryElement": "66101ed3aad307245468b1b2" }],
//   [],
//   [],
//   [{ "quantity": 9, "categoryElement": "66101ed3aad307245468bce2" }],
//   [],
//   [{ "quantity": 1, "categoryElement": "66101ed3aad307245468b21d" }]
// ]

// }