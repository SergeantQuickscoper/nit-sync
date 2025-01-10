import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" 
          options={{
            drawerLabel: 'Day View',
            title:"Day View",
            headerShown: false
          }}
        />
        <Drawer.Screen
          name="subjects" 
          options={{
            drawerLabel: 'Subjects',
            title:"Subjects",
            headerShown: false
          }}
        />

        <Drawer.Screen
          name="weekView" 
          options={{
            drawerLabel: 'Week View',
            title:"Week View",
            headerShown: false
          }}
        />
        <Drawer.Screen
          name="profile" 
          options={{
            drawerLabel: 'Profile',
            title:"Profile",
            headerShown: false
          }}
        />

        <Drawer.Screen
          name="support" 
          options={{
            drawerLabel: 'Support',
            title:"Support",
            headerShown: false
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}