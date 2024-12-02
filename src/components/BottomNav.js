import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback } from 'react-native';
import React, { useRef } from 'react';
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';

const BottomNav = ({ navigation }) => {
  // Tạo Animated.Value cho từng biểu tượng
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleCart = useRef(new Animated.Value(1)).current;
  const scaleMap = useRef(new Animated.Value(1)).current;

  // Hàm hoạt ảnh khi nhấn
  const handlePressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };

  // Hàm hoạt ảnh khi nhả
  const handlePressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Icon Home */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(scaleHome)}
        onPressOut={() => handlePressOut(scaleHome)}
        onPress={() => navigation.navigate('home')}
      >
        <Animated.View style={[styles.btncon1, { transform: [{ scale: scaleHome }] }]}>
          <AntDesign name="home" size={24} style={styles.icon1} />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Icon Cart */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(scaleCart)}
        onPressOut={() => handlePressOut(scaleCart)}
        onPress={() => navigation.navigate('cart')}
      >
        <Animated.View style={[styles.btncon1, { transform: [{ scale: scaleCart }] }]}>
          <AntDesign name="shoppingcart" size={24} style={styles.icon1} />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Icon Map */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(scaleMap)}
        onPressOut={() => handlePressOut(scaleMap)}
        onPress={() => navigation.navigate('trackorders')}
      >
        <Animated.View style={[styles.btncon1, { transform: [{ scale: scaleMap }] }]}>
          <FontAwesome5 name="map-marked-alt" size={24} style={styles.icon1} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    elevation: 30,
    borderTopColor: 'green',
    borderTopWidth: 0.5,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  icon1: {
    color: 'green',
  },
  icon2: {
    color: 'white',
  },
  btncon2: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -15,
    backgroundColor: 'green',
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  btncon1: {
    backgroundColor: 'white',
    elevation: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
