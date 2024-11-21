import { View, Text, StyleSheet, StatusBar, TextInput } from 'react-native'
import React from 'react'
import HomeHeadNav from '../components/HomeHeadNav'
import OfferSlider from '../components/OfferSlider'
import { AntDesign } from '@expo/vector-icons'
import { colors } from '../globals/style'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar />
      <HomeHeadNav/>
      <View style={styles.searchbox}>
        <AntDesign name='search1' size={24} color='black' style={styles.searchicon}/>
        <TextInput style={styles.input} placeholder='search'/>
      </View>
      <OfferSlider />
      <Text>HomeScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    // marginTop: 50,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%'
  },
  searchbox:{
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    padding: 10,
    margin: 20,
    elevation: 10,
  },
  input: {
    marginLeft: 10,
    width: '90%',
    fontSize: 18,
  },
  searchicon:{
    color: '#27AE60',
  }
})

export default HomeScreen