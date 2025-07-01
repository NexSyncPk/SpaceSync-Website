import { View, Text, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

const SafeScreen = ({ children, statusBarColor = "#1565C0", statusBarStyle = "light-content" }: any) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
      <View style={{ 
        paddingTop: insets.top, 
        flex: 1, 
        backgroundColor: "#fff",
        // Add colored background to the safe area
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
        {/* Colored safe area at the top */}
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: statusBarColor,
          zIndex: -1,
        }} />
        {children}
      </View>
    </>
  );
};

export default SafeScreen;
