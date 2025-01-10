import { View, Text, Pressable, Image, Modal, SafeAreaView, Platform} from 'react-native'
import { StyleSheet } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import DropdownComponent from './DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CreateEventButton({subjectDropdown} : any) {
  const [modalOpen, setModalOpen] = useState(false)
  const [showDateAndroidPicker, setDateShowAndroidPicker] = useState(false)
  const [showStartTimeAndroidPicker, setShowStartTimeAndroidPicker] = useState(false)
  const [showEndTimeAndroidPicker, setShowEndTimeAndroidPicker] = useState(false)
  const [eventName, setEventName] = useState("")
  const [isFocusDrop1, setIsFocusDrop1] = useState(false);
  const [isFocusDrop2, setIsFocusDrop2] = useState(false)
  const [subjectID, setSubjectID] = useState();
  const [description, setDescription] = useState();
  const [eventType, setEventType] = useState();
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTIme] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState()

  useFocusEffect(React.useCallback(() =>{
      startTime.setHours(9, 0, 0);
      endTime.setHours(10, 0, 0);
  }, []))
  const onChangeDate = (event : any, selectedDate : any) => {
    setDateShowAndroidPicker(false)
    console.log(selectedDate)
    let currentDate = new Date(selectedDate);;
    startTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    endTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    setDate(currentDate);
  };

  const onChangeStartTime = (event : any, selectedDate : any) => {
    setShowStartTimeAndroidPicker(false)
    let currentDate = new Date(selectedDate);
    currentDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setStartTime(currentDate);
  };

  const onChangeEndTime = (event : any, selectedDate : any) => {
    setShowEndTimeAndroidPicker(false)
    let currentDate = new Date(selectedDate);
    currentDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    console.log(currentDate)
    setEndTIme(currentDate);
  };

  const onCreateEvent = async() =>  {
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
                return;
            }

            await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/createEvent', {
              method: 'POST', // Specifies a POST request
              headers: {
                'Content-Type': 'application/json', // Informs the server about the data format
              },
              body: JSON.stringify({jwt: token, eventName: eventName, description: description, subjectID: subjectID, eventType: eventType, startTime, endTime })
            })
            .then((res) => res.json())
            .then(async(data) => {
              if(data.success == false) {
                console.log(data.message)
              }
              else {
                    console.log(data.message)
                  }
              })

            setModalOpen(false)
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
                            <TextInput value={eventName} onChangeText={(text : any) => setEventName(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Event Name" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        
                        <View className='mt-5'>
                        <Text className='ml-3'>Description</Text>
                        <SafeAreaView className='flex-1 items-center w-[18rem] max-h-10 mt-1 rounded-full bg-white shadow-sm'>
                            <TextInput value={description} onChangeText={(text : any) => setDescription(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Description" placeholderTextColor={"black"} />
                        </SafeAreaView>
                        </View>
                        <View className='mt-5 w-[18rem]'>
                            <Text className='ml-3'>Select Subject</Text>
                            <View style={styles.container}>
                                  <Dropdown
                                    style={[styles.dropdown, isFocusDrop1 && { borderColor: '#00FF11' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={subjectDropdown}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocusDrop1 ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={subjectID}
                                    onFocus={() => setIsFocusDrop1(true)}
                                    onBlur={() => setIsFocusDrop1(false)}
                                    onChange={(item : any) => {
                                      setSubjectID(item.value);
                                      console.log(eventName)
                                      console.log(description)
                                      setIsFocusDrop1(false);
                                    }}
                                  />
                                </View>
                        </View>

                        <View className='mt-5 w-[18rem]'>
                            <Text className='ml-3'>Select Type</Text>
                            <View style={styles.container}>
                            
                                  <Dropdown
                                    style={[styles.dropdown, isFocusDrop2 && { borderColor: '#00FF11' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={[{label: "Class", value: "class"}, {label: "Minor", value: "minor"}, {label: "Assignment", value: "assignment"}]}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocusDrop2 ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={eventType}
                                    onFocus={() => setIsFocusDrop2(true)}
                                    onBlur={() => setIsFocusDrop2(false)}
                                    onChange={(item : any) => {
                                      setEventType(item.value);
                                      setIsFocusDrop2(false);
                                    }}
                                  />
                                </View>
                        </View>

                        <View className='mt-5'>
                            <Modal visible={show}>
                                        <View className='flex-1 justify-center items-center px-10'>
                                            <View className='flex-row justify-between w-full'>
                                                <View className=''>
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
                                                    {
                                                        (Platform.OS == "android") && (
                                                            <SafeAreaView className='flex-1 items-center min-h-10 mt-1 rounded-full bg-white shadow-sm'>
                                                                <TextInput onPress={() => setDateShowAndroidPicker(true)} value={date.toDateString()} placeholder="Select Date" placeholderTextColor={"black"} />
                                                                {
                                                                    (showDateAndroidPicker && 
                                                                        (
                                                                            <DateTimePicker
                                                                            testID="dateTimePicker"
                                                                            value={date}
                                                                            mode={"date"}
                                                                            is24Hour={true}
                                                                            onChange={onChangeDate}
                                                                            />
                                                                        )
                                                                    )
                                                                }
                                                            </SafeAreaView>
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
                                                    {
                                                        (Platform.OS == "android") && (
                                                            <SafeAreaView className='flex-1 items-center min-h-10 mt-1 rounded-full bg-white shadow-sm mx-3'>
                                                                <TextInput onPress={() => {setShowStartTimeAndroidPicker(true)}} value={startTime.toTimeString().split(":")[0] + ":" + startTime.toTimeString().split(":")[1]} placeholder="Select Date" placeholderTextColor={"black"} />
                                                                {
                                                                    
                                                                    (showStartTimeAndroidPicker && 
                                                                        (
                                                                            <DateTimePicker
                                                                            testID="dateTimePicker"
                                                                            value={startTime}
                                                                            mode={"time"}
                                                                            is24Hour={true}
                                                                            onChange={onChangeStartTime}
                                                                            />
                                                                        )
                                                                        )
                                                                    
                                                                }
                                                            </SafeAreaView>
                                                        )
                                                    }
                                                    
                                                </View>
                                                <View className='mx-2'>
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

                                                    {
                                                        (Platform.OS == "android") && (
                                                            <SafeAreaView className='flex-1 items-center min-h-10 mt-1 rounded-full bg-white shadow-sm ml-4'>
                                                                <TextInput onPress={() => {setShowEndTimeAndroidPicker(true)}} value={endTime.toTimeString().split(":")[0] + ":" + endTime.toTimeString().split(":")[1]} placeholder="Select Date" placeholderTextColor={"black"} />
                                                                {
                                                                (showEndTimeAndroidPicker && 
                                                                    (
                                                                        <DateTimePicker
                                                                        testID="dateTimePicker"
                                                                        value={endTime}
                                                                        mode={"time"}
                                                                        is24Hour={true}
                                                                        onChange={onChangeEndTime}
                                                                        />
                                                                    )
                                                                )
                                                            }

                                                            </SafeAreaView>
                                                            
                                                        )
                                                    }      
                                                    
                                                </View>
                                            </View>
                                            
                                        <Pressable onPress={() => setShow(false)} className='mt-10'>
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
                        <Pressable onPress={onCreateEvent}>
                            <Text className=''>Create</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 8,
    marginTop: 5
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingHorizontal: 8
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
  },
});