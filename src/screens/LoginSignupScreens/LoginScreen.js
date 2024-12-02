import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { titles, colors, btnlogin, hr80 } from '../../globals/style'
import { AntDesign } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { db } from "../../../firebaseConfig";
import { auth } from '../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
 
const LoginScreen = ({navigation}) => {
  const [emailfocus, setEmailfocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);
  const [showpassword, setShowpassword] = useState(false);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [customError, setCustomError] = useState('')

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        // Điều hướng đến trang welcome
        navigation.navigate('welcomepage');
      })
      .catch((error) => {
        const errorMessage = error.message;
  
        // Hiển thị lỗi tùy thuộc vào loại lỗi
        if (errorMessage.includes('auth/invalid-email')) {
          setCustomError('Please enter a valid email address');
        } else if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/wrong-password')) {
          setCustomError('Incorrect email or password');
        } else {
          setCustomError('Login failed. Please try again.');
        }
  
        // Ẩn lỗi sau 5 giây
        
      });
  };

  return (
    <View style={styles.container}>
        <Text style={styles.head1}>Sign in</Text>

    {customError !== '' && <Text style={styles.errormsg}>{customError}</Text>}

        <View style= {styles.inputout}> 
            <AntDesign name="user" size={24} color={emailfocus === true ? colors.text1 : colors.text2} />
            <TextInput style={styles.input} placeholder="Email" onFocus={() => { setEmailfocus(true); setPasswordfocus(false); setShowpassword(false); setCustomError('') }}
                onChangeText={(text) => {setEmail(text)}}
                />
        </View>
        <View style= {styles.inputout}>
            <MaterialCommunityIcons name = "lock-outline" size={24} color={passwordfocus == true ? colors.text1 : colors.text2}/> 
            <TextInput style={styles.input} placeholder="Password" onFocus={() => { setEmailfocus(false); setPasswordfocus(true);setCustomError('') }}
              onChangeText={(text) => {setPassword(text)}}
              secureTextEntry={showpassword === false ? true : false} />
            <Octicons name={showpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowpassword(!showpassword)}/>
        </View>

        <TouchableOpacity style={btnlogin} onPress={()=> handleLogin()}>
          <Text style={{  color: 'white', fontSize:titles.btntxt, fontWeight: "bold" }}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.forgot}>Forgot Password?</Text>
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
        <Text > Don't have any account? <Text style={styles.signup} onPress={()=> navigation.navigate('signup')} >Sign up</Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginVertical: 10,
    fontSize: 25,
  },
  gf:{
    flexDirection: 'row',
  },
  gficon:{
    backgroundColor: 'white',
    width: 50,
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 20,
  },
  signup:{
    color: colors.text1,
    
  }
})

export default LoginScreen