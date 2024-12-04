import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";


export default function NavigationBar() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Image source={require("@/assets/images/NavBar.png")}/>
    </Pressable>
  
  )
}