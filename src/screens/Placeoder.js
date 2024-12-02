import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";

const PlaceOrder = ({ navigation, route }) => {
  const { cartdata } = route.params;
  const [orderdata, setOrderdata] = useState([]);
  const [totalCost, setTotalCost] = useState("0");
  const [userloggeduid, setUserloggeduid] = useState(null);
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    setOrderdata(cartdata);
  }, [cartdata]);

  useEffect(() => {
    if (cartdata?.cart) {
      const food = cartdata.cart;
      const totalfoodprice = food.reduce((acc, item) => {
        const foodPrice = parseInt(item.data.foodPrice) || 0;
        const addonPrice = parseInt(item.data.foodAddonPrice) || 0;
        const foodQuantity = parseInt(item.Foodquantity) || 0;
        return acc + (foodPrice + addonPrice) * foodQuantity;
      }, 0);
      setTotalCost(totalfoodprice.toString());
    }
  }, [cartdata]);

  useEffect(() => {
    const checkLogin = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserloggeduid(user.uid);
        } else {
          setUserloggeduid(null);
        }
      });
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (userloggeduid) {
        try {
          const docRef = query(collection(db, "UserData"), where("uid", "==", userloggeduid));
          const querySnapshot = await getDocs(docRef);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              setUserdata(data);
            });
          } else {
            navigation.navigate("login");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    getUserData();
  }, [userloggeduid, navigation]);

  const placeNow = async () => {
    try {
      const docRef = doc(collection(db, "UserOrders"), new Date().getTime().toString());

      await setDoc(docRef, {
        orderId: docRef.id,
        orderdata: orderdata.cart,
        orderstatus: "pending",
        ordercost: totalCost,
        orderaddress: userdata?.address,
        orderphone: userdata?.phone,
        ordername: userdata?.name,
        orderuserid: userloggeduid,
        orderpayment: "online",
        paymentstatus: "paid",
        orderdate: serverTimestamp(),
      });

      alert("Order placed successfully!");
      navigation.navigate("home");
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("cart")} style={styles.navbtn}>
        <View>
          <AntDesign name="back" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <FlatList
        data={orderdata.cart}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={
          <>
            <Text style={styles.head1}>Your Order Summary</Text>
          </>
        }
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
                {parseInt(item.Foodquantity) * parseInt(item.data.foodPrice)}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={styles.summaryContainer}>
              <Text style={styles.title}>Order Total: </Text>
              <Text style={styles.totalprice}>${totalCost}</Text>
            </View>
            <View style={styles.userdataout}>
              <Text style={styles.head2}>Your Details</Text>
              <View style={styles.row}>
                <Text style={styles.title}>Name:</Text>
                <Text style={styles.title}>{userdata?.name || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.title}>Email:</Text>
                <Text style={styles.title}>{userdata?.email || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.title}>Phone:</Text>
                <Text style={styles.title}>{userdata?.phone || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.title}>Address:</Text>
                <Text style={styles.title}>{userdata?.address || "N/A"}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.btn1} onPress={placeNow}>
              <Text style={styles.btntext}>Proceed to Payment</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  addon: {
    fontSize: 15,
    fontWeight: "bold",
    color: "green", 
    marginHorizontal: 1, 
  },
  price3: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red", 
    marginHorizontal: -20, 
  },
  qty2: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red", 
    marginHorizontal: 0, 
  },
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: "#f9f9f9",
    },
    navbtn: {
      marginBottom: 15,
      alignSelf: "flex-start",
      backgroundColor: "#fff",
      borderRadius: 50,
      padding: 10,
      elevation: 3,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
    head1: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#2E8B57",
      marginVertical: 15,
      textAlign: "center",
    },
    head2: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#2E8B57",
      marginVertical: 15,
      textAlign: "center",
    },
    rowout: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: "#fff",
      marginVertical: 8,
      borderRadius: 10,
      elevation: 2,
      alignItems: "center",
    },
    qty: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FF6347",
      marginRight: 10,
      paddingHorizontal: 8,
      paddingVertical: 5,
      backgroundColor: "#FFE4E1",
      borderRadius: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      flexShrink: 1,
      marginRight: 20,
    },
    price1: {
      fontSize: 16,
      color: "#FF6347",
      fontWeight: "600",
      marginHorizontal: 20,
    },
    totalprice: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2E8B57",
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: "#fff",
      marginVertical: 10,
      borderRadius: 10,
      elevation: 2,
    },
    btn1: {
      marginTop: 30,
      padding: 15,
      backgroundColor: "#2E8B57",
      borderRadius: 10,
      alignItems: "center",
      elevation: 3,
    },
    btntext: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    userdataout: {
      paddingVertical: 20,
      marginVertical: 15,
      backgroundColor: "#fff",
      borderRadius: 10,
      elevation: 2,
      paddingHorizontal: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 8,
    },
    spacer: {
      flexGrow: 1, // Dùng Spacer để điều chỉnh linh hoạt khoảng cách
    },
  
});
