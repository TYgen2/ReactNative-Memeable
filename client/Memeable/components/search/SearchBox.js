import { StyleSheet, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import { barOffset } from "../../utils/constants";

const SearchBox = ({ colors, query, setQuery }) => {
  return (
    <View style={[styles.searchBox, { backgroundColor: colors.searchBar }]}>
      <Icon name="search" size={24} color="grey" />
      <TextInput
        style={[styles.textInput, { color: colors.text }]}
        placeholder="Search here"
        placeholderTextColor="grey"
        value={query}
        onChangeText={setQuery}
      />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "95%",
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: barOffset + 10,
    marginBottom: 10,
  },
  textInput: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
  },
});
