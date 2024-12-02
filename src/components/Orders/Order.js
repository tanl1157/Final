import { useState, useEffect } from "react";
import "./Order.css";
import Sidebar from "../Sidebar";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [allorders, setAllOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách đơn hàng từ Firestore
  const getAllOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserOrders"));
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllOrders(orders);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // Hàm cập nhật thông tin đơn hàng
  const updateOrderInfo = async (id, updatedData) => {
    try {
      const docRef = doc(db, "UserOrders", id);
  
      // Cập nhật dữ liệu đơn hàng vào Firestore
      await setDoc(docRef, updatedData, { merge: true });
  
  
      // Làm mới danh sách đơn hàng
      await getAllOrders();
    } catch (error) {
      console.error("Error updating order: ", error);
      alert("Failed to update order.");
    }
  };
  
  


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navigation */}
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h2 className="text-lg font-bold">Order</h2>
        </div>

        {/* Main Section */}
        <div className="order-section">
          <h1 className="order-head1">Order Section</h1>

          {/* Hiển thị danh sách đơn hàng */}
          <div className="order_container">
            <div className="order-row_card1">
              <p className="ordertxt">OrderId</p>
              <p className="ordertxt">Paid</p>
              <p className="ordertxt">Delivery Status</p>
              <p className="ordertxt">Delivery Boy Name</p>
              <p className="ordertxt">Delivery Boy Phone</p>
              <p className="ordertxt">Cost</p>
              <p className="ordertxt">Show Details</p>
            </div>

            {allorders.length > 0 ? (
              allorders.map((order) => (
                <div className="order-row_card" key={order.id}>
                  <p className="ordertxt">
                    {order.orderid || order.id || "N/A"}
                  </p>
                  <p className="ordertxt">{order.orderpayment || "Unpaid"}</p>

                  <div className="order-card-in">
                    <select
                      className="ordertxt"
                      value={order.orderstatus}
                      onChange={(e) =>
                        updateOrderInfo(order.id, {
                          ...order,
                          orderstatus: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="ontheway">On the way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <input
                    className="ordertxt"
                    type="text"
                    placeholder="Delivery Boy Name"
                    defaultValue={order.deliveryboy_name || ""}
                    onBlur={(e) =>
                      updateOrderInfo(order.id, {
                        ...order,
                        deliveryboy_name: e.target.value.trim(),
                      })
                    }
                  />
                  <input
                    className="ordertxt"
                    type="text"
                    placeholder="Delivery Boy Phone"
                    defaultValue={order.deliveryboy_phone || ""}
                    onBlur={(e) =>
                      updateOrderInfo(order.id, {
                        ...order,
                        deliveryboy_phone: e.target.value.trim(),
                      })
                    }
                  />

                  <p className="ordertxt">${order.ordercost || 0}</p>
                  <button
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Show Details
                  </button>
                </div>
              ))
            ) : (
              <p>No orders found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
