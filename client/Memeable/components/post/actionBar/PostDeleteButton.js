import { TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { handleDeletePost } from "../../../store/actions/userActions";
import { useCallback, memo } from "react";

const PostDeleteButton = ({ postId, onDeleteSuccess }) => {
  const dispatch = useDispatch();

  const handleDelete = useCallback(() => {
    dispatch(handleDeletePost({ postId }))
      .unwrap()
      .then(() => {
        onDeleteSuccess?.();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }, [dispatch, postId, onDeleteSuccess]);

  const handlePress = useCallback(() => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: handleDelete,
      },
    ]);
  }, [handleDelete]);

  return (
    <TouchableOpacity style={styles.deleteButton} onPress={handlePress}>
      <Icon name="trash-outline" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default memo(PostDeleteButton);

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#FF3131",
    padding: 8,
    borderRadius: 4,
  },
});
