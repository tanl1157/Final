import React from 'react'
import { View, Text, StyleSheet, StatusBar, TextInput, FlatList, Image } from 'react-native'
import { colors, veg, nonveg } from '../globals/style'
import { TouchableOpacity } from 'react-native'

const Cardslider = ({ title, data, navigation }) => {

    const openProductpage = (item) =>{
        // console.log(item)
        navigation.navigate('productpage', item)
    }

  return (
    <View style={styles.container}>
        <Text style={styles.cardouthead}>
            {title}
        </Text>

        <FlatList 
            style={styles.cardsout}
            data={data}
            numColumns={2} // Lưới 2 cột
            keyExtractor={(item, index) => index.toString()} // Đảm bảo key duy nhất
            columnWrapperStyle={{ justifyContent: "space-between", marginHorizontal: 75 }} // Căn đều các ô
            renderItem={({ item })=> (
                <TouchableOpacity key={item.index} onPress={() => {
                    openProductpage(item)
                }}>
                    <View style={styles.card}>

                        <View style={styles.s1}>
                            <Image source={{ uri: item.foodImageUrl }} style={styles.cardimgin} />
                        </View>

                        <View style={styles.s2}>
                            <Text style={styles.txt1}>{item.foodName}</Text>
                            <View style={styles.s2in}>
                                <Text style={styles.txt2}>$.{item.foodPrice}/kg</Text>
                            </View>
                        </View>

                        <View style={styles.s3}>
                            <Text style={styles.buybtn}>
                                Buy
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    </View>
  )
}

export default Cardslider

const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
      flex: 1,
      width: '100%',
    },
    cardouthead: {
      color: '#333',
      width: '90%',
      fontSize: 24,
      fontWeight: 'bold',
      marginHorizontal: 10,
      marginBottom: 10,
    },
    cardsout: {
      width: '100%',
    },
    card: {
        backgroundColor: 'white',
        marginLeft: '-20%',
        width: '90%', // Đảm bảo vừa 2 cột
        marginBottom: 15, // Giảm khoảng cách giữa các hàng
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardimgin: {
      width: '100%',
      height: undefined,
      aspectRatio: 1, // Giữ tỷ lệ vuông
      borderRadius: 10,
      marginBottom: 10,
    },
    txt1: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
      textAlign: 'center',
    },
    txt2: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
      textAlign: 'center',
    },
    buybtn: {
      backgroundColor: 'red',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buybtntext: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  