import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { Link, useParams } from 'react-router-dom';

import { db, storage } from '../../Firebase/FirebaseConfig'
import {addDoc, collection} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

const AddProduct = () => {
    const [foodName, setFoodName] = useState('')
    const [foodDescription, setFoodDescription] = useState('')
    const [foodPrice, setFoodPrice] = useState('')
    const [foodImage, setFoodImage] = useState(null)
    const [foodImageUrl, setFoodImageUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

    if(foodImage == null){
        alert('Please select an image')
        return
    }
    else{
        const imageRef = ref(storage, `FoodImages/${foodImage.name}`);
        uploadBytes(imageRef, foodImage)
        .then(()=>{
            alert('Image uploaded successfully')
            getDownloadURL(imageRef)
                .then((url)=>{
                    // setFoodImageUrl(url)
                const foodData = {
                foodName,
                foodDescription,
                foodPrice,
                foodImageUrl: url,
                id: new Date().getTime().toString()
                }
                    // console.log(foodData)
                    try{
                        const docRef = addDoc(collection(db, "FoodData"), foodData);
                        alert("Data added successfully", docRef.id);
                    }
                    catch (error){
                        alert("Error adding document: ", error);
                    }
                })
        })
        .catch((error)=>{
            alert(error.message)
        })
    }

    }
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h2 className="text-lg font-bold">Product</h2>
        </div>
        <Link to="/product" className="inline-block mb-6 text-blue-500 hover:underline">
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Go back
          </button>
        </Link>
        {/* add product */}
        <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Add Food Data
          </h1>
          <form className="space-y-4">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Food Name
              </label>
              <input
                type="text"
                name="food_name"
                placeholder="Enter food name"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>{setFoodName(e.target.value)}}
              />
            </div>

            {/* Food Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Food Description
              </label>
              <textarea
                name="food_description"
                placeholder="Enter food description"
                rows="3"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>{setFoodDescription(e.target.value)}}
              ></textarea>
            </div>

            {/* Food Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Food Price
              </label>
              <input
                type="number"
                name="food_price"
                placeholder="Enter food price"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>{setFoodPrice(e.target.value)}}
              />
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Food Image
              </label>
              <input
                type="file"
                name="food_image"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                onChange={(e) =>{setFoodImage(e.target.files[0])}}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleSubmit}
            >
              Add Food
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
