import { View, Text, ScrollView, Image, StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";

export default function CustomRecipesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favoriteRecipe = useSelector(state => state.favorites.favoriterecipes);

  const [recipes, setRecipes] = useState([]);

  // Load recipes from AsyncStorage
  const loadRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem("customrecipes");
      setRecipes(stored ? JSON.parse(stored) : []);
    } catch (error) {
      Alert.alert("Error", "Failed to load recipes");
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  const handleToggleFavorite = (recipeId) => {
    dispatch(toggleFavorite(recipeId));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {recipes.length === 0 ? (
        <Text style={styles.noRecipeText}>No Recipes Available</Text>
      ) : (
        recipes.map((recipe, index) => (
          <View key={index} style={styles.recipeCard}>
            {recipe.image ? (
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            ) : null}
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text numberOfLines={2} style={styles.recipeDescription}>{recipe.description}</Text>

            <View style={styles.cardButtons}>
              <Pressable
                onPress={() => navigation.navigate("RecipesFormScreen", {
                  recipeToEdit: recipe,
                  recipeIndex: index,
                  onrecipeEdited: loadRecipes
                })}
                style={styles.editButton}
              >
                <Text>Edit</Text>
              </Pressable>

              <Pressable
                onPress={() => handleToggleFavorite(index)} // Ideally use recipe.title or ID
                style={styles.favoriteButton}
              >
                <Text>{favoriteRecipe.includes(index) ? "♥" : "♡"}</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      <Pressable
        onPress={() => navigation.navigate("RecipesFormScreen", { onrecipeEdited: loadRecipes })}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Recipe</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9FAFB",
    },
    scrollContent: {
      padding: wp(4),
      alignItems: "center",
    },
    noRecipeText: {
      fontSize: hp(2.2),
      textAlign: "center",
      marginTop: hp(10),
      color: "#6B7280",
    },
    recipeCard: {
      width: wp(90),
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: hp(3),
      padding: wp(4),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Android shadow
    },
    recipeImage: {
      width: "100%",
      height: hp(30),
      borderRadius: 12,
      marginBottom: hp(2),
      resizeMode: "cover",
    },
    recipeTitle: {
      fontSize: hp(2.5),
      fontWeight: "700",
      color: "#111827",
      marginBottom: hp(0.5),
    },
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1.5),
    },
    cardButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    editButton: {
      backgroundColor: "#4F75FF",
      paddingVertical: hp(1),
      paddingHorizontal: wp(4),
      borderRadius: 8,
      alignItems: "center",
    },
    favoriteButton: {
      backgroundColor: "#FBBF24",
      paddingVertical: hp(1),
      paddingHorizontal: wp(4),
      borderRadius: 8,
      alignItems: "center",
    },
    addButton: {
      backgroundColor: "#10B981",
      paddingVertical: hp(2),
      paddingHorizontal: wp(5),
      borderRadius: 12,
      marginTop: hp(2),
      alignItems: "center",
      width: wp(90),
      alignSelf: "center",
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: hp(2.2),
    },
  });
  
