
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function Recipe({ foods }) {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <ArticleCard item={item} navigation={navigation} />
  );

  const ArticleCard = ({ item, navigation }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("RecipeDetailScreen", { recipe: item })}

    >
      <Image
        source={{ uri: item.recipeImage }} 
        style={styles.articleImage}
        resizeMode="cover"
      />
      <Text style={styles.articleText} numberOfLines={1}>
        {item.recipeName}
      </Text>
      <Text style={styles.articleDescription} numberOfLines={2}>
        {item.recipeInstructions || "No description available"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {foods && foods.length > 0 ? (
        <FlatList
  data={foods}
  renderItem={renderItem}
  keyExtractor={(item, index) => item.recipeId?.toString() || index.toString()}
  showsVerticalScrollIndicator={false}
  numColumns={2}   // 👈 2 columns grid
  columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }} // 👈 spacing between rows
/>

      ) : (
        <Text style={styles.loading}>No recipes available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  loading: {
    marginTop: hp(20),
    textAlign: "center",
    fontSize: hp(2),
    color: "#6B7280",
  },
  cardContainer: {
  flex: 1,
  marginBottom: hp(2),
  borderRadius: 15,
  overflow: "hidden",
  backgroundColor: "#fff",
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  marginHorizontal: wp(1),   // spacing between cards
},

  articleImage: {
  width: "100%",
  height: hp(18),   // fixed equal height
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
},

  articleText: {
    fontSize: hp(2),
    fontWeight: "600",
    color: "#52525B",
    marginLeft: wp(2),
    marginTop: hp(1),
  },
  articleDescription: {
    fontSize: hp(1.5),
    color: "#6B7280",
    marginLeft: wp(2),
    marginBottom: hp(1),
  },
});