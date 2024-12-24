import { View, Text, Pressable, Modal, Platform } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'

export default function ScheduleComponent({key, name, subjectID, description, startTime, endTime, type, cr, token, refresher, eventID} : any) {
    const [modalOpen, setModalOpen] = useState(false)
    const [attended, setAtteneded] = useState(false)
    //TODO fix this bullshit "good-enough" code
    const startTimeConvert = startTime;
    const endTimeConvert = endTime;
    const baseMargin = 40;
    const lineHeight = (Platform.OS == "ios") ? 21.4 : 24; //24 px is set in the other file but IOS is fucking weird and it doesnt work as well?
    const fontsize = 16;
    const startCoeff = (Number(startTimeConvert.split(":")[0]) + Number(startTimeConvert.split(":")[1])/60)
    const endCoeff = (Number(endTimeConvert.split(":")[0]) + Number(endTimeConvert.split(":")[1])/60)
    const requiredMargin = baseMargin * (startCoeff - 4) + lineHeight*(2*(startCoeff - 5) + 1)/2
    const requiredHeight = (endCoeff - startCoeff) * (baseMargin + lineHeight);
    
    useEffect(() => {
        console.log(endCoeff)
    }, [])
    const handleEventDeletion = async() => {
        //call delete event endpoint here
        await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/deleteEvent', {
            method: 'POST', // Specifies a POST request
            headers: {
              'Content-Type': 'application/json', // Informs the server about the data format
            },
            body: JSON.stringify({jwt: token, eventID: eventID})
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
        console.log("Start"  + startTime, " End: " + endTime)
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
                                <Text>X</Text>
                            </Pressable>
                            
                        </View>
                        
                        <Text className='text-center mt-5 font-bold'>{name}</Text>
                        <Text className='text-center mt-3'>{description}</Text>
                        <View className='mb-6 py-1 px-5 mt-4'>
                        {
                            !attended ? (<Pressable className='bg-white py-1 px-5' onPress={handleEventAttend}>
                                <Text className=''>Mark as attended</Text>
                            </Pressable>) : (<Pressable onPress={handleEventLeave}>
                                <Text className=''>Mark as unattended</Text>
                            </Pressable>)
                        }

                        {cr ? (<View className='bg-white mb-6 py-1 px-5 mt-4'>
                                                    <Pressable onPress={handleEventDeletion}>
                                                        <Text className='text-center'>Delete</Text>
                                                    </Pressable>
                                            </View>) : <View className=''></View>}
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