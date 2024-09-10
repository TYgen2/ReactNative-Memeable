import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { handleSearch } from "../../api/userActions";
import { getTokens } from "../../utils/tokenActions";
import SearchedUser from "../../components/searchedUser";
import { barOffset } from "../../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";

export default Search = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const tokens = await getTokens();
    const res = await handleSearch(query, tokens.jwtToken, tokens.refreshToken);
    setResults(res.searchRes);
  };

  const renderItem = ({ item }) => {
    return <SearchedUser item={item} navigation={navigation} />;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

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
      <FlatList data={results} renderItem={renderItem} />
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
  textInput: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
  },
});
