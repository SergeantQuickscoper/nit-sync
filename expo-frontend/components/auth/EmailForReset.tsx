import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import { useEffect, useState } from "react";

const EmailForReset = ({recievedParams} : any) => {
    const params = recievedParams;
    const [email, setEmail] = useState(params.registeredEmail)
    const [isLocked, setIsLocked] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if(email != ""){
            setIsLocked(false)
        }
        else{
            setIsLocked(true)
        }
    }, [email])

    const handleChange = (text:string) => {
        setEmail(text)
    }

    const handlePress = async() => {
        if(isLocked){
            return;
        }

        setIsLocked(true)

        await fetch('http://172.30.42.89:8080/reqpassresetOTP', {
            method: 'POST', // Specifies a POST request
            headers: {
              'Content-Type': 'application/json', // Informs the server about the data format
            },
            body: JSON.stringify({email : email})
          })
          .then((res) => res.json())
          .then((data) => {
            if(data.success == false){
                setErrorMessage(data.message);
            }
            else{
                router.push({ pathname: "/PasswordResetOTPScreen", params: { registeredEmail : email } }); 
            }

            setIsLocked(false)

          })

    }
    return(
        <View className='flex-1 items-center mt-28'>
              <Text className="mt-4 font-bold text-xl">Enter your registered Email</Text> 

            <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 mt-5 rounded-full bg-white shadow-sm justify-center'>
                <TextInput className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Email" onChangeText={(text) => handleChange(text)} placeholderTextColor={"black"} />
            </SafeAreaView>

            <Text className=" text-red-500 font-medium text-base w-[22rem] mt-2">{errorMessage}</Text>
                
            <View className='mt-8 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => handlePress()}>
                            <Text className='text-white font-bold text-lg'>Request OTP</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
            <SafeAreaView className='w-80 mt-4 items-center'>
                    <Pressable className='mr-2' onPress={() => router.replace("/")}>
                        <Text className='text-[#0000FF] underline text-lg'>Back to Login</Text>
                    </Pressable>
            </SafeAreaView>
                
            </View>
    )
}

export default EmailForReset;