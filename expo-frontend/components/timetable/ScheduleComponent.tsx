import { View, Text, Pressable, Modal } from 'react-native'
import { useState } from 'react';
import React from 'react'

export default function ScheduleComponent({key, name, subjectID, description, startTime, endTime, type} : any) {
    const [modalOpen, setModalOpen] = useState(false)
    //TODO fix this bullshit "good-enough" code
    const startTimeConvert = startTime;
    const endTimeConvert = endTime;
    const baseMargin = 40;
    const lineHeight = 24; //currently half of the font size 16px
    const fontsize = 16;
    const requiredMargin = baseMargin * (startTimeConvert.split(":")[0] - 4) + lineHeight*(2*(startTimeConvert.split(":")[0] - 5) + 1)/2
    const requiredHeight = ((endTimeConvert.split(":")[0] + endTimeConvert.split(":")[1]/60) - (startTimeConvert.split(":")[0] + startTimeConvert.split(":")[1]/60)) * (baseMargin + lineHeight)/10;
    console.log(requiredHeight)
  return (
    <View>
        <Modal visible={modalOpen} className='' transparent={true}>
                <View className='flex-1 justify-center items-center' style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <View className='bg-slate-400 w-72 h-56 rounded-lg flex-col items-center justify-between px-4 relative'>
                        <View className='absolute top-2 left-2'>
                            <Pressable onPress={() => setModalOpen(false)}>
                                <Text>X</Text>
                            </Pressable>
                            
                        </View>
                        
                        <Text className='text-center mt-5 font-bold'>{name}</Text>
                        <Text className='text-center mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam adipisci fuga, maiores veritatis tempora nesciunt eligendi, quo quibusdam molestias itaque ex, libero necessitatibus quod. Molestias ex fuga beatae laudantium voluptates.</Text>
                        <View className='bg-white mb-6 py-1 px-5 mt-4'>
                        <Pressable>
                            <Text className=''>Mark as attended</Text>
                        </Pressable>
                    </View>
                    </View>
                    
                </View>
        </Modal>
        <Pressable onPress={() => setModalOpen(true)}>
        <View className="bg-[#56A3FA] absolute mx-16 rounded-lg border px-2 py-2 overflow-hidden w-4/6" style={{top: requiredMargin, height: requiredHeight}}> 
            <Text className='text-white font-bold'>{name} - {startTimeConvert} to {endTimeConvert}</Text>
        </View>
        </Pressable>
    </View>
    
  )
}