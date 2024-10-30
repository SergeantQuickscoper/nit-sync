import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router"
import { useEffect, useState } from "react";

const SigninInput = ({recievedParams} : any) => {
    const params = recievedParams;
    const [isLocked, setIsLocked] = useState(true)
    const [isValidEmail, setIsValidEmail] = useState(true); //ONLY for checking email domain (empty email is considered valid)
    const [email, setEmail] = useState((params.registeredEmail ? params.registeredEmail.toString() : "" )); 

    useEffect(() => {
        if(isValidEmail == true && email != ""){
            setIsLocked(false)
            router.setParams({ registeredEmail : email })
        }
        else{
            setIsLocked(true)
        }
    }, [isValidEmail])

    const checkValidity = async (email:string) => {
        if(email.split("@")[1] == "student.nitw.ac.in" || email == ""){
            setIsValidEmail(true)
        }
        else{
            setIsValidEmail(false)
        }
        
    }
    const handleChange = async(text:any) => {
        setEmail(text);
        checkValidity(text);
    }

    const handlePress = () => {
        if(isLocked){
            return
        }
        router.push({ pathname: "/OTPScreen", params: { registeredEmail : email } });
    }    

    return(
        <View className='flex-1 items-center mt-28 mt'>
                <Text className='text-2xl font-bold'>Welcome to the one-stop solution</Text>
                <Text className='text-2xl font-bold'>for your schedule</Text>
                {/* The margin top here has to be increased for uniformity between the pages changing it by 2 should be fine i think*/}
                <Text className='mt-20 text-[1.33rem] font-bold'>Sign up for NITSync</Text>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 mt-5 rounded-full bg-white shadow-sm'>
                    <TextInput value={email} onChangeText={(text) => handleChange(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Institute Email" placeholderTextColor={"black"} />
                </SafeAreaView>

                <View className="w-[22rem] mt-2 h-auto">
                    {isValidEmail ? <Text > </Text> : <Text className=" text-red-500 ml-3 font-medium">Invalid Institute Student Email</Text>}
                </View>
                


                <View className='mt-8 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                        {/*Add condiitionality for if institute email is valid or not*/}
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => handlePress()}>
                            <Text className='text-white font-bold text-lg'>Sign Up</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                <SafeAreaView className='w-80 mt-4 items-center'>
                    <Pressable className='mr-2' onPress={() => router.replace("/")}>
                        <Text className='text-[#0000FF] underline text-lg'>Already a User? Log in Here</Text>
                    </Pressable>
                </SafeAreaView>
                
            </View>
    )
}

export default SigninInput;