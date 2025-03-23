import { View, Text, Pressable, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubjectComponent({subjectID, name, description, joined, cr, refresher}:any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubjectDeletion = async() => {
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
      await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/deleteSubject', {
        method: 'POST', // Specifies a POST request
        headers: {
          'Content-Type': 'application/json', // Informs the server about the data format
        },
        body: JSON.stringify({jwt: token, subjectID: subjectID})
      })
      .then((res) => res.json())
      .then(async(data) => {
        if(data.success == false){
            console.log(data.message)
        }
        else{
            console.log(subjectID)
            refresher((hello :any) => hello + 1);
            setModalOpen(false)
        }
      })
    }

    const handleJoinSubject = async() => {
      setIsLoading(true);
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
          await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/joinSubject', {
            method: 'POST', // Specifies a POST request
            headers: {
              'Content-Type': 'application/json', // Informs the server about the data format
            },
            body: JSON.stringify({jwt: token, subjectID: subjectID})
          })
          .then((res) => res.json())
          .then(async(data) => {
            if(data.success == false){
                console.log(data.message)
            }
            else{
                console.log(subjectID)
                refresher((hello :any) => hello + 1);
            }
          })
          setIsLoading(false);
        }

        const handleLeaveSubject = async() => {
            setIsLoading(true);
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
              await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/leaveSubject', {
                method: 'POST', // Specifies a POST request
                headers: {
                  'Content-Type': 'application/json', // Informs the server about the data format
                },
                body: JSON.stringify({jwt: token, subjectID: subjectID})
              })
              .then((res) => res.json())
              .then(async(data) => {
                if(data.success == false){
                    console.log(data.message)
                }
                else{
                    console.log(subjectID)
                    refresher((hello :any) => hello + 1);
                }
              })
              setIsLoading(false);
            }
  

  return (
        <View className='rounded-lg h-24 px-2 py-2 mx-3 my-2 w-[27.2%]' style={{backgroundColor: joined ? "#00FF11":"#E26161"}}>
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
                        <View className='bg-white mt-8 rounded-full'>
                        {
                            !isLoading ? (!joined ? (<Pressable className="py-2 px-5" onPress={handleJoinSubject}>
                                <Text className='font-bold'>Join</Text>
                            </Pressable>) : (<Pressable className="py-2 px-5" onPress={handleLeaveSubject}>
                                <Text className='font-bold text-green-500'>Joined</Text>
                            </Pressable>)) : <Text className="text-black text-base text-center leading-tight align-middle py-2 px-5">Please Wait...</Text>
                        }
                        
                        
                    </View>
                    {cr ? (<View className='bg-white mb-6 mt-4 rounded-full'>
                            <Pressable className="py-2 px-5" onPress={handleSubjectDeletion}>
                                <Text className='font-bold text-red-500'>Delete</Text>
                            </Pressable>
                    </View>) : <View className='mb-6'></View>}
                    </View>
                    
                </View>
            </Modal>
            <Pressable className=' h-full w-full' onPress={() => setModalOpen(true)}>
                <Text className='text-white font-bold'>{name}</Text>
            </Pressable>
        </View>
  )
}