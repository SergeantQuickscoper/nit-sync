import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"

const OTPInput = () => {
    return(
        <View className='flex-1 items-center mt-28 mt'>
                
                <Text className='mt-20 text-[1.33rem] font-bold'>Verify your Email</Text>

                <SafeAreaView className='flex-1 items-center justify-center w-[22rem] max-h-11 mt-5 rounded-full bg-white shadow-sm'>
                    <Text>Future OTP Input</Text>
                </SafeAreaView>

                <SafeAreaView className='w-[22rem] mt-3 items-end'>
                    <Pressable className='mr-2'>
                        <Text className='text-[#0000FF] underline text-lg'>Resend Password</Text>
                    </Pressable>
                </SafeAreaView>
                
                {/*Flex row in native wind doesnt work for some reason, using inline styles as a fallback */}
                <SafeAreaView className="mt-8 w-full" style={{ flexDirection: 'row', justifyContent: "center"}}>
                    <Image className="" source={require("../../assets/images/infoIcon.png")}/>
                    <Text className='font-light ml-2'>A 6 digit OTP has been sent to your registered email address.</Text>
                </SafeAreaView>

                <View className='mt-8 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                        {/*Add condiitionality for if institute email is valid or not*/}
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => router.replace("/OTPScreen")}>
                            <Text className='text-white font-bold text-lg'>Verify</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                <SafeAreaView className='w-80 mt-4 items-center'>
                    <Pressable className='mr-2' onPress={() => router.replace("/SignUpScreen")}>
                        <Text className='text-[#0000FF] underline text-lg'>Change Email Address?</Text>
                    </Pressable>
                </SafeAreaView>
                
            </View>
    )
}

export default OTPInput;