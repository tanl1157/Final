import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { db } from "../../Firebase/FirebaseConfig";
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";

function Product() {
  const [foodItems, setFoodItems] = useState([]);

  // Fetch data from Firestore
  const fetchFoodData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "FoodData"));
      const foodData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodItems(foodData);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  // Delete a food item
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (confirm) {
      try {
        // Tìm tài liệu dựa trên trường 'id'
        const q = query(collection(db, "FoodData"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          alert("No document found with the specified id!");
          return;
        }
  
        const docSnapshot = querySnapshot.docs[0]; // Lấy tài liệu đầu tiên
        const docRef = doc(db, "FoodData", docSnapshot.id);
  
        // Xóa tài liệu
        await deleteDoc(docRef);
  
        // Cập nhật danh sách sau khi xóa
        setFoodItems(foodItems.filter((item) => item.id !== id));
  
        alert("Food item deleted successfully");
      } catch (error) {
        console.error("Error deleting food item:", error);
        alert("Failed to delete food item.");
      }
    }
  };

  useEffect(() => {
    fetchFoodData();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h2 className="text-lg font-bold">Food List</h2>
          <Link to="/product/add">
            <button className="bg-black text-white px-4 py-2 rounded">
              Add New
            </button>
          </Link>
        </div>

        {/* Food Table */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Food Data</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border">Image</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border">Description</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border">Price</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">
                      <img
                        src={item.foodImageUrl}
                        alt={item.foodName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2 border">{item.foodName}</td>
                    <td className="px-4 py-2 border">{item.foodDescription}</td>
                    <td className="px-4 py-2 border">${item.foodPrice}</td>
                    <td className="px-4 py-2 border">
                      <div className="flex space-x-2">
                      <Link
                          to={`/product/edit/${item.id}`}
                          state={{
                            item: {
                              id: item.id, // Đây là document ID từ Firestore
                              foodName: item.foodName,
                              foodDescription: item.foodDescription,
                              foodPrice: item.foodPrice,
                              foodImageUrl: item.foodImageUrl,
                            },
                          }} 
                        >
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
