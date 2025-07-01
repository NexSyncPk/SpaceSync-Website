import { View, Text } from 'react-native'
import React from 'react'
import SafeScreen from '../components/SafeScreen'

const booking = () => {
  return (
    <SafeScreen 
      statusBarColor="#1565C0" 
      statusBarStyle="light-content"
      navigationBarColor="#1565C0"
      navigationBarStyle="light"
    >
      <View>
        <Text>booking</Text>
      </View>
    </SafeScreen>
  )
}

export default booking