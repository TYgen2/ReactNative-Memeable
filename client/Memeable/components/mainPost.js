import { memo, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  displayLikes,
  getIconSource,
  navigateToUserProfile,
} from "../utils/helper";
import FastImage from "react-native-fast-image";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import CommentInput from "./commentInput";
import CommentItem from "./commentItem";
import { useSelector } from "react-redux";
import { LOADING_INDICATOR } from "../utils/constants";
import { usePostViewModel } from "../hooks/usePostViewModel";

export default MainPost = memo(({ item, navigation, colors }) => {
  const { userDetails } = useSelector((state) => state.user);
  const myIcon = getIconSource(userDetails?.userIcon);

  const {
    post,
    postState,
    toggleLike,
    toggleSave,
    comments,
    isCommentLoading,
    loadMoreComments,
    isLoadingMore,
    onChange,
    handleNewComment,
  } = usePostViewModel(item);

  const bottomSheetModalRef = useRef(null);
  const openCommentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const renderCommentItem = useCallback(
    ({ item }) => {
      return (
        <CommentItem item={item} navigation={navigation} colors={colors} />
      );
    },
    [navigation, colors]
  );

  const renderEmpty = () => {
    if (!isCommentLoading) return null;
    return <LOADING_INDICATOR />;
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return <LOADING_INDICATOR />;
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.imageContainer}>
        <View style={styles.uploaderContainer}>
          <Pressable
            onPress={() => navigateToUserProfile(navigation, post.userId)}
          >
            <FastImage
              source={post.userIcon}
              style={[
                styles.uploaderIcon,
                { backgroundColor: post.userIconBgColor },
              ]}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => navigateToUserProfile(navigation, post.userId)}
            >
              <Text style={[styles.uploaderName, { color: colors.text }]}>
                {post.userDisplayName}
              </Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.text }]}>
              {post.title}
            </Text>
          </View>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>
        <FastImage
          source={{ uri: post.imageUri }}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            styles.image,
            {
              height: post.imageHeight,
            },
          ]}
        />
        {post.description == "" ? (
          <></>
        ) : (
          <View style={styles.descriptionView}>
            <Pressable
              onPress={() => navigateToUserProfile(navigation, post.userId)}
            >
              <Text style={[styles.uploaderName2, { color: colors.text }]}>
                {post.userDisplayName}
              </Text>
            </Pressable>
            <Text style={[styles.description, { color: colors.text }]}>
              {" ‧ " + post.description}
            </Text>
          </View>
        )}
        <Text style={styles.hashtag}>{post.hashtag}</Text>
      </View>
      <View style={styles.rightsideBar}>
        {/* save icon */}
        <TouchableOpacity onPress={toggleSave}>
          <Icon
            name={postState.saved ? "bookmark" : "bookmark-outline"}
            size={32}
            color={colors.inactiveIcon}
          />
        </TouchableOpacity>
        {/* like, comment */}
        <View style={styles.actionsContainer}>
          {/* like button */}
          <View style={styles.center}>
            <Text style={{ color: colors.text }}>
              {displayLikes(postState.likes)}
            </Text>
            <TouchableOpacity onPress={toggleLike}>
              <Icon
                name={postState.liked ? "heart" : "heart-outline"}
                size={32}
                color={postState.liked ? "#FF4433" : colors.inactiveIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={openCommentModal}>
            <Icon
              name="chatbox-ellipses-outline"
              size={32}
              color={colors.inactiveIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["80%"]}
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        onChange={onChange}
        backgroundStyle={{ backgroundColor: colors.primary }}
        handleIndicatorStyle={{ backgroundColor: colors.secondary }}
      >
        <View style={styles.commentModalContent}>
          <BottomSheetFlatList
            data={comments}
            renderItem={renderCommentItem}
            refreshing={isCommentLoading}
            onEndReached={loadMoreComments}
            onEndReachedThreshold={0.6}
            contentContainerStyle={styles.commentList}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
          />
          <View style={styles.inputContainer}>
            <CommentInput
              postId={item._id}
              userIcon={myIcon}
              onCommentPosted={handleNewComment}
              colors={colors}
            />
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
});

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.3)",
  },
  imageContainer: {
    flex: 10,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 20,
  },
  image: {
    width: "95%",
    borderRadius: 10,
  },
  uploaderContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    width: "95%",
  },
  timeAgo: { color: "grey" },
  uploaderIcon: { width: 50, height: 50, borderRadius: 50 },
  uploaderName: { fontSize: 18, paddingLeft: 4, fontWeight: "bold" },
  title: { fontSize: 16, paddingLeft: 4 },
  description: { fontSize: 16 },
  descriptionView: {
    flexDirection: "row",
    width: "95%",
    marginTop: 4,
  },
  uploaderName2: { fontWeight: "bold", fontSize: 16 },
  hashtag: {
    fontSize: 16,
    width: "95%",
    color: "#6495ED",
  },
  rightsideBar: {
    flex: 2,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
  },
  actionsContainer: {
    gap: 10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  commentModalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  commentList: { flexGrow: 1 },
  inputContainer: {
    width: "100%",
  },
  footerLoader: {
    paddingVertical: 30,
    alignItems: "center",
  },
});
