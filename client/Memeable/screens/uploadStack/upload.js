import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { screenWidth } from "../../utils/constants";
import { Formik } from "formik";
import { uploadReviewSchema } from "../../utils/validationSchema";
import { handlePostUpload } from "../../api/userActions";
import Icon from "react-native-vector-icons/Ionicons";
import { getTokens } from "../../utils/tokenActions";
import { useContext, useState } from "react";
import { UpdateContext } from "../../context/loading";

export default Upload = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      {isUploading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.pop()}
      >
        <Icon name="close-outline" size={30} />
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={{ fontWeight: "bold", fontSize: 32 }}>New Post</Text>
      </View>
      <View style={[styles.imgContainer]}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </View>
      <Formik
        initialValues={{
          title: "",
          description: "",
          hashtag: "",
        }}
        validationSchema={uploadReviewSchema}
        onSubmit={async (values) => {
          setIsUploading(true);
          const tokens = await getTokens();
          await handlePostUpload(
            imageUri,
            values.title,
            values.description,
            values.hashtag,
            tokens.jwtToken,
            tokens.refreshToken
          ).then(() => {
            setIsUploading(false);
            setShouldFetch(true);
            navigation.pop();
          });
        }}
      >
        {(props) => (
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              {/* title */}
              <TextInput
                autoCapitalize={false}
                autoCorrect={false}
                style={styles.input}
                placeholder="Title (optional)"
                onChangeText={props.handleChange("title")}
                value={props.values.title}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.title && props.errors.title}
            </Text>
            <View style={styles.inputRow}>
              {/*description*/}
              <TextInput
                autoCapitalize={false}
                autoCorrect={false}
                style={styles.input}
                placeholder="Description (optional)"
                onChangeText={props.handleChange("description")}
                value={props.values.description}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.description && props.errors.description}
            </Text>
            <View style={styles.inputRow}>
              {/*hashtags */}
              <TextInput
                autoCapitalize={false}
                autoCorrect={false}
                style={styles.input}
                placeholder="Hashtags (optional)"
                onChangeText={props.handleChange("hashtag")}
                value={props.values.hashtag}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.hashtag && props.errors.hashtag}
            </Text>
            <TouchableOpacity
              style={styles.actionContainer}
              activeOpacity={0.8}
              onPress={props.handleSubmit}
            >
              <Text
                style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
              >
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: 60,
    height: 60,
    top: 60,
    right: 10,
    borderRadius: 60,
  },
  title: {
    flex: 0.5,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    flex: 3,
    justifyContent: "flex-start",
    marginVertical: 30,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth * 0.8,
    borderWidth: 2,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    alignContent: "center",
    height: 50,
    backgroundColor: "white",
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  errorMsg: {
    color: "red",
  },
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: screenWidth * 0.8,
    borderRadius: 20,
    marginVertical: 30,
  },
});
