import { FlatList, StyleSheet, View } from "react-native";
import useColorTheme from "../../hooks/useColorTheme";
import useFetchNotifications from "../../hooks/fetchData/useFetchNotifications";
import { LOADING_INDICATOR } from "../../utils/constants";

const Notify = () => {
  const { colors } = useColorTheme();
  const {
    notifications,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    isRefreshing,
    loadMoreNotifications,
    refreshNotifications,
  } = useFetchNotifications();

  if (isLoading) return <LOADING_INDICATOR />;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={loadMoreNotifications}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshNotifications}
          />
        }
        ListFooterComponent={isLoadingMore ? <LOADING_INDICATOR /> : null}
      />
    </View>
  );
};

export default Notify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
