import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import SubjectComponent from '@/components/timetable/SubjectComponent'
import { ScrollView } from 'react-native-gesture-handler'
import NavigationBar from '@/components/timetable/NavigationBar'
import CreateSubjectButton from '@/components/timetable/CreateSubjectButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { io } from 'socket.io-client';


export default function subjects() {
  const [subjectList, setSubjectList] = useState([])
  const [refetch, setRefetch] = useState(1)
  const [cr, setCR] = useState(false);
  const [joinedSubList, setJoinedSubList] = useState([])
  
  
  useFocusEffect(React.useCallback(() => {
    
    const getData = async() => {
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
      console.log("Refetching")
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
            setSubjectList(data.subjectArray)
        }
      })

      await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getJoinedSubjects', {
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
            console.log("fetching joined wor")
            console.log("Joined subjects: " +  data.joinedSubjectList)
            setJoinedSubList(data.joinedSubjectList)
        }
      })
    }

    
    

    getData();

  }, [refetch]))

  //this guy will look for server updates
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
    
    socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

          // Listen for server updates
        socket.on('subjectUpdate', (data) => {
            console.log('Update received:', "Subject Added");
            setRefetch((val) => val * -1);
            console.log(refetch) // oscillator that keeps the updates coming
          });
        
        return socket;  
    }

    checkIsCR()

    let socketObj : any;

    (async() => {
      socketObj = await socketConnection();
    })();

    return () => {
      socketObj.disconnect();
      console.log("Disconnected from the server")
    }
    

    // this fucked up code needs fixing bad who knows how expensive this would be at scale


  }, []))


  return (
    <View className='flex-1 bg-[#F7F7F7] border'>
      <View className="header mb-2 mt-14 flex-row justify-between mx-4 items-center">
                <NavigationBar />
                <Text className="font-bold text-lg">
                    Subjects
                </Text>
                {cr ? <CreateSubjectButton /> : <View className="w-[16px]"></View>}
      </View>
      <ScrollView >
        <View className='flex-1 flex-row flex-wrap mt-4'>
            {subjectList.map((subject : any) => {
              console.log(subject)
              let joined = false
              let i : any;
              //linear search
              for(i of joinedSubList){
                if(subject.subject_id == i.subject_id){
                  joined = true;
                }
              }
              return <SubjectComponent name={subject.subject_name} subjectID={subject.subject_id} description={subject.description} cr={cr} refresher={setRefetch} joined={joined}/>
            })}
        </View>
      </ScrollView>
      
    </View>
  )
}