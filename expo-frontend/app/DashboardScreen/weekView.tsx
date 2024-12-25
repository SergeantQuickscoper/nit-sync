import { View, Text } from 'react-native'
import React from 'react'
import CreateReoccuringEvent from '@/components/timetable/CreateReoccuringEventButton'
import NavigationBar from '@/components/timetable/NavigationBar'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import ScheduleComponent from '@/components/timetable/ScheduleComponent'
import ReooccuringScheduleComponent from '@/components/timetable/ReoccuringScheduleComponent'
export default function weekView() {
  const [cr, setCR] = useState(false)
  const [mondayEvents, setMondayEvents] = useState([])
  const [tuesdayEvents, setTuesdayEvents] = useState([])
  const [thursdayEvents, setThursdayEvents] = useState([])
  const [fridayEvents, setFridayEvents] = useState([])
  const [saturdayEvents, setSaturdayEvents] = useState([])
  const [sundayEvents, setSundayEvents] = useState([])
  const [refetch, setRefetch] = useState(1); //refresher oscillator
  const [subArrProp, setsubArrProp] = useState([])

  useFocusEffect(React.useCallback(() => {
    const checkIsCR = async() => {
        const isCR = await AsyncStorage.getItem("isCR");
        if(isCR == "true"){
            setCR(true)
        }

    }
    const socketConnection = async() => {
      let token :any;
      token = await AsyncStorage.getItem("jwt")

      const socket = io(process.env.EXPO_PUBLIC_AUTH_SERVER, {
          auth: {
              jwt: token
          }
      });

    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('message', 'Hello from client!');
    })
        
        socket.on('connect_error', (error : any) => {
        console.error('Connection error:', error.message);

    });

      // Listen for server updates
    socket.on('eventUpdate', (data : any) => {
        console.log('Update received:', "Event Added");
        setRefetch((val) => val * -1);
        console.log(refetch)
      });
    
    return socket;  
  }
        checkIsCR()

        let socketObj : any;

        //establish a socket connection too
        (async() => {
            socketObj = await socketConnection();
          })();
        
          return () => {
            socketObj.disconnect();
            console.log("Disconnected from the serve")
          }
}, []))

  useFocusEffect(React.useCallback(() => {
    const getData = async() => {
      let token :any;
      token = await AsyncStorage.getItem("jwt")
      await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getReoccuringEventView', {
        method: 'POST', // Specifies a POST request
        headers: {
          'Content-Type': 'application/json', // Informs the server about the data format
        },
        body: JSON.stringify({jwt: token})
      })
      .then((res) => res.json())
      .then(async(data) => {
        if(data.success == false){
            console.log(data.message)
        }
        else{
            console.log(data.reoccuringEvents)
            const mondayEvents = [];
            const tuesdayEvents = [];
            const wednesdayEvents = [];
            const thursdayEvents = [];
            const fridayEvents = [];
            const saturdayEvents = [];
            const sundayEvents = [];

            for(let i of data.reoccuringEvents){
              console.log("hey")
              
        }
      }});

      await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getSubjects', {
          method: 'POST', // Specifies a POST request
          headers: {
            'Content-Type': 'application/json', // Informs the server about the data format
          },
          body: JSON.stringify({jwt: token})
        })
        .then((res) => res.json())
        .then(async(data) => {
          if(data.success == false){
              console.log(data.message)
          }
          else{
              console.log(data.subjectArray)
              const subjectArrProp : any = []
              for(let i of data.subjectArray){
                  subjectArrProp.push({label: i.subject_name, value: i.subject_id})
              }
              setsubArrProp(subjectArrProp)
          }
        })
    }

    getData()
  }, [refetch]))

 const printTimes = (start:number, end:number) => {
        const baseRem = 16; //one rem is 16 pixels 
        const spacing = 2.5;
        let counter = 1;
        let timeArray = []
        for(let i = start; i <= end; i++){
            timeArray.push(<Text className={"text-center"} style={{ marginTop: baseRem * spacing,lineHeight: 24 }}>{i}:00</Text>)
            counter++;
        }

        return timeArray;
    }




  return (
    <View className='flex-1 bg-[#F7F7F7]'>
      <View className="header mb-2 mt-14 flex-row justify-between mx-4 items-center">
        <NavigationBar />
         <Text className="font-bold">
            Weekly Timetable
          </Text>
          {true ? <CreateReoccuringEvent subjectDropdown={subArrProp}/> : <View className="w-[16px]"></View>}
      </View>
      <ScrollView>
                  <View className="calendar flex-row mb-7">
                      <View className=" w-[12.5%] pb-7">
                          {printTimes(5, 21)}
                      </View>
                      <View className="border-l w-[87.75%] px-2">
                          <View className='flex-row justify-between h-full'>
                            <View className='border w-[12.5%]'>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Mon</Text>
                                
                            </View>
                            <View className='border w-[12.5%]'>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Tue</Text>
                                
                            </View>
                            <View className='border w-[12.5%]'>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Wed</Text>
                            </View>
                            <View className='border w-[12.5%]'>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Thu</Text>
                                <ReooccuringScheduleComponent name="PDS" startTime="20:00" endTime="21:00"/>
                            </View>
                            <View className='border w-[12.5%]'>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Fri</Text>
                            </View>
                            <View className='border w-[12.5%]'>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Sat</Text>
                            </View>
                            <View className='border w-[12.5%] '>
                                <Text className='text-center absolute' style={{lineHeight: 24, left: 0, right: 0}}>Sun</Text>
                            </View>
                          </View>
                          

                      </View>
                  </View>
      </ScrollView>
    </View>
  )
}