import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import NavigationBar from '@/components/timetable/NavigationBar'
import { router, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function profile() {
  const [userData, setUserData] : any = useState({});
  useFocusEffect(React.useCallback(() =>{
    const getUserData = async() => {
      let token;
      try {
        token = await AsyncStorage.getItem('jwt');
        if(!token){
            throw Error("Token not found")
        }
      } catch (error : any) {
          console.log(error.message)
          return;
      }

      await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getUserData', {
        method: 'POST', // Specifies a POST request
        headers: {
          'Content-Type': 'application/json', // Informs the server about the data format
        },
        body: JSON.stringify({jwt: token})
      })
      .then((res) => res.json())
      .then(async(data) => {
        if(data.success == false){
            console.log(data.message)
        }
        else{
            setUserData(data.userData);
        }
      })
    }

    getUserData();

  }, []))

  const handleLogout = async() => {
    await AsyncStorage.removeItem("jwt")
    await AsyncStorage.removeItem("isCR")
    router.push({ pathname: "/"});
  }
  return (
    <View className='flex-1 bg-[#F7F7F7]'>
                <View className="header mb-2 mt-14 flex-row justify-between  ml-4 mr-2 items-center">
                    <NavigationBar />
                    <Text className="font-bold ml-4">
                        Profile
                    </Text>
                    <View className="p-4"><View className="w-[18px]"></View></View>
                </View>
                <View className='items-center'>
                    <Text>Big Ass Image</Text>
                    <Text>{userData?.first_name}  {userData?.last_name}</Text>
                </View>
                <View className='items-center'>
                    <Text>Class: {userData?.branch}{"E"} {userData?.section}</Text>
                </View>
                <View className='items-center'>
                    <Text>Roll No: {userData?.roll_no}</Text>
                </View>
                <View className='items-center'>
                    <Text>Role: {String(userData.role).toUpperCase()}</Text>
                </View>
                <View className='items-center'>
                    <View className='bg-white mb-6 mt-4 rounded-full w-1/4 items-center justify-center border'>
                      <Pressable className="py-2 px-5 items-center" onPress={handleLogout} >
                          <Text className='text-center font-bold text-red-500'>Logout</Text>
                      </Pressable>
                  </View>
                </View>
    </View>
  )
}