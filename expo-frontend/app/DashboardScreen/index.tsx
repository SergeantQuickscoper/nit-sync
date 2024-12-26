import {View, Text, Image, SafeAreaView, TextInput, Pressable, ScrollView, ImageBackground } from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import CompleteAccount from "@/components/auth/CompleteAccount";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { DrawerActions } from "@react-navigation/native";
import NavigationBar from "@/components/timetable/NavigationBar";
import ScheduleComponent from "@/components/timetable/ScheduleComponent";
import CreateEventButton from "@/components/timetable/CreateEventButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

const DashboardScreen = () => {
    const [subArrProp, setsubArrProp] = useState([])
    const [date, setDate] = useState(new Date())
    const [paginationOffset, setPaginationOffset] = useState(0);
    const [eventsList, setEventsList] = useState([])
    const [cr, setCR] = useState(false);
    const [eventsJoinList, setEventsJoinList] = useState()
    const [refetch, setRefetch] = useState(1); //refresher oscillator
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayOfWeek = daysOfWeek[date.getDay()]; 
    const month = months[date.getMonth()]; 
    const day = date.getDate(); 
    const year = date.getFullYear(); 

    useFocusEffect(React.useCallback(() => {
        //fetch events for the current date. 
        const getData = async() => {
            console.log("Refetching")
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

            
            
            await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getEventsOnDay', {
              method: 'POST', // Specifies a POST request
              headers: {
                'Content-Type': 'application/json', // Informs the server about the data format
              },
              body: JSON.stringify({jwt: token, day: date})
            })
            .then((res) => res.json())
            .then(async(data) => {
              if(data.success == false) {
                console.log(data.message)
              }
              else {
                  const object = data.subjectEventsObject
                  console.log(object)
                  let dayEvents : any = []
                  for(let i in object){
                    if (object.hasOwnProperty(i)) {
                        for(let j of object[i]){
                            // convert incoming utc time to ist (add 5 and a half hours to it)
                            const startTime = new Date(j.start_time);
                            const endTime = new Date(j.end_time);
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

                            dayEvents.push(<ScheduleComponent name={j.event_name} startTime={startISO} endTime={endISO} subjectID={j.subject_id} description={j.event_desc} cr={cr} token={token} eventID = {j.event_id} refresher={setRefetch}/>)
                        }
                      }
                  }

                  setEventsList(dayEvents)
              }
            })
      
            await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getAttendedEvents', {
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
                  //DO JOINED MESSAGE STUFF HERE
              }
            })
            
          }

          getData();

    }, [date, refetch]))

    useFocusEffect(React.useCallback(() => {
        const checkIsCR = async() => {
            const isCR = await AsyncStorage.getItem("isCR");
            if(isCR == "true"){
                setCR(true)
            }

        }

        let token :any;
        const socketConnection = async() => {
        token = await AsyncStorage.getItem("jwt")
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
        console.log("useFocusEffect works")
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
            console.log(refetch) // oscillator that keeps the updates coming
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
            console.log("Disconnected from the server")
          }


    }, []))

    const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;
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

    const handelDateButtonPress = (newDate:Date) => {
        setDate(newDate)
    }

    const printDateButtons = () => {
        let dateButtonArray = [];
        for(let i = 0; i < 8; i++){
            let currDate = new Date()
            let newDate = new Date();
            //TODO fix this fucked up code
            newDate.setDate(currDate.getDate() + i + paginationOffset)
            if(newDate.toDateString() == date.toDateString()){
                dateButtonArray.push(<Pressable className="mx-[0.6rem]  items-center" onPress={() => handelDateButtonPress(newDate)}>
                        <ImageBackground source={require("@/assets/images/currentDateBG.png")} resizeMode="contain"> 
                        <Text className="text-white font-bold p-1 w-7 items-center text-center">{newDate.getDate()}</Text>
                    </ImageBackground> 
                </Pressable>)
            }
            else{
                dateButtonArray.push(<Pressable className="mx-[0.6rem] w-5" onPress={() => handelDateButtonPress(newDate) }>
                    <Text className="font-bold">{newDate.getDate()}</Text>
                </Pressable>)
            }
            
        }

        return dateButtonArray;
    }

    




    //TODO in the future these guys should be handling animations
    const handeNext = () => {
        setPaginationOffset(paginationOffset + 8)
    }

    const handePrevious = () => {
        setPaginationOffset(paginationOffset - 8)
    }
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <View className="header mb-2 mt-14 flex-row justify-between mx-4 items-center">
                <NavigationBar />
                <Text className="font-bold">
                    {formattedDate}
                </Text>
                {cr ? <CreateEventButton subjectDropdown={subArrProp}/> : <View className="w-[16px]"></View>}
            </View>  
            <View className="dateScroll flex-row justify-between mx-8 my-4">
                <Pressable className="" onPress={handePrevious}>
                        <Image source={require("@/assets/images/leftArrow.png")}/>
                </Pressable>
                <View className="flex-row justify-between items-center">
                    {printDateButtons()}
                </View>
                <Pressable onPress={handeNext}>
                    <Image source={require("@/assets/images/rightArrow.png")}/>
                </Pressable>
            </View>
            <ScrollView>
            <View className="calendar flex-row mb-7">
                <View className=" w-1/5 pb-7">
                    {printTimes(5, 21)}
                </View>
                <View className="border-l w-4/5 relative">
                    {eventsList}
                </View>
            </View>
            </ScrollView>
        </View>
    )
}

export default DashboardScreen;