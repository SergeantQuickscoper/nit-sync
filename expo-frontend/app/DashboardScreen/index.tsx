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

    const [date, setDate] = useState(new Date())
    const [paginationOffset, setPaginationOffset] = useState(0)
    const [eventsList, setEventsList] = useState([])
    const [cr, setCR] = useState(false);
    const [eventsJoinList, setEventsJoinList] = useState([])
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
                  console.log(data.subjectEventsObject)
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
                  console.log("Joined events: " +  data.attendedEvents)
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
            console.log('Update received:', "Subject Added");
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
    const params = useLocalSearchParams();    
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <View className="header mb-2 mt-14 flex-row justify-between mx-4 items-center">
                <NavigationBar />
                <Text className="font-bold">
                    {formattedDate}
                </Text>
                {cr ? <CreateEventButton /> : <View className="w-[16px]"></View>}
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
                    <ScheduleComponent className="" name="PDS" startTime="5:00" endTime="6:00"/>
                    <ScheduleComponent className="" name="PDS" startTime="6:00" endTime="7:00"/>
                    <ScheduleComponent className="" name="PDS" startTime="20:00" endTime="21:00"/>
                </View>
            </View>
            </ScrollView>
        </View>
    )
}

export default DashboardScreen;