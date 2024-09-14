import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SearchedUser from "../../components/searchedUser";
import { barOffset } from "../../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";
import useSearch from "../../hooks/useSearch";

export default Search = ({ navigation }) => {
  const { query, setQuery, results, setResults, isSearching } = useSearch();

  const renderItem = ({ item }) => {
    return <SearchedUser item={item} navigation={navigation} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Icon name="search" size={24} color="#2b2b2b" />
        <TextInput
          style={styles.textInput}
          placeholder="Search here"
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
    backgroundColor: "cyan",
    marginTop: barOffset + 10,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "95%",
    backgroundColor: "rgba(0,0,0,0.1)",
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
