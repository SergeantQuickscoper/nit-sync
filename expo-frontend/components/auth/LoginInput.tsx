import {View, Text, Image, SafeAreaView, TextInput, Pressable, ScrollView} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginInput = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLocked, setIsLocked] = useState(true)

    const handleEmailChange = (text:string) => {
        setEmail(text)
    }

    const handlePassChange = (text:string) => {
        setPassword(text)
    }

    useEffect(() => {
        if(email != "" && password != ""){
            setIsLocked(false)
            console.log(isLocked)
        }
        else{
            setIsLocked(true)
            console.log(isLocked)
        }
    }, [email, password])

    const handleLoginPress = async() => {
        console.log(isLoading);
        if(isLocked){
            return;
        }
        console.log("Loading");
        setIsLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER + '/login', {
            method: 'POST', // Specifies a POST request
            headers: {
              'Content-Type': 'application/json', // Informs the server about the data format
            },
            body: JSON.stringify({email : email, password : password}),
            signal: controller.signal
          })
          .then((res) => {
            clearTimeout(timeout);
            console.log(res.status);
            return res.json();
          })
          .then(async(data) => {
            if(data.success == false){
                setErrorMessage(data.message);
            }
            else{
                try {
                    let isCR;
                    if(data.isCR){
                        isCR = "true"
                    }
                    else{
                        isCR = "false"
                    }
                    await AsyncStorage.setItem("jwt", data.jwt);
                    await AsyncStorage.setItem("isCR", isCR); // caveat that AsyncStorage should be strings
                  } catch (error) {
                    console.error('Error saving data:', error);
                  }
                router.push({ pathname: "/DashboardScreen", params: { jwt : data.jwt } }); //make this jwt
            }
          })
          .catch((error) =>{
            setErrorMessage(error.message);
            setIsLoading(false);
          })
          setIsLoading(false);
    }


    return(
        <View className='flex-1 items-center mt-32'>
            
                <Text className='text-[1.33rem] font-bold'>Login to NITsync</Text>

                <SafeAreaView className='flex-1 items-center w-[22rem] min-h-11 mt-5 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='h-full w-11/12 px-2 text-lg leading-tight' onChangeText={(text) => handleEmailChange(text)} placeholder="Email" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] min-h-11 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput secureTextEntry={true} className='w-11/12 px-2 text-lg leading-tight' onChangeText={(text) => handlePassChange(text)} placeholder="Password" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='w-[22rem] mt-3 flex-row justify-between'>
                    <Text className=" text-red-500 font-medium text-base">{errorMessage}</Text>
                    <Pressable className='mr-2' onPress={() => router.replace("/EnterEmailForVerificationScreen")}>
                        <Text className='text-[#0000FF] underline text-base'>Forgot Password?</Text>
                    </Pressable>
                </SafeAreaView>

                <View className='mt-10 rounded-full shadow-sm max-h-11 min-h-11'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999, height: 44}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] justify-center'>
                         {!isLoading ? <Pressable className='flex items-center justify-center h-full w-full' onPress={() => handleLoginPress()}>
                            <Text className='text-white font-bold text-xl'>Login</Text>
                        </Pressable> : <Text className="text-white text-xl">Please Wait...</Text>}
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                <SafeAreaView className='w-80 mt-4 items-center'>
                    <Pressable className='mr-2' onPress={() => router.replace("/SignUpScreen")}>
                        <Text className='text-[#0000FF] underline text-lg'>New User? Sign up here</Text>
                    </Pressable>
                </SafeAreaView>
            </View>
    )
}

export default LoginInput;