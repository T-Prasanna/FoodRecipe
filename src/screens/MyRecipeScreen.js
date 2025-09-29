import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from AsyncStorage
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const stored = await AsyncStorage.getItem("customrecipes");
        setRecipes(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.log("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchRecipes);
    return unsubscribe;
  }, [navigation]);

  // Add new recipe
  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen", {
      onrecipeEdited: () => fetchRecipesFromStorage(),
    });
  };

  // Helper to reload recipes after add/edit
  const fetchRecipesFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("customrecipes");
      setRecipes(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.log("Error fetching recipes:", error);
    }
  };

  // Recipe click: view recipe details
  const handleRecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  // Delete recipe
  const deleteRecipe = async (index) => {
    try {
      const updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
      Alert.alert("Deleted", "Recipe removed successfully.");
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };

  // Edit recipe
  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
      onrecipeEdited: fetchRecipesFromStorage,
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>

      {/* Add New Recipe */}
      <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Recipe</Text>
      </TouchableOpacity>

      {/* Recipes List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4F75FF" />
      ) : recipes.length === 0 ? (
        <Text style={styles.noRecipesText}>No recipes added yet.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <TouchableOpacity onPress={() => handleRecipeClick(recipe)} testID="handlerecipeBtn">
                {recipe.image ? <Image source={{ uri: recipe.image }} style={styles.recipeImage} /> : null}
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDescription} testID="recipeDescp">
                  {recipe.description.length > 50
                    ? recipe.description.substring(0, 50) + "..."
                    : recipe.description}
                </Text>
              </TouchableOpacity>

              {/* Edit & Delete Buttons */}
              <View style={styles.editDeleteButtons} testID="editDeleteButtons">
                <TouchableOpacity onPress={() => editRecipe(recipe, index)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteRecipe(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: wp(4), backgroundColor: "#F9FAFB" },
  backButton: { marginBottom: hp(1.5) },
  backButtonText: { fontSize: hp(2.2), color: "#4F75FF" },
  addButton: {
    backgroundColor: "#4F75FF",
    padding: wp(2),
    alignItems: "center",
    borderRadius: 2,
    marginBottom: hp(1),
    width: wp(40),
    alignSelf: "center",   
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2.2),
  },
  scrollContainer: { paddingBottom: hp(2), alignItems: "center" },
  noRecipesText: { textAlign: "center", fontSize: hp(2), color: "#6B7280", marginTop: hp(5) },
  recipeCard: {
    width: wp(40),
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: 8,
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  recipeImage: { width: "100%", height: hp(25), borderRadius: 10, marginBottom: hp(1) },
  recipeTitle: { fontSize: hp(2.2), fontWeight: "600", marginBottom: hp(0.5) },
  recipeDescription: { fontSize: hp(1.8), color: "#6B7280", marginBottom: hp(1.5) },
  editDeleteButtons: { flexDirection: "row", justifyContent: "space-between" },
  editButton: { backgroundColor: "#34D399", padding: wp(1), borderRadius: 5, width: wp(5), alignItems: "center" },
  editButtonText: { color: "#fff", fontWeight: "600" },
  deleteButton: { backgroundColor: "#EF4444", padding: wp(1.5), borderRadius: 5, width: wp(5), alignItems: "center" },
  deleteButtonText: { color: "#fff", fontWeight: "600" },
});
