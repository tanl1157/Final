import { useEffect, useState } from 'react'
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import logo from '../../../assets/logo.png';
import {colors, hr80 } from '../../globals/style'
import { db } from "../../../firebaseConfig";
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';

const WelcomeScreen = ({navigation}) => {
    const [userlogged, setUserlogged] = useState('')

    useEffect(() => {
        const checklogin = () => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              setUserlogged(user);
            } else {
              setUserlogged(null);
            }
          });
        };
        checklogin();
      }, []);

      const handleLogout = () => {
        signOut(auth)
          .then(() => {
            // Điều hướng đến màn hình đăng nhập nếu cần
            navigation.navigate('welcomepage');
          })
          .catch((error) => {
            console.error('Logout error:', error.message);
          });
      };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome to FruitShop</Text>
        <View   style={styles.logoout}>
            <Image source={logo} style={styles.logo} />
        </View>
        <View style={hr80}/>
        <Text style={styles.text}>Find the best food around you at lowest price.</Text>
        <View style={hr80}/>
        {userlogged == null ?
            <View style = {styles.btnout}>
            <TouchableOpacity onPress={()=> navigation.navigate('signup')}>
                <Text style={styles.btn}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('login')}>
                <Text style={styles.btn}>Log in</Text>
            </TouchableOpacity>
        </View>
        :
        <View style={styles.logged}>
            <Text style={styles.txtlog}>Signed in as <Text style={styles.txtlogin}>{userlogged.email}</Text></Text>
            <View style = {styles.btnout}>
            <TouchableOpacity onPress={()=> navigation.navigate('home')}>
                <Text style={styles.btn}>Go to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> handleLogout()}>
                <Text style={styles.btn}>Log out</Text>
            </TouchableOpacity>
        </View>
        </View>
        }

        
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#66FF33',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        color: colors.col1,
        textAlign: 'center',
        marginVertical: 10,
        frontWeight: '200',
    },
    logoout: {
        width: "80%",
        height: "30%",
        // backgroundColor: '#fff',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    text: {
        fontSize: 18,
        width: '80%',
        color:  colors.col1,
        textAlign:'center',
    },
    btnout:{
        flexDirection: 'row',
    },
    btn: {
        fontSize: 20,
        color: colors.text1,
        textAlign: 'center',
        marginVertical: 30,
        marginHorizontal: 10,
        fontWeight: '700',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
    },logged: {
        alignItems: 'center'
    },txtlog: {
        fontSize: 20,
        color: 'white',  
    },txtlogin:{
        fontSize: 19,
        color: 'white',
        fontWeight: '700',
    }

})

export default WelcomeScreen