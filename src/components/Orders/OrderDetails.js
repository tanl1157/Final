import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from "../Sidebar";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/FirebaseConfig';

const OrderDetails = ({ order }) => {
  const { orderid } = useParams(); // Lấy giá trị orderid từ URL
  const [orderdata, setOrderData] = useState({}); // Giá trị khởi tạo là object rỗng
  const defaultOrder = order || { orderdata: [], ordercost: 0 };
  

  const getOrderData = async () => {
    const docRef = doc(db, 'UserOrders', orderid); // Tham chiếu đến document trong Firestore
    const docSnap = await getDoc(docRef); // Lấy dữ liệu document từ Firestore

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      setOrderData(docSnap.data());
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        await getOrderData();
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrderData();
  }, []);

  

  return (
    <div className="flex h-screen bg-gray-100"> 
      <Sidebar />
      <div className="flex flex-col flex-1 p-6">
        {/* Back button */}
        <Link to="/order" className="inline-block mb-6 text-blue-500 hover:underline">
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Go back
          </button>
        </Link>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Order Details</h1>

        {/* Order Details */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p className="font-medium text-gray-600">Customer Name:</p>
            <p className="text-gray-800">{orderdata?.ordername || "Loading..."}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p className="font-medium text-gray-600">Order Address:</p>
            <p className="text-gray-800">{orderdata?.orderaddress || "Loading..."}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p className="font-medium text-gray-600">Customer Phone:</p>
            <p className="text-gray-800">{orderdata?.orderphone || "Loading..."}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p className="font-medium text-gray-600">Customer Status:</p>
            <p className="text-gray-800">{orderdata?.orderstatus || "Loading..."}</p>
          </div>
          
        </div>

        {/* OrderUser */}
        <br />
        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
  <h2 className="text-lg font-semibold mb-4">Order Items</h2>

  {orderdata?.orderdata && orderdata.orderdata.length > 0 ? (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 text-left font-medium text-gray-600 border">
            Quantity
          </th>
          <th className="px-4 py-2 text-left font-medium text-gray-600 border">
            Food Name
          </th>
          <th className="px-4 py-2 text-left font-medium text-gray-600 border">
            Food Price
          </th>
          <th className="px-4 py-2 text-left font-medium text-gray-600 border">
            Total Price
          </th>
        </tr>
      </thead>
      <tbody>
        {orderdata.orderdata.map((item, index) => (
          <tr key={index} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2 border">{item.Foodquantity}</td>
            <td className="px-4 py-2 border">{item.data.foodName}</td>
            <td className="px-4 py-2 border">${item.data.foodPrice}</td>
            <td className="px-4 py-2 border">
              ${parseInt(item.Foodquantity) * parseInt(item.data.foodPrice)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-gray-600 text-center">No items in the order.</p>
  )}

  {/* Tổng giá trị đơn hàng */}
  <div className="mt-6 text-right">
    <h3 className="text-lg font-semibold">
      Total: ${orderdata?.ordercost || 0}
    </h3>
  </div>
</div>

      </div>
    </div>
  );
};

export default OrderDetails;
