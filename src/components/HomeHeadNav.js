import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'

import { colors } from '../globals/style'

const HomeHeadNav = () => {
  return (
    <View style={styles.container}>
      <Fontisto name='nav-icon-list-a' size={20} color='black' style={styles.myicon} />
      <View style={styles.containerin}> 
        <Text style={styles.mytext}>FruitShop</Text>
        <Fontisto name="shopping-store" size={24} color="black" style={styles.myicon}/>
      </View>
      <FontAwesome5 name='user-circle' size={26} color='black' style={styles.myicon}/>
    </View>
  )
}

export default HomeHeadNav

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerin:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  myicon:{
    color: '#27AE60',
  },
  mytext:{
    color: '#27AE60',
    fontSize: 24,
  }
})