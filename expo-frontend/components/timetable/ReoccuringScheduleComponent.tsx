import { View, Text, Pressable, Modal, Platform, Image } from 'react-native'
import { useState } from 'react';
import React from 'react'

export default function ReooccuringScheduleComponent({key, name, subjectID, description, startTime, endTime, type, cr, token, refresher, eventID, overlap} : any) {
    const [modalOpen, setModalOpen] = useState(false)
    const [attended, setAtteneded] = useState(false)
    //TODO fix this bullshit "good-enough" code
    const startTimeConvert = startTime;
    const endTimeConvert = endTime;
    const baseMargin = 40;
    const lineHeight = (Platform.OS == "ios") ? 21.4 : 24; //24 px is set in the other file but IOS is weird and it doesnt work as well?
    const fontsize = 16;
    const startCoeff = (Number(startTimeConvert.split(":")[0]) + Number(startTimeConvert.split(":")[1])/60)
    const endCoeff = (Number(endTimeConvert.split(":")[0]) + Number(endTimeConvert.split(":")[1])/60)
    const requiredMargin = baseMargin * (startCoeff - 4) + lineHeight*(2*(startCoeff - 5) + 1)/2
    const requiredHeight = (endCoeff - startCoeff) * (baseMargin + lineHeight);
    
    const handleEventDeletion = async() => {
        //call delete event endpoint here
        await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/deleteReoccuringEvent', {
            method: 'POST', // Specifies a POST request
            headers: {
              'Content-Type': 'application/json', // Informs the server about the data format
            },
            body: JSON.stringify({jwt: token, reoccuring_event_id: eventID})
          })
          .then((res) => res.json())
          .then(async(data) => {
            if(data.success == false){
                console.log(data.message)
            }
            else{
                console.log(data.message)
                refresher((hello :any) => hello + 1);
                setModalOpen(false)
            }
        })

    }

    const handleEventAttend = () => {
        
    }

    const handleEventLeave = () => {

    }

  return (
    <View>
        <Modal visible={modalOpen} className='' transparent={true} animationType="fade">
                <View className='flex-1 justify-center items-center' style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <View className='bg-slate-400 w-72 rounded-lg flex-col items-center justify-between px-4 relative'>
                        <View className='absolute top-2 left-2'>
                            <Pressable onPress={() => setModalOpen(false)}>
                                <Image source={require("@/assets/images/CloseButton.png")}/>
                            </Pressable>
                            
                        </View>
                        
                        <Text className='text-center mt-5 font-bold'>{name}</Text>
                        <Text className='text-center mt-3'>{description}</Text>
                        <View className='mb-6 py-1 px-5 mt-4'>

                        {cr ? (<View className='bg-white mb-6 mt-4 rounded-full'>
                                                    <Pressable className="py-2 px-5" onPress={handleEventDeletion}>
                                                        <Text className='text-center font-bold text-red-500'>Delete</Text>
                                                    </Pressable>
                                            </View>) : <View className=''></View>}
                    </View>
                    </View>
                    
                </View>
        </Modal>
        <Pressable onPress={() => {setModalOpen(true)
            console.log(overlap);
         } }>
        <View className="absolute rounded-lg border overflow-hidden flex-col justify-center items-center w-full" style={{top: requiredMargin, height: requiredHeight, opacity: (overlap ? 0.5 : 1), backgroundColor: (overlap ? "#E26161": "#56A3FA")}}> 
            <Text className='text-white'>{name}</Text>
            <Text className='text-white font-bold text-xs'>{startTimeConvert.split(":")[0]} - {endTimeConvert.split(":")[0]}</Text>
        </View>
        </Pressable>
    </View>
    
  )
}