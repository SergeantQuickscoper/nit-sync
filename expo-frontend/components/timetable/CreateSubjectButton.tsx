import { View, Text, Pressable, Image, Modal, SafeAreaView, Platform} from 'react-native'
import React from 'react'
import { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import {Picker} from '@react-native-picker/picker';
import DropdownComponent from './DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CreateSubjectButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const [subjectName, setsubjectName] = useState("")
  const [description, setDescription] = useState("");
  const [isLocked, setIsLocked] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")
  
  useEffect(() => {
    console.log(subjectName, description)
    if(subjectName != ""){
        setIsLocked(false)
        console.log(isLocked)
    }
    else{
        setIsLocked(true)
        console.log(isLocked)
    }
}, [subjectName])

  const onCreatePress = async() => {
    if(isLocked){
        return
    }

    let token;

    try {
        token = await AsyncStorage.getItem('jwt');
        if(!token){
            throw Error("Token not found")
        }
    } catch (error : any) {
        console.log(error.message)
        setErrorMessage(error.message);
        return;
    }

    await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/createSubject', {
        method: 'POST', // Specifies a POST request
        headers: {
          'Content-Type': 'application/json', // Informs the server about the data format
        },
        body: JSON.stringify({jwt: token, subjectName: subjectName, description: description})
      })
      .then((res) => res.json())
      .then(async(data) => {
        if(data.success == false){
            console.log(data.message)
            setErrorMessage(data.message);
        }
        else{
            setModalOpen(false)
            setDescription("")
            setsubjectName("");
            setErrorMessage("")
        }
      }) 
  }

  return (
    <View>
        <Modal visible={modalOpen} className='' transparent={true}>
                <View className='flex-1 justify-center items-center' style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <View className='bg-slate-400 w-[25rem] py-5 rounded-lg flex-col items-center justify-between px-4 relative'>
                        <View className='absolute top-2 left-2'>
                            <Pressable onPress={() => setModalOpen(false)}>
                                <Image source={require("@/assets/images/CloseButton.png")}/>
                            </Pressable>
                        </View>
                        
                        <Text className='text-center mt-5 font-bold'>Create Event</Text>
                        <View className='mt-5'>
                        <Text className='ml-3'>Event Name</Text>
                        <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                            <TextInput value={subjectName} onChangeText={(text : any) => setsubjectName(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Subject Name" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        
                        <View className='mt-5'>
                        <Text className='ml-3'>Description</Text>
                        <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                            <TextInput value={description} onChangeText={(text : any) => setDescription(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Description" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        <Text className=" text-red-500 font-medium text-base mt-2">{errorMessage}</Text>                                                
                        <View className='bg-white mt-10 mb-5 rounded-full'>
                        <Pressable className="py-2 px-5" onPress={onCreatePress}>
                            <Text className='font-bold'>Create</Text>
                        </Pressable>
                        </View>
                    </View>
                    
                </View>
        </Modal>
        <Pressable className="p-2" onPress={() => setModalOpen(true)}>
            <Image source={require("@/assets/images/CreateButton.png")}/>
        </Pressable>
    </View>
  )
}