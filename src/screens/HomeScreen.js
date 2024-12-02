import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeadNav from "../components/HomeHeadNav";
import OfferSlider from "../components/OfferSlider";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../globals/style";

import { db } from "../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Cardslider from "../components/Cardslider";
import BottomNav from "../components/BottomNav";
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState([]);
  const foodRef = collection(db, "FoodData");

  useEffect(() => {
    const unsubscribe = onSnapshot(foodRef, (snapshot) => {
      setFoodData(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  // console.log(foodData);

  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar />
      <HomeHeadNav navigation={navigation} />

      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation}/>
      </View>

      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.searchbox}>
          <AntDesign
            name="search1"
            size={24}
            color="black"
            style={styles.searchicon}
          />
          <TextInput
            style={styles.input}
            placeholder="search"
            onChangeText={(text) => {
              setSearch(text);
            }}
          />
        </View>
        {search !== "" && (
  <View style={styles.searchresultsouter}>
    <FlatList
      style={styles.searchresultsinner}
      data={foodData.filter((item) =>
        item.foodName.toLowerCase().includes(search.toLowerCase())
      )} 
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.searchresult}>
          <AntDesign name="arrowright" size={24} color="black" />
          <Text style={styles.searchresulttext}>{item.foodName}</Text>
        </View>
      )}
    />
  </View>
)}
        <OfferSlider />
        <Cardslider 
          title={"Wellcome to shopping"} 
          data={foodData} 
          navigation={navigation} 
          numColumns={2} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
  },
  searchbox: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    padding: 10,
    margin: 20,
    elevation: 10,
  },
  input: {
    marginLeft: 10,
    width: "90%",
    fontSize: 18,
  },
  searchicon: {
    color: "#27AE60",
  },
  // views: {
  //   flex: 1,
  //   padding: 10,
  // },
  // item: {
  //   marginBottom: 10,
  //   padding: 10,
  //   backgroundColor: "#f9f9f9",
  //   borderRadius: 5,
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  // },
  searchresultsouter: {
    width: '100%',
    marginHorizontal: 30,
    // height: '100%',
    backgroundColor: 'white',
  },
  searchresultsinner: {
    width: '100%',
  },
  searchresult: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  searchresulttext: {
    marginLeft: 10,
    fontSize: 18,
    color: 'green',
  },
  bottomnav:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
});

export default HomeScreen;
