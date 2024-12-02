import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { titles, colors, btnlogin, hr80 } from '../../globals/style'
import { AntDesign } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import bcrypt from 'react-native-bcrypt';

import { db,auth } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

 
const SignupScreen = ({navigation}) => {
  const [emailfocus, setEmailfocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);
  const [phonefocus, setPhonefocus] = useState(false);
  const [namefocus, setNamefocus] = useState(false);
  const [showpassword, setShowpassword] = useState(false);
  const [showcpassword, setShowcpassword] = useState(false);
  const [cpasswordfocus, setcPasswordfocus] = useState(false);

  //taking data
  const [name,setName] =useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword,setcPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, SetAddress] = useState('')

  const [customError, setCustomError] = useState('')
  const [successmsg, setSuccessmsg] = useState(null)


  const handleSignup = async () => {
    const FormData = {
      name: name,
      email: email,
    //   password: password,
      phone: phone,
      address: address,
    };
  
    // Kiểm tra dữ liệu nhập
    if (password !== cpassword) {
      setCustomError("Password doesn't match");

      
      return;
    } else if (phone.length !== 10) {
      setCustomError("Phone number should be 10 digits");

      
      return;
    }
  
    try {
    const hashedPassword = bcrypt.hashSync(password, 10);
      // Tạo tài khoản trên Firebase Auth
      // await createUserWithEmailAndPassword(auth, email, password);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Thêm thông tin người dùng vào Firestore
      const userRef = collection(db, "UserData");
      await addDoc(userRef, {
        ...FormData,
        uid: user.uid,
        password: hashedPassword, // Lưu mật khẩu băm
      });
  
      // Hiển thị thông báo thành công
      setSuccessmsg('User created successfully');

      setTimeout(() => {
        setSuccessmsg("");
      }, 5000);
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setCustomError("Email already exists. Please use a different email.");
        } else {
          setCustomError(error.message);
        }
        setTimeout(() => {
            setCustomError("");
          }, 5000);
      }
  };
  return (
    <View style={styles.container}>
        <Text style={styles.head1}>Sign up</Text>

        <View style= {styles.inputout}> 
            <AntDesign name="user" size={24} color={namefocus === true ? colors.text1 : colors.text2} />
            <TextInput style={styles.input} placeholder="Full Name" onFocus={() => { 

              setEmailfocus(false); 
              setPasswordfocus(false); 
              setShowpassword(false); 
              setNamefocus(true);
              setPhonefocus(false);
              setcPasswordfocus(false);

              }}
              onChangeText={(text) => setName(text)}
              />
        </View>

        <View style= {styles.inputout}> 
            <Entypo name="email" size={24} color={emailfocus === true ? colors.text1 : colors.text2} />
            <TextInput style={styles.input} placeholder="Email" onFocus={() => { 

              setEmailfocus(true); 
              setPasswordfocus(false); 
              setShowpassword(false); 
              setNamefocus(false);
              setPhonefocus(false);
              setcPasswordfocus(false);

              }}
              onChangeText={(text) => setEmail(text)}
              />
        </View>

        <View style= {styles.inputout}> 
            <Feather name="smartphone" size={24} color={phonefocus === true ? colors.text1 : colors.text2} />
            <TextInput style={styles.input} placeholder="Phone number" onFocus={() => { 

              setEmailfocus(false); 
              setPasswordfocus(false); 
              setShowpassword(false); 
              setNamefocus(false);
              setPhonefocus(true);
              setcPasswordfocus(false);
              
              }}
              onChangeText={(text) => setPhone(text)}
              />
        </View>
        
{/* Password start */}
        <View style= {styles.inputout}>
            <MaterialCommunityIcons name = "lock-outline" size={24} color={passwordfocus == true ? colors.text1 : colors.text2}/> 
            <TextInput style={styles.input} placeholder="Password" onFocus={() => { 

              setEmailfocus(false); 
              setPasswordfocus(true); 
              setShowpassword(false); 
              setNamefocus(false);
              setPhonefocus(false);
              setcPasswordfocus(false);
            
            }}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={showpassword === false ? true : false} />
            <Octicons name={showpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowpassword(!showpassword)}/>
        </View>

        <View style= {styles.inputout}>
            <MaterialCommunityIcons name = "lock-outline" size={24} color={cpasswordfocus == true ? colors.text1 : colors.text2}/> 
            <TextInput style={styles.input} placeholder="Confirm Password" onFocus={() => { 
              
              setEmailfocus(false); 
              setPasswordfocus(false); 
              setShowpassword(false); 
              setNamefocus(false);
              setPhonefocus(false);
              setcPasswordfocus(true);

            }}
            onChangeText={(text) => setcPassword(text)}
              secureTextEntry={showcpassword === false ? true : false} />
            <Octicons name={showcpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowcpassword(!showcpassword)}/>
        </View>
{/* Password end */}

        <Text style={styles.address}>Please enter your address</Text>
        <View style={styles.inputout}>
            <TextInput style={styles.input1} placeholder="Enter your Address" onChangeText={(text) => SetAddress(text)}/>
        </View>

        {/* Error email */}
        {customError && (
        <Text style={{ color: "red", fontSize: 14, marginVertical: 10 }}>
            {customError}
        </Text>
        )}
        {/* correct email */}
        {successmsg && (
        <Text style={{ color: "green", fontSize: 14, marginVertical: 10 }}>
            {successmsg}
        </Text>
        )}

        <TouchableOpacity style={btnlogin} onPress={() => handleSignup()}>
          <Text style={{  color: 'white', fontSize:titles.btntxt, fontWeight: "bold" }}>Sign up</Text>
        </TouchableOpacity>


        {/* <Text style={styles.forgot}>Forgot Password?</Text> */}
        <Text style={styles.or}>OR</Text>
        <Text style={styles.gftxt}>Sign In With </Text>

        <View style={styles.gf}>
          <TouchableOpacity>
            <View style={styles.gficon}>
              <AntDesign name="google" size={24} color="#EA4335" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.gficon}>
              <FontAwesome5 name="facebook-f" size={24} color="#4267B2" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={hr80}></View>
        <Text > Already have an account? <Text style={styles.signup} onPress={()=> navigation.navigate('login')} >Login</Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  head1: {
    fontSize: titles.title1,
    color: '#27AE60',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputout:{
    flexDirection: 'row',
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#abebc6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: 'center',
    elevation: 20,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
  },
  forgot: {
    color: colors.text2,
    marginTop: 20,
    marginBottom: 10,
  },
  or: {
    color: colors.text1,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  gftxt:{
    color: colors.text2,
    marginBottom: 10,
    fontSize: 25,
  },
  gf:{
    flexDirection: 'row',
  },
  gficon:{
    backgroundColor: 'white',
    width: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 20,
  },
  signup:{
    color: colors.text1,
    
  },
  address: {
    fontSize: 18,
    color: colors.text2,
    textAlign: 'center',
    marginTop: 20,
  }
})

export default SignupScreen