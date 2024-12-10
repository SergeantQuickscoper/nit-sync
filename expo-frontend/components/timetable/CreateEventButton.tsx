import { View, Text, Pressable, Image, Modal, SafeAreaView, Platform} from 'react-native'
import React from 'react'
import { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import {Picker} from '@react-native-picker/picker';
import DropdownComponent from './DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const [eventName, setEventName] = useState("")
  const [subjectID, setSubjectID] = useState();
  const [description, setDescription] = useState();
  const [eventType, setEventType] = useState();
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTIme] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [errorMessage, setErrorMessage] = useState()

  const onChangeDate = (event : any, selectedDate : any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    if(event.type == "set") {
        
    } else {
        //cancel button clicked
    }
  };

  const onChangeStartTime = (event : any, selectedDate : any) => {
    const currentDate = selectedDate;
    setStartTime(currentDate);
  };

  const onChangeEndTime = (event : any, selectedDate : any) => {
    const currentDate = selectedDate;
    setEndTIme(currentDate);
  };
  const showMode = (currentMode : any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

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
                            <TextInput value={eventName} onChange={(text : any) => setEventName(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Event Name" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        
                        <View className='mt-5'>
                        <Text className='ml-3'>Description</Text>
                        <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                            <TextInput value={description} onChange={(text : any) => setDescription(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Description" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        <View className='mt-5 w-[18rem]'>
                            <Text className='ml-3'>Select Subject</Text>
                            <DropdownComponent data={[{label: "PDS", value: "1"}, {label: "EP", value: "2"}, {label: "ETC", value: "3"}]}/>
                        </View>

                        <View className='mt-5 w-[18rem]'>
                            <Text className='ml-3'>Select Type</Text>
                            <DropdownComponent data={[{label: "Class", value: "1"}, {label: "Minor", value: "2"}, {label: "Assignment", value: "3"}]}/>
                        </View>

                        <View className='mt-5'>
                            <Modal visible={show}>
                                        <View className='flex-1 justify-center items-center'>
                                            <View className='flex-row'>
                                                <View>
                                                    <Text className='mb-2 ml-1'>Event Date</Text>
                                                    {(Platform.OS == "ios") && (
                                                        <DateTimePicker
                                                        testID="dateTimePicker"
                                                        value={date}
                                                        mode={"date"}
                                                        is24Hour={true}
                                                        onChange={onChangeDate}
                                                        />
                                                    )
                                                    }

                                                </View>
                                                
                                                <View className='mx-3 flex-col items-start '>
                                                    <Text className='mb-2 ml-4'>Start Time</Text>
                                                    {
                                                        (Platform.OS == "ios") && (<DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={startTime}
                                                            mode={"time"}
                                                            is24Hour={true}
                                                            onChange={onChangeStartTime}
                                                            />)
                                                    }
                                                    
                                                </View>
                                                <View>
                                                    <Text className='mb-2 ml-4'>End Time</Text>
                                                    {(Platform.OS == "ios") && (
                                                            <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={endTime}
                                                            mode={"time"}
                                                            is24Hour={true}
                                                            onChange={onChangeEndTime}
                                                            />
                                                    )}
                                                    
                                                </View>
                                            </View>
                                            
                                        <Pressable onPress={() => setShow(false)} className='mt-5'>
                                            <Text>Select</Text>
                                        </Pressable>
                                        </View>
                                        
                            </Modal>
                            <Pressable className="" onPress={() => setShow(true)} >
                                <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                                    <TextInput onPress={() => setShow(true)} value={date.toDateString().split(" ")[0] + " " + date.toDateString().split(" ")[1] + " " + date.toDateString().split(" ")[2] + " - "  + startTime.toTimeString().split(":")[0] + ":" + startTime.toTimeString().split(":")[1] + " to "  + endTime.toTimeString().split(":")[0] + ":" + endTime.toTimeString().split(":")[1]} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Event Date" placeholderTextColor={"black"} />
                                </SafeAreaView>
                            </Pressable>
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