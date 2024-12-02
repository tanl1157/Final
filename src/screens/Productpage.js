import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { navbtn, navbtnin, navbtnout, colors, btn2, hr80, incdecbtn, incdecout, incdecinput } from '../globals/style';
import { AntDesign } from '@expo/vector-icons';
import { db,auth } from "../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const Productpage = ({navigation, route}) => {

    const data = route.params
    if(route.params === undefined){
        navigation.navigate('home')
    }

    const [quantity, setQuantity] = useState('1');

    const addtocart = async () => {

        const currentUser = auth.currentUser; // Lấy thông tin người dùng hiện tại
    
        if (!currentUser) {
          alert('User is not logged in!');
          return;
        }
    
        // Tham chiếu tới tài liệu của người dùng trong Firestore
        const docRef = doc(db, 'UserCart', currentUser.uid);
    
        const data1 = {
          data,
          Foodquantity: quantity,
        };
    
        try {
          const docSnapshot = await getDoc(docRef);
    
          if (docSnapshot.exists()) {
            // Tài liệu tồn tại, cập nhật dữ liệu
            await updateDoc(docRef, {
              cart: arrayUnion(data1),
            });
            alert('Added to cart');
          } else {
            // Tạo tài liệu mới nếu chưa tồn tại
            await setDoc(docRef, {
              cart: [data1],
            });
            alert('Added to cart');
          }
        } catch (error) {
          console.error('Error adding to cart:', error.message);
          alert('Failed to add to cart');
        }
      };

      const increaseQuantity = () =>{
        setQuantity((parseInt(quantity) + 1).toString())
      }
      const decreaseQuantity = () =>{
        if(parseInt(quantity)>1){
            setQuantity((parseInt(quantity) - 1).toString())
        }
      }

  return (
    <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('home')}
        style={navbtnout}
        >
        <View style={navbtn}>
            <AntDesign name='back' sizee={24} color='black' style={navbtnin}/>
        </View>
      </TouchableOpacity>

      <View style={styles.container1}>
        <View style={styles.s1}>
            <Image source={{ uri: data.foodImageUrl }}  style={styles.cardimgin} />
        </View>

        <View style={styles.s2}>
            <View style={styles.s2in}>
                <Text style={styles.head1}>{data.foodName}</Text>
                <Text style={styles.head2}>{data.foodPrice}/kg</Text>
            </View>
            <View style={styles.s3}>
                <Text style={styles.head3}>About Food</Text>
                <Text style={styles.head4}>{data.foodDescription}</Text>
            </View>
        </View>


        <View style={styles.container3}>
            <View style={hr80}></View>
            <Text style={styles.txt5}>Food Quantity</Text>
            <View style={incdecout}>
                <Text style={incdecbtn} onPress={() => increaseQuantity()}>+</Text>
                <TextInput value={quantity} style={incdecinput}/>
                <Text style={incdecbtn} onPress={() => decreaseQuantity()}>-</Text>
            </View>
            <View style={hr80}></View>
        </View>

        <View style={styles.container4}>
            <View style={styles.c4in}>
                <Text style={styles.txt2}>Total Price</Text>
                {data.foodAddonPrice != '' ? <Text style={styles.txt6}>
                    ${((
                        parseInt(data.foodPrice) * parseInt(quantity)
                    )).toString()}
                </Text>:<Text style={styles.txt6}>
                    ${(
                        parseInt(data.foodPrice) * parseInt(quantity)
                    ).toString()}/kg
                    </Text>}
            </View>
            <View style={hr80}></View>
        </View>

        <View style={styles.btncont}>
            <TouchableOpacity style={btn2} onPress={() => addtocart()}>
                <Text style={styles.btntxt} >Add to Card</Text>
            </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  )
}

export default Productpage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        width: '100%'
    },
    container1: {
        flex: 1,
        backgroundColor: '#fff',
    },
    s1: {
        width: '100%',
        height: 300,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardimgin: {
        width: '100%',
        height: '100%',
    },
    s2: {
        width: '100%',
        padding: 20,
    },
    s2in: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    head1: {
        fontSize: 30,
        fontWeight: '500',
        color: 'green',
        width: 220,
        marginRight: 10,
    },
    head2:{
        fontSize: 50,
        fontWeight: '200',
        color: colors.text3
    },
    s3:{
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 20,
    },
    head3: {
        fontSize: 30,
        fontWeight: '200',
        color: 'white'
    },
    head4:{
        marginVertical: 10,
        fontSize: 20,
        fontWeight: '400',
        color: 'white',
    },
    btncont:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
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
    container3:{
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    txt2:{
        color: 'green',
        fontSize: 30,
        fontWeight: '200',
        marginVertical: 10,
    },
    txt3:{
        color: 'green',
        fontSize: 16,
        width: '30%',
        textAlign: 'center'
    },
    txt5:{
        color: 'green',
        fontSize: 16,
        // width: '30%',
        textAlign: 'center'
    },
    c3in:{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    text4: {
        color: colors.text3,
        fontSize: 20,
        marginHorizontal: 10,
    },
    container4:{
       width: '90%',
       alignSelf: 'center',
       alignItems: 'center', 
    },
     c4in:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    txt6:{
        color: 'green',
        fontSize: 25,
        textAlign: 'center'
    }
})