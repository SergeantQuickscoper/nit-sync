import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import SubjectComponent from '@/components/timetable/SubjectComponent'
import { ScrollView } from 'react-native-gesture-handler'
import NavigationBar from '@/components/timetable/NavigationBar'
import CreateEventButton from '@/components/timetable/CreateSubjectButton'
export default function subjects() {
  return (
    <View className='flex-1 bg-[#F7F7F7] border'>
      <View className="header mb-2 mt-14 flex-row justify-between mx-4 items-center">
                <NavigationBar />
                <Text className="font-bold text-lg">
                    Subjects
                </Text>
                <CreateEventButton />
      </View>
      <ScrollView >
        <View className='flex-1 flex-row flex-wrap mt-4'>
            <SubjectComponent name="PDS"/>
            <SubjectComponent name="Engineering Physics"/>
            <SubjectComponent name="PDS"/>
            <SubjectComponent name="PDS"/>
        </View>
      </ScrollView>
      
    </View>
  )
}