import { View, Text, Pressable } from 'react-native'
import React from 'react'

export default function ScheduleComponent({key, name, subjectID, description, startTime, endTime, type} : any) {
    //TODO fix this bullshit "good-enough" code
    const startTimeConvert = startTime;
    const endTimeConvert = endTime;
    const baseMargin = 40;
    const textFontCorrection = 4; //currently half of the font size 16px
    const fontsize = 14.5;
    const requiredMargin = baseMargin * (startTimeConvert.split(":")[0] - 4) + textFontCorrection + fontsize*(startTimeConvert.split(":")[0] - 5)
    const requiredHeight = ((endTimeConvert.split(":")[0] + endTimeConvert.split(":")[1]/60) - (startTimeConvert.split(":")[0] + startTimeConvert.split(":")[1]/60)) * 54.5/10;
    console.log(requiredHeight)
  return (
    <Pressable>
        <View className="bg-[#56A3FA] absolute mx-16 rounded-lg border px-2 py-2 overflow-hidden w-4/6" style={{top: requiredMargin, height: requiredHeight}}> 
            <Text className='text-white font-bold'>{name} - {startTimeConvert} to {endTimeConvert}</Text>
        </View>
    </Pressable>
  )
}