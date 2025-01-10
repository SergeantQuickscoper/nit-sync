import { View, Text } from 'react-native'
import React from 'react'
import NavigationBar from '@/components/timetable/NavigationBar'
export default function support() {
  return (
    <View className='flex-1 bg-[#F7F7F7]'>
        <View className="header mb-2 mt-14 flex-row justify-between  ml-4 mr-2 items-center">
              <NavigationBar />
              <Text className="font-bold ml-4">
                  Support 
              </Text>
              <View className="p-4"><View className="w-[18px]"></View></View>
        </View>      
        <View className='items-center'>
          <Text>Send feedback and support requests to:</Text>
          <Text>dr24csb0b@student.nitw.ac.in</Text>
      </View>
    </View>
  )
}