import { View, Text, TextInput, Pressable, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};

  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(recipeToEdit ? recipeToEdit.description : "");

  const saveRecipe = async () => {
    if (!title || !description) {
      alert("Please enter title and description");
      return;
    }

    try {
      const newRecipe = { title, image, description };
      const existing = await AsyncStorage.getItem("customrecipes");
      const recipes = existing ? JSON.parse(existing) : [];

      if (recipeToEdit !== undefined && recipeIndex !== undefined) {
        recipes[recipeIndex] = newRecipe;
        if (onrecipeEdited) onrecipeEdited();
      } else {
        recipes.push(newRecipe);
      }

      await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
      navigation.goBack();
    } catch (error) {
      console.log("Error saving recipe:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp(4) }}>
      {/* Back Button */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </Pressable>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />

      <Pressable onPress={saveRecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: wp(4) },
  backButton: { marginBottom: hp(2) },
  backButtonText: { fontSize: hp(2), color: "#4F75FF", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: wp(2), marginVertical: hp(1), borderRadius: 5 },
  image: { width: "100%", height: hp(25), marginVertical: hp(1), borderRadius: 10 },
  imagePlaceholder: { height: hp(20), textAlign: "center", paddingTop: hp(10), borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginVertical: hp(1) },
  saveButton: { backgroundColor: "#4F75FF", padding: hp(1.5), alignItems: "center", borderRadius: 8, marginTop: hp(2) },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: hp(2) },
});
