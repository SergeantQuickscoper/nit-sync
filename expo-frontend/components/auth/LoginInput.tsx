import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"

const LoginInput = () => {
    return(
        <View className='flex-1 items-center mt-32'>
                <Text className='text-[1.33rem] font-bold'>Login to NITsync</Text>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 mt-5 rounded-full bg-white shadow-sm justify-center'>
                    <TextInput className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Email" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='w-11/12 px-2 text-lg leading-tight' placeholder="Password" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='w-[22rem] mt-3 items-end'>
                    <Pressable className='mr-2'>
                        <Text className='text-[#0000FF] underline text-lg'>Forgot Password?</Text>
                    </Pressable>
                </SafeAreaView>

                <View className='mt-10 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                         <Pressable className='flex items-center justify-center h-full w-full'>
                            <Text className='text-white font-bold text-xl'>Login</Text>
                        </Pressable>
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