import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db,auth } from "../../firebaseConfig";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { TouchableOpacity } from 'react-native';
import { navbtn, navbtnin, navbtnout, colors, btn2 } from '../globals/style';
import { AntDesign } from '@expo/vector-icons';
import BottomNav from "../components/BottomNav";
import { FlatList } from 'react-native-gesture-handler';


const UserCart = ({navigation}) => {

  const [cartdata, setCartdata] = useState(null);
  const [totalCost, setTotalCost] = useState('0');
  const [totalFoodPrice, setTotalFoodPrice] = useState(0);

  const getCartData = async (currentUser) => {
    if (!currentUser) {
      console.log('User not logged in');
      return;
    }

    try {
      const docRef = doc(db, 'UserCart', currentUser.uid);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setCartdata(docSnapshot.data()); // Lưu dữ liệu vào state
      } else {
        console.log('No such document');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getCartData(user); // Gọi hàm getCartData khi user đã đăng nhập
      } else {
        setCartdata(null);
      }
    });

    return () => unsubscribe(); // Dọn dẹp listener khi component unmount
  }, []);

  useEffect(() => {
    if (cartdata != null && cartdata.cart) {
      const food = cartdata.cart; // Truy cập trực tiếp `cartdata.cart`
      
      const totalfoodprice = food.reduce((acc, item) => {
        const foodPrice = parseInt(item.data.foodPrice) || 0;
        const addonPrice = parseInt(item.data.foodAddonPrice) || 0;
        const foodQuantity = parseInt(item.Foodquantity) || 0;
        const addonQuantity = parseInt(item.Addonquantity) || 0;
  
        return acc + (foodPrice * foodQuantity) + (addonPrice * addonQuantity);
      }, 0);
  
      setTotalFoodPrice(totalfoodprice); // Cập nhật tổng giá
    }
  }, [cartdata]);

  useEffect(() => {
    setTotalCost(totalFoodPrice.toString());
  }, [totalFoodPrice]);

  const deleteItem = async (item) => {
    try {
      // Lấy thông tin người dùng hiện tại
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('User not logged in');
        return;
      }
  
      // Tham chiếu đến tài liệu của người dùng trong Firestore
      const docRef = doc(db, 'UserCart', currentUser.uid);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        // Lấy dữ liệu hiện tại từ Firestore
        const currentData = docSnapshot.data();
        const updatedCart = currentData.cart.filter(
          (cartItem) => cartItem.data.foodName !== item.data.foodName
        );
  
        // Cập nhật dữ liệu mới
        await setDoc(docRef, { cart: updatedCart });
        setCartdata({ ...currentData, cart: updatedCart }); // Cập nhật giao diện
  
        console.log('Item deleted successfully');
      } else {
        console.log('No such document to delete item');
      }
    } catch (error) {
      console.log('Error deleting item:', error.message);
    }
  };

  return (
    <View style={styles.containerout}>
        <TouchableOpacity onPress={() => navigation.navigate('home')}
        style={navbtnout}
        >
        <View style={navbtn}>
            <AntDesign name='back' sizee={24} color='black' style={navbtnin}/>
        </View>
      </TouchableOpacity>
      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation}/>
      </View>
      <View style={styles.container}>
        <Text style={styles.head1}>Your Cart</Text>
        {cartdata == null || cartdata.cart.length == 0 ? 
        <Text style={styles.head2}>Your Cart is Empty</Text>:
        <FlatList
        style={styles.cardlist}
        data={cartdata.cart}
        renderItem={({ item }) => {
            return (
                <View style={styles.cartcard}>
                    <Image source={{ uri: item.data.foodImageUrl }} style={styles.cartimg} />
                    <View style={styles.cartcardin}>
                        <View style={styles.c1}>
                            <Text style={styles.txt1}>
                                {item.Foodquantity} {item.data.foodName}
                            </Text>
                            <Text style={styles.txt2}>{item.data.foodPrice}$</Text>
                        </View>
                        <TouchableOpacity style={styles.c4} onPress={() => deleteItem(item)}>
                            <Text style={styles.txt1}>Delete</Text>
                            <AntDesign name="delete" size={24} color="black" style={styles.del} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
    />
    
        }

            <View style={styles.btncont}>
            <View style={styles.c3}>
                <Text style={styles.txt5}>Total</Text>
                <Text style={styles.txt6}>${totalCost}</Text>
            </View>
            <TouchableOpacity style={btn2}>
                <Text style={styles.btntxt} onPress={() => navigation.navigate('placeoder',{cartdata})}>Place Order</Text>
            </TouchableOpacity>
            </View>

      </View>
    </View>
  )
}

export default UserCart

const styles = StyleSheet.create({
    bottomnav:{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        zIndex: 20,
      },
      containerout:{
        flex: 1,
        backgroundColor: 'white',
        width: '100%'
      },
      container:{
        flex: 1,
        backgroundColor: 'white',
        width: '100%'
      },
      head1:{
        fontSize: 40,
        textAlign: 'center',
        color: 'green',
      },
      head2: {
        fontSize: 30, 
        textAlign: 'center', 
        fontWeight: '200', 
        marginVertical: 20, 
        elevation: 10, 
        backgroundColor: 'white', 
        width: '90%', 
        height: '50%',
        alignSelf: 'center', 
        paddingVertical: '25%', 
        borderRadius: 10, 
      },
      cardlist: {
        width: '100%', 
      },
      cartcard: {
        flexDirection: 'row', 
        backgroundColor: 'white', 
        marginVertical: 5, 
        borderRadius: 10, 
        width: '95%', 
        alignSelf: 'center', 
        elevation: 10, 
        alignItems: 'center', 
      },
      cartimg: {
        width: 150, 
        height: 100, 
        borderRadius: 10, 
      },
      cartcardin: {
        flexDirection: 'column',
        margin: 5, 
        width: '58%', 
        alignItems: 'center', 
        justifyContent: 'center', 
      },
      c1: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        backgroundColor: 'white', 
        padding: 5, 
      },
      txt1: {
        fontSize: 16,
        color: 'red',
        width: '60%',
        fontWeight: 'bold',
      },
      txt2: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      del: {
        color: colors.text1,
      },
      c4: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: 100,
        borderRadius: 10, 
        borderColor: colors.text1, 
        borderWidth: 1, 
        marginVertical: 10, 
        padding: 5, 
      },
      btncont:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        flexDirection: 'row',
        marginBottom: 80,
        borderTopColor: colors.text3,
        borderTopWidth: 0.2,
      },
      btntxt: {
        backgroundColor: 'green',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 20,
        borderRadius: 10,
        width: '90%',
        textAlign: 'center',
      },
      c3: {
        flexDirection: 'row',
        alignItems: 'center'
      },
      txt5: {
        fontSize: 20,
        color: colors.text3,
      },
      txt6: {
        fontSize: 25,
        color: colors.text3,
        marginHorizontal: 5,
        fontWeight: 'bold'
      }
})