import { View, Text, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SubjectComponent({subjectID, name, description, joined}:any) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
        <View className='rounded-lg bg-[#E26161] w-32 h-24 px-2 py-2 mx-3 my-2'>
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
                            <Text className=''>Join</Text>
                        </Pressable>
                    </View>
                    </View>
                    
                </View>
            </Modal>
            <Pressable className=' h-full w-full' onPress={() => setModalOpen(true)}>
                <Text className='text-white font-bold'>{name}</Text>
            </Pressable>
        </View>
  )
}