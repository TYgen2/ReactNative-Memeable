import { FlatList, StyleSheet, View } from "react-native";
import useColorTheme from "../../hooks/useColorTheme";
import useFetchNotifications from "../../hooks/fetchData/useFetchNotifications";
import { barOffset, LOADING_INDICATOR } from "../../utils/constants";
import { useCallback } from "react";
import NotificationItem from "../../components/notification/NotificationItem";
import NotificationHeader from "../../components/notification/NotificationHeader";
import NotificationEmpty from "../../components/notification/NotificationEmpty";

const Notify = ({ navigation }) => {
  const { colors } = useColorTheme();

  const {
    notifications,
    isLoading,
    isLoadingMore,
    isRefreshing,
    loadMoreNotifications,
    refreshNotifications,
  } = useFetchNotifications();

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <NotificationItem item={item} colors={colors} navigation={navigation} />
      );
    },
    [colors, navigation]
  );

  if (isLoading) return <LOADING_INDICATOR bgColor={colors.primary} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <NotificationHeader colors={colors} />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={loadMoreNotifications}
        refreshing={isRefreshing}
        onRefresh={refreshNotifications}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={isLoadingMore ? <LOADING_INDICATOR /> : null}
        ListEmptyComponent={<NotificationEmpty />}
      />
    </View>
  );
};

export default Notify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: barOffset + 10,
    paddingBottom: 70,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
