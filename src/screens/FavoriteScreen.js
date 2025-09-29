import React from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
  const navigation = useNavigation();

  // Get favorites from Redux
  const favoriteRecipesList = useSelector(
    (state) => state.favorites?.favoriterecipes || []
  );

  if (favoriteRecipesList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite recipes yet!</Text>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render each recipe
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("RecipeDetailScreen", { recipe: item })}
    >
      <Image source={{ uri: item.recipeImage }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle} numberOfLines={1}>
        {item.recipeName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Heading */}
      <View testID="FavoriteRecipes">
        <Text style={styles.heading}>My Favorite Recipes</Text>
      </View>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.goBackButton}
      >
        <Text style={styles.goBackButtonText}>Go back</Text>
      </TouchableOpacity>

      {/* List of favorites */}
      <FlatList
        data={favoriteRecipesList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.idFood?.toString() || index.toString()}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: hp(2.5),
    color: "#6B7280",
  },
  heading: {
    fontSize: hp(3.8),
    marginTop: hp(4),
    marginLeft: 20,
    fontWeight: "600",
    color: "#374151",
  },
  goBackButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 100,
    alignItems: "center",
    marginLeft: 20,
  },
  goBackButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContentContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  cardContainer: {
    backgroundColor: "white",
    marginBottom: hp(2),
    padding: wp(4),
    borderRadius: 10,
    elevation: 3, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  recipeImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 10,
    marginRight: wp(4),
  },
  recipeTitle: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#4B5563",
    flexShrink: 1,
  },
});
