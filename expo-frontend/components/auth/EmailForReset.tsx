import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"

const EmailForReset = () => {
    return(
        <View className='flex-1 items-center mt-28'>
              <Text className="mt-4 font-bold text-xl">Enter your registered Email</Text> 

            <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 mt-5 rounded-full bg-white shadow-sm justify-center'>
                <TextInput className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Email" placeholderTextColor={"black"} />
            </SafeAreaView>
                
            <View className='mt-8 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => router.replace("/PasswordResetOTPScreen")}>
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