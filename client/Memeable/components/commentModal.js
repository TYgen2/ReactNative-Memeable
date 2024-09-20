import { StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default CommentModal = ({ isPressed }) => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%, 75%"], []);

  const DATA = ["gg", "hahaha"];
  const renderItem = useCallback(({ item }) => {
    return <Text>WTF</Text>;
  }, []);

  useEffect(() => {
    if (isPressed) {
      sheetRef.current?.expand();
    }
  }, [isPressed]);

  return (
    <View style={styles.container}>
      <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
        <BottomSheetFlatList
          data={DATA}
          keyExtractor={(i) => i}
          renderItem={renderItem}
        />
      </BottomSheet>
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
});
