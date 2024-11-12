import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";

const OtherMethods = ({ handleFacebook, promptAsync }) => {
  return (
    <View style={styles.socialLogin}>
      <Text style={{ marginBottom: 10 }}>
        Continue with the following methods
      </Text>

      <View style={styles.methodContainer}>
        {/* facebook */}
        <TouchableOpacity
          style={styles.methodIconContainer}
          onPress={() => handleFacebook()}
        >
          <Image
            source={require("../../../assets/facebook.png")}
            style={styles.methodIcon}
          />
        </TouchableOpacity>

        {/* google */}
        <TouchableOpacity
          style={styles.methodIconContainer}
          onPress={() => promptAsync()}
        >
          <Image
            source={require("../../../assets/google.png")}
            style={styles.methodIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(OtherMethods);

const styles = StyleSheet.create({
  socialLogin: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  methodContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  methodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    elevation: 6,
    marginHorizontal: 10,
  },
  methodIcon: { width: 50, height: 50, borderRadius: 50 },
});
