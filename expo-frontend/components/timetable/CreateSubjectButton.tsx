import { View, Text, Pressable, Image, Modal, SafeAreaView, Platform} from 'react-native'
import React from 'react'
import { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import {Picker} from '@react-native-picker/picker';
import DropdownComponent from './DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const [subjectName, setsubjectName] = useState("")
  const [description, setDescription] = useState();

  return (
    <View>
        <Modal visible={modalOpen} className='' transparent={true}>
                <View className='flex-1 justify-center items-center' style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <View className='bg-slate-400 w-[25rem] py-5 rounded-lg flex-col items-center justify-between px-4 relative'>
                        <View className='absolute top-2 left-2'>
                            <Pressable onPress={() => setModalOpen(false)}>
                                <Text>X</Text>
                            </Pressable>
                        </View>
                        
                        <Text className='text-center mt-5 font-bold'>Create Event</Text>
                        <View className='mt-5'>
                        <Text className='ml-3'>Event Name</Text>
                        <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                            <TextInput value={subjectName} onChange={(text : any) => setsubjectName(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Subject Name" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        
                        <View className='mt-5'>
                        <Text className='ml-3'>Description</Text>
                        <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                            <TextInput value={description} onChange={(text : any) => setDescription(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Description" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                                                
                        <View className='bg-white mt-10 py-1 px-5 mb-5'>
                        <Pressable>
                            <Text className=''>Create</Text>
                        </Pressable>
                        </View>
                    </View>
                    
                </View>
        </Modal>
        <Pressable onPress={() => setModalOpen(true)}>
            <Image source={require("@/assets/images/CreateButton.png")}/>
        </Pressable>
    </View>
  )
}