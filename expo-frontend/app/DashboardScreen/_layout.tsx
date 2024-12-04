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
            title:"Day View"
          }}
        />
        <Drawer.Screen
          name="index1" 
          options={{
            drawerLabel: 'Week View',
            title:"Week View"
          }}
        />
        <Drawer.Screen
          name="index2" 
          options={{
            drawerLabel: 'Attendance',
            title:"Attendance"
          }}
        />
        <Drawer.Screen
          name="index3" 
          options={{
            drawerLabel: 'Profile',
            title:"Profile"
          }}
        />

        <Drawer.Screen
          name="index4" 
          options={{
            drawerLabel: 'Support',
            title:"Support"
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}