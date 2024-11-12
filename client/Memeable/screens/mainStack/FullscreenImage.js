import { StyleSheet } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const FullscreenImage = ({ route, navigation }) => {
  const { imageUri } = route.params;

  const images = [
    {
      url: imageUri,
      props: {
        resizeMode: "contain",
      },
    },
  ];

  return (
    <ImageViewer
      imageUrls={images}
      enableSwipeDown={true}
      onSwipeDown={() => navigation.goBack()}
      backgroundColor="#000000"
      renderIndicator={() => null} // Hide page indicator since we only have 1 image
      doubleClickInterval={300} // Adjust double tap sensitivity
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default FullscreenImage;
