import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"

const CompleteAccount = () => {
    return(
        <View className='flex-1 items-center mt-28'>
                <Text className='text-[1.33rem] font-bold'>Complete your Account</Text>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 mt-8 rounded-full bg-white shadow-sm justify-center'>
                    <TextInput className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Password" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='w-11/12 px-2 text-lg leading-tight' placeholder="Confirm Password" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='w-11/12 px-2 text-lg leading-tight' placeholder="First Name" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='w-11/12 px-2 text-lg leading-tight' placeholder="Last Name" placeholderTextColor={"black"} />
                </SafeAreaView>


                <View className='mt-12 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => router.replace("/NewAccountWelcomeScreen")}>
                            <Text className='text-white font-bold text-xl'>Create Account</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                
                
            </View>
    )
}

export default CompleteAccount;