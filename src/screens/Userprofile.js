import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { db } from "../../firebaseConfig";
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword, signOut, updateEmail, } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { collection, query, where,getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { navbtn, navbtnin, navbtnout, colors, btn2, btntxt } from '../globals/style';
import { useNavigation } from "@react-navigation/native";

const Userprofile = ({ navigation }) => {

    const [userloggeduid, setUserloggeduid] = useState(null)
    const [userdata, setUserdata] = useState(null)
    const [edit, setEdit] = useState(false)
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newAddress, setNewAddress] = useState("");
  
    const [Passwordedit, setPasswordedit] = useState(false);
    const [oldpassword, setOldpassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    

    useEffect(() => {
        const checklogin = () => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              setUserloggeduid(user.uid);
            } else {
              setUserloggeduid(null);

            }
          });
        };
        checklogin();
      }, []);

      useEffect(() => {
        const getUserData = async () => {
          if (userloggeduid) {
            try {
              const docRef = query(
                collection(db, 'UserData'),
                where('uid', '==', userloggeduid)
              );
              const querySnapshot = await getDocs(docRef);
    
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  console.log('User data:', data); // Debug dữ liệu người dùng
                  setUserdata(data); // Cập nhật toàn bộ dữ liệu vào userdata
                });
              } else {
                console.log('No user data found');
                navigation.navigate('login'); // Điều hướng nếu không tìm thấy dữ liệu
              }
            } catch (error) {
              console.error('Error fetching user data:', error.message);
            }
          }
        };
    
        getUserData();
      }, [userloggeduid, navigation]);



const updateUserInFirestoreAndAuth = async ({
  uid,
  newName,
  newPassword,
  newPhone,
  newAddress,
}) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No user is logged in.");
    }

    if (currentUser.uid !== uid) {
      throw new Error("Unauthorized: UID does not match the logged-in user.");
    }

    // Firestore: Tìm và cập nhật dữ liệu
    const userRef = collection(db, "UserData");
    const q = query(userRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching Firestore document found for this UID.");
      return;
    }

    const updatedData = {
      ...(newName && { name: newName }),
      ...(newPhone && { phone: newPhone }),
      ...(newAddress && { address: newAddress }),
    };

    if (Object.keys(updatedData).length > 0) {
      // Cập nhật tất cả document trùng với UID
      const updatePromises = querySnapshot.docs.map((docSnap) => 
        updateDoc(docSnap.ref, updatedData)
      );

      await Promise.all(updatePromises);
      console.log("Firestore updated successfully!");
    }

    // Authentication: Cập nhật mật khẩu
    if (newPassword) {
      await updatePassword(currentUser, newPassword);
      console.log("Password updated successfully in Authentication.");
    }

    alert("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error.message);
    alert(`Failed to update user: ${error.message}`);
  }
};

      

    const logoutuser = async () => {
      try {
        // Đăng xuất người dùng
        await signOut(auth);

        // Chuyển hướng về màn hình "welcomepage"
        navigation.replace("welcomepage"); // Sử dụng replace để không cho phép quay lại màn hình trước
      } catch (error) {
        // Xử lý lỗi và hiển thị thông báo
        console.error("Error logging out:", error.message);
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

      {edit == false && Passwordedit == false && <View style={styles.container}>
        <Text style={styles.head1}>Your profile</Text>
        <View style={styles.containerin}>
            <Text style={styles.head2}>Name:
                 {userdata ? 
                 <Text style={styles.head2in}>{userdata.name}</Text> : 'loading'}
            </Text>
            <Text style={styles.head2}>Email:
                 {userdata ? 
                 <Text style={styles.head2in}>{userdata.email}</Text> : 'loading'}
            </Text>
  
            <Text style={styles.head2}>Phone:
                 {userdata ? 
                 <Text style={styles.head2in}>{userdata.phone}</Text> : 'loading'}
            </Text>
            <Text style={styles.head2}>Address:
                 {userdata ? 
                 <Text style={styles.head2in}>{userdata.address}</Text> : 'loading'}
            </Text>
        </View>

        <TouchableOpacity onPress={() => {
          setEdit(!edit)
        }}>
          <View style={btn2}>
            <Text style={styles.btntxt}>Edit Details</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => logoutuser()}>
          <View style={btn2}>
            <Text style={styles.btntxt}>Logout</Text>
          </View>
        </TouchableOpacity>

      </View>
      
      }


      {edit === true && (
          <View style={styles.containeredit}>
            <Text style={styles.head1}>Edit Profile</Text>
            <TextInput
  style={styles.input}
  placeholder="New Name"
  onChangeText={(text) => setNewName(text)}
/>
<TextInput
  style={styles.input}
  placeholder="New Password"
  secureTextEntry
  onChangeText={(text) => setNewPassword(text)}
/>
<TextInput
  style={styles.input}
  placeholder="New Phone"
  onChangeText={(text) => setNewPhone(text)}
/>
<TextInput
  style={styles.input}
  placeholder="New Address"
  onChangeText={(text) => setNewAddress(text)}
/>
<TouchableOpacity
  onPress={() =>
    updateUserInFirestoreAndAuth({
      uid: userloggeduid,
      newName,
      newEmail,
      newPassword,
      newPhone,
      newAddress,
    })
  }
>
  <Text>Update</Text>
</TouchableOpacity>
          </View>
        )}
        {/* {Passwordedit === true && (
          <View style={styles.container}>
            <Text style={styles.head1}>Change your Password</Text>
            <View style={styles.containerin}>
              <TextInput
                style={styles.input}
                placeholder="Old Password"
                onChangeText={(e) => setOldpassword(e)}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                onChangeText={(e) => setNewPassword(e)}
              />
            </View>
            <TouchableOpacity onPress={() => updatepassword()}>
              <View style={btn2}>
                <Text style={styles.btntxt}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        )} */}
    </View>
  )
}

export default Userprofile

const styles = StyleSheet.create({
    containerout:{
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
        width: '100%'
    },
    head1: {
        fontSize: 40,
        fontWeight: '200',
        marginVertical: 20,
        color: colors.text1,
    },
    containerin: {
        width: '90%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.text1,
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
    },
    head2: {
        fontSize: 20,
        fontWeight: '200',
        marginTop: 20,
    },
    head2in: {
        fontSize: 20,
        fontWeight: '300'
    },
    input: {
      width: '100%',
      marginVertical: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      elevation: 20,
    },
    btntxt: {
      fontSize: 20,
      fontWeight: '400',
      color: 'white',
      textAlign: 'center',
      padding: 10,
    },
    inputout: {
      flexDirection: 'row',
      width: '100%',
      marginVertical: 10,
      backgroundColor: colors.col1,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      // alignSelf: 'center',
      elevation: 20,
    },
    containeredit: {
      flex: 1,
      backgroundColor: "#f9f9f9", 
      padding: 20, 
      justifyContent: "center", 
      alignItems: "center", 
      borderRadius: 10,
      elevation: 5, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
})