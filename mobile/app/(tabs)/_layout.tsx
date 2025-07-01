import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";


export default function _layout() {
  
  // Custom header component for perfect centering
  const CustomHeader = ({ title }: { title: string }) => (
    <View style={{
      backgroundColor: "#1565C0",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      // paddingTop: 20, // Account for status bar
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        textAlign: "center",
      }}>
        {title}
      </Text>
    </View>
  );

  return <Tabs
  screenOptions={{
    headerShown: true,
    header: ({ route }) => {
      const getTitle = () => {
        switch (route.name) {
          case 'index': return 'Book Meeting';
          case 'booking': return 'Bookings';
          case 'calender': return 'Calendar';
          case 'profile': return 'Profile';
          default: return route.name;
        }
      };
      return <CustomHeader title={getTitle()} />;
    },
    tabBarActiveTintColor: "#007AFF", // Blue color for active/focused tabs
    tabBarInactiveTintColor: "#888",
    tabBarStyle:{
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
      height: 60,
      paddingBottom: 5,
      paddingTop: 5,
      position: "absolute",
      elevation: 2, // Reduced shadow on Android (was default ~8)
      shadowOpacity: 0.1, // Reduced shadow opacity on iOS (was default ~0.3)
      shadowRadius: 3, // Reduced shadow blur on iOS (was default ~10)
      shadowOffset: {
        width: 0,
        height: -1, // Reduced shadow height
      },
    },
    tabBarItemStyle: {
      justifyContent: "center",
      alignItems: "center",
    },
  }}>
    <Tabs.Screen
    name="index"
    options={{
      title: "Home",
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={size}
          color={color}
        />
      ),
    }}
    />
    <Tabs.Screen
    name="booking"
    options={{
      title: "Booking",
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? "list" : "list-outline"}
          size={size}
          color={color}
        />
      ),
    }}
    />
    <Tabs.Screen
    name="calender"
    options={{
      title: "Calendar",
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? "calendar-sharp" : "calendar-outline"}
          size={size}
          color={color}
        />
      ),
    }}
    />
    <Tabs.Screen
    name="profile"
    options={{
      title: "Profile",
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? "person" : "person-outline"}
          size={size}
          color={color}
        />
      ),
    }}  
    />
  </Tabs>;
}
