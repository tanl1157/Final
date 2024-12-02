import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";

import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import HomeHeadNav from "../components/HomeHeadNav";
import { db, auth } from "../../firebaseConfig";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { navbtn, navbtnin, navbtnout, colors, btn2 } from "../globals/style";

const TrackOrder = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [totalCost, setTotalCost] = useState("0");
  const [userloggeduid, setUserloggeduid] = useState(null);
  const [userdata, setUserdata] = useState(null);

  const getOrders = () => {
    const userId = auth.currentUser?.uid;

    const ordersRef = query(
      collection(db, "UserOrders"),
      where("orderuserid", "==", userId)
    );

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getOrders();
    return () => unsubscribe();
  }, []);

  const convertDate = (date) => {
    if (!date || !date.seconds) {
      return "Invalid Date"; // Trả về giá trị mặc định nếu `date` không hợp lệ
    }
    let newDate = new Date(date.seconds * 1000);
    return newDate.toDateString();
  };

  const cancelOrder = async (orderitem) => {
    try {
      // Tham chiếu đến tài liệu đơn hàng trong Firestore
      const orderRef = doc(db, "UserOrders", orderitem.orderId);

      // Cập nhật trạng thái đơn hàng thành 'cancelled'
      await updateDoc(orderRef, {
        orderstatus: "cancelled",
      });

      // Cập nhật lại danh sách đơn hàng
      getOrders();

      // Hiển thị thông báo thành công
      alert("Order has been successfully cancelled.");
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo
      console.error("Error cancelling order:", error.message);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <HomeHeadNav navigation={navigation} />

      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation} />
      </View>

      <FlatList
        style={styles.containerin}
        data={orders.sort((a, b) => b.orderdate.seconds - a.orderdate.seconds)}
        keyExtractor={(order, index) => index.toString()}
        renderItem={({ item: order, index }) => (
          <View style={styles.ordercard} key={index}>
            <Text style={styles.orderindex}>{index + 1}</Text>
            <Text style={styles.ordertxt2}>Order id: {order.orderId}</Text>
            <Text style={styles.ordertxt2}>
              Order date: {convertDate(order.orderdate)}
            </Text>
            {order.orderstatus == "ontheway" && (
              <Text style={styles.orderotw}>Your order is on the way</Text>
            )}
            {order.orderstatus == "delivered" && (
              <Text style={styles.orderotw}>Your order is delivered</Text>
            )}
            {order.orderstatus == "cancelled" && (
              <Text style={styles.orderotw}>Your order is cancelled</Text>
            )}
            {order.orderstatus == "pending" && (
              <Text style={styles.orderotw}>Your order is pending</Text>
            )}
            <View style={styles.row1}>
              <Text style={styles.ordertxt1}>
                Delivery Agent name & contact
              </Text>
              {order.deliveryboy_name ? (
                <Text style={styles.ordertxt2}>
                  {order.deliveryboy_name} : {order.deliveryboy_contact}
                </Text>
              ) : (
                <Text style={styles.ordertxt2}>Not Assigned</Text>
              )}

              {order.deliveryboy_phone ? (
                <Text style={styles.ordertxt2}>{order.deliveryboy_phone}</Text>
              ) : null}
            </View>

            <FlatList
              nestedScrollEnabled
              style={styles.c1}
              data={order.orderdata}
              renderItem={({ item }) => (
                <View style={styles.rowout}>
                  <View style={styles.row}>
                    <Text style={styles.qty}>{item.Foodquantity}</Text>
                    <Text style={styles.title}>{item.data.foodName}</Text>
                    <View style={styles.spacer}></View>
                    <Text style={styles.price3}>Food price: $</Text>
                    <Text style={styles.price1}>{item.data.foodPrice}</Text>
                    <Text style={styles.addon}>Price: $</Text>
                    <Text style={styles.totalprice}>
                      {parseInt(item.Foodquantity) *
                        parseInt(item.data.foodPrice)}
                    </Text>
                  </View>
                </View>
              )}
              ListFooterComponent={<></>}
            />

            <Text style={styles.total}>Total: ${order.ordercost}</Text>

            {order.orderstatus === "delivered" ? (
              <Text style={styles.ordertxt3}>
                Thanks you for ordering with us
              </Text>
            ) : null}
            {order.orderstatus === "cancelled" ? (
              <Text style={styles.ordertxt3}>Sorry for the inconvenience</Text>
            ) : null}
            {order.orderstatus !== "cancelled" &&
            order.orderstatus !== "delivered" ? (
              <TouchableOpacity
                style={styles.cancelbtn}
                onPress={() => cancelOrder(order)}
              >
                <Text style={styles.cancelbtnin}>Cancel Order</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

export default TrackOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    width: "100%",
    height: "100%",
  },
  bottomnav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    zIndex: 20,
    borderTopWidth: 1,
    borderTopColor: "#dcdcdc",
  },
  containerin: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    flex: 1,
    marginBottom: 100,
  },
  head1: {
    fontSize: 26,
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
  },
  ordercard: {
    backgroundColor: "#ffffff",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  rowout: {
    flexDirection: "column",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  qty: {
    fontSize: 18,
    color: "#FF6347",
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ffe4e1",
    borderRadius: 5,
  },
  title: {
    fontSize: 17,
    color: "#333",
    flexShrink: 1,
    marginHorizontal: 10,
  },
  price1: {
    fontSize: 17,
    color: "#FF6347",
    fontWeight: "bold",
  },
  totalprice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E8B57",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "right",
    marginVertical: 10,
  },
  ordertxt1: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "600",
  },
  ordertxt2: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 5,
  },
  cancelbtn: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  cancelbtnin: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  orderotw: {
    fontSize: 18,
    backgroundColor: "orange",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  orderdelivered: {
    fontSize: 18,
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  ordercancelled: {
    fontSize: 18,
    backgroundColor: "red",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  orderpending: {
    fontSize: 18,
    backgroundColor: "yellow",
    color: "grey",
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  orderindex: {
    fontSize: 20,
    color: "white",
    backgroundColor: colors.text1,
    textAlign: "center",
    borderRadius: 30,
    padding: 5,
    width: 30,
    position: "absolute",
    top: 10,
    left: 10,
  },
  ordertxt3: {
    fontSize: 17,
    color: colors.text3,
    textAlign: "center",
    borderColor: colors.text1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
});
