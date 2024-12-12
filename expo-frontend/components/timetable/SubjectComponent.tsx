import { View, Text, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubjectComponent({subjectID, name, description, joined, cr, refresher}:any) {
  const [modalOpen, setModalOpen] = useState(false);
  
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
        }

        const handleLeaveSubject = async() => {
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
            }
  

  return (
        <View className='rounded-lg w-32 h-24 px-2 py-2 mx-3 my-2' style={{backgroundColor: joined ? "#00FF11":"#E26161"}}>
            <Modal visible={modalOpen} className='' transparent={true}>
                <View className='flex-1 justify-center items-center' style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <View className='bg-slate-400 w-72 rounded-lg flex-col items-center justify-between px-4 relative'>
                        <View className='absolute top-2 left-2'>
                            <Pressable onPress={() => setModalOpen(false)}>
                                <Text>X</Text>
                            </Pressable>
                            
                        </View>
                        
                        <Text className='text-center mt-5 font-bold'>{name}</Text>
                        <Text className='text-center mt-3'>{description}</Text>
                        <View className='bg-white py-1 px-5 mt-4'>
                        {
                            !joined ? (<Pressable onPress={handleJoinSubject}>
                                <Text className=''>Join</Text>
                            </Pressable>) : (<Pressable onPress={handleLeaveSubject}>
                                <Text className=''>Joined</Text>
                            </Pressable>)
                        }
                        
                        
                    </View>
                    {cr ? (<View className='bg-white mb-6 py-1 px-5 mt-4'>
                            <Pressable onPress={handleSubjectDeletion}>
                                <Text>Delete</Text>
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