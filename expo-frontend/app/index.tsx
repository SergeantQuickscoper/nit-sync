import {Text, View, Image, TextInput, SafeAreaView, Pressable, ScrollView} from 'react-native'
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LogoAuth from "../components/auth/LogoAuth"
import LoginInput from '@/components/auth/LoginInput';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginScreen = () => {

    useEffect(() => {
        const checkToken = async() => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            try {
                const token = await AsyncStorage.getItem('jwt');
                const isCR = await AsyncStorage.getItem('isCR')
                if (token && isCR != undefined) {
                  await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/getSubjects', {
                    method: 'POST', // Specifies a POST request
                    headers: {
                      'Content-Type': 'application/json', // Informs the server about the data format
                    },
                    body: JSON.stringify({jwt: token}),
                    signal: controller.signal
                  })
                  .then((res) => {
                    clearTimeout(timeout)
                    if(!res.ok){
                      throw new Error("Network error?");
                    }
                    return res.json();
                  })
                  .then(async(data) => {
                    if(data.success == false && data.message == "invalid signature"){
                        await AsyncStorage.clear();
                        console.log("hi")
                    }
                    else{
                      router.push({ pathname: "/DashboardScreen", params: { registeredEmail : token, isCR: isCR} });
                    }
                  })
                  .catch((error) =>{
                    console.log("Fetch Error: ", error)
                  })
                  
                } else {
                  console.log('No token found');
                }
              } catch (error) {
                console.error('Error retrieving token', error)
              }
        }

        console.log("useEffect Works")
        checkToken()

      }, []);

    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <ScrollView>
                <LogoAuth />
                <LoginInput />
            </ScrollView>
        </View>
    )
}

export default LoginScreen;
