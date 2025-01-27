import { View, Text } from 'react-native'
import React, { Component, ComponentElement } from 'react'
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
  const [wednesdayEvents, setWednesdayEvents] = useState([])
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
    socket.on('reoccuringEventUpdate', (data : any) => {
        console.log('Update received:', "Event Added");
        setRefetch((val) => val * -1);
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

  const checkOverlapAndMark = (eventsList : any) => {

    for(let j = 0; j < eventsList.length; j++){
      let numericISOstart = Number(eventsList[j].start_time.split(":")[0])*100 + Number(eventsList[j].start_time.split(":")[1]);
      let numericISOend = Number(eventsList[j].end_time.split(":")[0])*100 + Number(eventsList[j].end_time.split(":")[1]);

      for(let i = j + 1; i < eventsList.length; i++){
        let numericISOstartCurr = Number(eventsList[i].start_time.split(":")[0])*100 + Number(eventsList[i].start_time.split(":")[1]);
        let numericISOendCurr = Number(eventsList[i].end_time.split(":")[0])*100 + Number(eventsList[i].end_time.split(":")[1]);
  
        if(((numericISOstart < numericISOstartCurr && numericISOend > numericISOstartCurr) || (numericISOstart < numericISOendCurr && numericISOend > numericISOendCurr)) && eventsList[i].reoccuring_day == eventsList[j].reoccuring_day){
            console.log("MADE IT HERE BITCHHHHHH")
            eventsList[i].overlap = true;
            eventsList[j].overlap = true;
        }
      }
      
    }
  }

  useFocusEffect(React.useCallback(() => {
    const getData = async() => {
      let token :any;
      token = await AsyncStorage.getItem("jwt")
      let tempCRCheck = await AsyncStorage.getItem("isCR");
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

            //This is so disgusting it makes me want to kms just improve
            const mondayEventsList : any = [];
            const tuesdayEventsList : any = [];
            const wednesdayEventsList : any = [];
            const thursdayEventsList : any = [];
            const fridayEventsList : any = [];
            const saturdayEventsList : any = [];
            const sundayEventsList : any = [];
            
            for(let i of data.reoccuringEvents){
              console.log("I AM I ", i)
              const startTime = new Date(i.start_time);
              const endTime = new Date(i.end_time);
              startTime.setTime(startTime.getTime() + 5.5 * 60 * 60 * 1000)
              endTime.setTime(endTime.getTime() + 5.5 * 60 * 60 * 1000)

              let startISO = startTime.toISOString().split("T")[1]
              let endISO  = endTime.toISOString().split("T")[1]
              if(startISO[0] == '0'){
                  startISO = startISO.slice(1, 5)
              }
              else{
                 startISO = startISO.slice(0, 5)
              }
              if(endISO[0] == '0'){
                 endISO = endISO.slice(1, 5)
              }
              else{
                endISO = endISO.slice(0, 5)
              }
              
              //IK IK THIS MANIPULATES THE FETCHED DATA AND IS BAD TO DO but so idc at this point
              i.start_time = startISO;
              i.end_time = endISO;
            }

            checkOverlapAndMark(data.reoccuringEvents);

            for(let i of data.reoccuringEvents){            
              
              let component = <ReooccuringScheduleComponent name={i.reoccuring_event_view_name} subjectID={i.subject_id} description={i.reoccuring_event_view_desc} startTime={i.start_time} endTime={i.end_time} cr={tempCRCheck} token={token} eventID ={i.reoccuring_event_view_id} refresher={setRefetch} overlap={i.overlap} />
              if(i.overlap){
                console.log(component)
              }
              switch(i.reoccuring_day){
                case "monday":
                    mondayEventsList.push(component)
                  break;
                case "tuesday":
                    tuesdayEventsList.push(component)
                  break;
                case "wednesday":
                    wednesdayEventsList.push(component)
                  break;
                case "thursday":
                    thursdayEventsList.push(component)
                  break;
                case "friday":
                    fridayEventsList.push(component)
                  break;
                case "saturday":
                    saturdayEventsList.push(component)
                  break;
                case "sunday":
                    sundayEventsList.push(component)
                  break;
              }
              
              
          }

          setMondayEvents(mondayEventsList);
          setTuesdayEvents(tuesdayEventsList);
          setWednesdayEvents(wednesdayEventsList);
          setThursdayEvents(thursdayEventsList);
          setFridayEvents(fridayEventsList);
          setSaturdayEvents(saturdayEventsList);
          setSundayEvents(sundayEventsList);
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
      <View className="header mb-2 mt-14 flex-row justify-between ml-4 mr-2 items-center">
        <NavigationBar />
         <Text className="font-bold ml-4">
            Weekly Timetable
          </Text>
          {cr ? <CreateReoccuringEvent subjectDropdown={subArrProp}/> : <View className="p-4"><View className="w-[16px]"></View></View>}
      </View>
      <ScrollView>
                  <View className="calendar flex-row mb-7">
                      <View className=" w-[12.5%] pb-7">
                          {printTimes(5, 21)}
                      </View>
                      <View className="border-l w-[87.75%] px-2">
                          <View className='flex-row justify-between h-full'>
                            <View className='w-[12.5%]'>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Mon</Text>
                                {mondayEvents}
                            </View>
                            <View className='w-[12.5%]'>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Tue</Text>
                                {tuesdayEvents}
                            </View>
                            <View className='w-[12.5%]'>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Wed</Text>
                                {wednesdayEvents}
                            </View>
                            <View className=' w-[12.5%]'>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Thu</Text>
                                {thursdayEvents}
                            </View>
                            <View className=' w-[12.5%]'>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Fri</Text>
                                {fridayEvents}
                            </View>
                            <View className=' w-[12.5%]'>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Sat</Text>
                                {saturdayEvents}
                            </View>
                            <View className=' w-[12.5%] '>
                                <Text className='text-center absolute font-bold' style={{lineHeight: 24, left: 0, right: 0}}>Sun</Text>
                                {sundayEvents}
                            </View>
                          </View>
                      </View>
                  </View>
      </ScrollView>
    </View>
  )
}