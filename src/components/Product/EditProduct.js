import React, { useState } from "react";
import Sidebar from "../Sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../../Firebase/FirebaseConfig";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import {addDoc,} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { state } = useLocation(); // Nhận dữ liệu từ state
  const navigate = useNavigate();
  
  // Lấy dữ liệu sản phẩm từ state
  const { id, foodName: initialName, foodDescription: initialDescription, foodPrice: initialPrice, foodImageUrl: initialImageUrl } = state.item;

  const [foodName, setFoodName] = useState(initialName);
  const [foodDescription, setFoodDescription] = useState(initialDescription);
  const [foodPrice, setFoodPrice] = useState(initialPrice);
  const [foodImage, setFoodImage] = useState(null);
  const [foodImageUrl, setFoodImageUrl] = useState(initialImageUrl);

  // Xử lý khi nhấn nút Submit

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Tìm tài liệu dựa trên giá trị trường 'id'
    const q = query(collection(db, "FoodData"), where("id", "==", id)); // id ở đây là trường bên trong tài liệu
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("No document found with the specified id!");
      return;
    }

    const docSnapshot = querySnapshot.docs[0]; // Lấy tài liệu đầu tiên
    const docRef = doc(db, "FoodData", docSnapshot.id);

    const imageRef = ref(storage, `FoodImages/${foodImage.name}`);
    await uploadBytes(imageRef, foodImage);
    const url = await getDownloadURL(imageRef);

    await updateDoc(docRef, {
      foodName,
      foodDescription,
      foodPrice,
      foodImageUrl: url,
    });

    alert("Data updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Error updating product: " + error.message);
  }
};

  
  
  
  
  return (

    
    <div className="flex h-screen">
        <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h2 className="text-lg font-bold">Edit Product</h2>
        </div>
        <Link to="/product" className="inline-block mb-6 text-blue-500 hover:underline">
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Go back
          </button>
        </Link>
        {/* Form chỉnh sửa */}
        <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Edit Food Data</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Food Name</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Food Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Food Description</label>
              <textarea
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                rows="3"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
            </div>

            {/* Food Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Food Price</label>
              <input
                type="number"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Food Image</label>
              <input
                type="file"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                onChange={(e) => setFoodImage(e.target.files[0])}
              />
              <img
                src={foodImageUrl}
                alt="Food"
                className="w-full h-40 object-cover rounded-md mt-4"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
