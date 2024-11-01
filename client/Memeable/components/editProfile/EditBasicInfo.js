import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect } from "react";
import useUpdateStrings from "../../hooks/updateUserProfile/useUpdateStrings";
import { useProfileUpdates } from "../../context/ProfileUpdateContext";
import useColorTheme from "../../hooks/useColorTheme";

const EditBasicInfo = ({ displayName, username, userBio }) => {
  const { colors } = useColorTheme();

  const {
    newDisplayName,
    setNewDisplayName,
    newUsername,
    setNewUsername,
    newUserBio,
    setNewUserBio,
    updateStringInfo,
  } = useUpdateStrings({ displayName, username, userBio });
  const { registerUpdate, unregisterUpdate } = useProfileUpdates();

  useEffect(() => {
    registerUpdate("basicInfo", updateStringInfo);
    return () => unregisterUpdate("basicInfo");
  }, [updateStringInfo]);

  return (
    <View style={styles.editInput}>
      <View
        style={[styles.textInput, { height: 60, justifyContent: "center" }]}
      >
        <Text style={styles.greyText}>User name</Text>
        <TextInput
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          style={{ color: colors.text }}
        />
      </View>
      <View
        style={[styles.textInput, { height: 60, justifyContent: "center" }]}
      >
        <Text style={styles.greyText}>Display name</Text>
        <TextInput
          value={newDisplayName}
          onChangeText={setNewDisplayName}
          autoCapitalize="none"
          style={{ color: colors.text }}
        />
      </View>
      <View style={[styles.textInput, { height: 120, paddingTop: 4 }]}>
        <Text style={styles.greyText}>Personal bio</Text>
        <TextInput
          value={newUserBio}
          onChangeText={setNewUserBio}
          autoCapitalize="none"
          style={{ color: colors.text }}
        />
      </View>
    </View>
  );
};

export default EditBasicInfo;

const styles = StyleSheet.create({
  editInput: {
    flex: 3,
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    paddingRight: "5%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    width: "95%",
    borderRadius: 10,
    paddingLeft: 10,
  },
  greyText: { color: "grey" },
});
