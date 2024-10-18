import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SearchedUser from "../../components/SearchedUser";
import { barOffset } from "../../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";
import useSearch from "../../hooks/useSearch";
import { useCallback } from "react";
import useColorTheme from "../../hooks/useColorTheme";

export default Search = ({ navigation }) => {
  const { colors } = useColorTheme();
  const { query, setQuery, results, setResults, isSearching } = useSearch();

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SearchedUser item={item} navigation={navigation} colors={colors} />
      );
    },
    [navigation, colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
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
      {isSearching ? (
        <ActivityIndicator
          size={30}
          color="grey"
          style={{ flex: 1, paddingBottom: barOffset + 10 }}
        />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: results.length > 0 ? "flex-start" : "center",
            paddingBottom: barOffset + 10,
          }}
          ListEmptyComponent={
            <Text style={styles.noMatch}>No matched result</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  searchBox: {
    flexDirection: "row",
    marginTop: barOffset + 10,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "95%",
    borderRadius: 10,
    paddingLeft: 10,
  },
  noMatch: {
    fontWeight: "bold",
    fontSize: 24,
    color: "grey",
  },
  textInput: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
  },
});
