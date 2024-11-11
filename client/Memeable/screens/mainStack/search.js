import { FlatList, StyleSheet, View } from "react-native";
import { barOffset, LOADING_INDICATOR } from "../../utils/constants";
import { useCallback } from "react";
import useSearch from "../../hooks/useSearch";
import useColorTheme from "../../hooks/useColorTheme";
import SearchEmpty from "../../components/search/SearchEmpty";
import SearchBox from "../../components/search/SearchBox";
import SearchedItem from "../../components/search/SearchedItem";

const Search = ({ navigation }) => {
  const { colors } = useColorTheme();
  const { query, setQuery, results, isSearching } = useSearch();

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SearchedItem item={item} navigation={navigation} colors={colors} />
      );
    },
    [navigation, colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <SearchBox colors={colors} query={query} setQuery={setQuery} />
      {isSearching ? (
        <LOADING_INDICATOR bgColor={colors.primary} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={<SearchEmpty />}
        />
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 70,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: barOffset + 10,
  },
});
