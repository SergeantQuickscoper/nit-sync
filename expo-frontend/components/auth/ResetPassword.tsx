import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import { useRef, useState } from "react";

const ResetPassword = () => {
    const [otp, changeotp] = useState(["", "", "", "", "", ""])
    const inputRefs:any = useRef([])

    //Implementation is ass make it better later but it works
    const handleChange = (index:any, value:any) => {
        const newotp = [...otp];

        if(otp[index] && value != ""){
            return;
        }

        if (value.length > 1 && !otp[index]) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newotp[i] = pastedCode[i] || "";
			}
			changeotp(newotp);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newotp.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();

		} else {
			
            newotp[index] = value;
			changeotp(newotp);
			// Move focus to the next input field if value is entered
			if (value && index < 5) {
                
				inputRefs.current[index + 1].focus();
			}
		}
    }

    const handleKeyPress = (index:any, key:any) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
    }


    return(
        <View className='flex-1 items-center mt-28 mt'>
                
                <Text className='mt-4 text-[1.33rem] font-bold'>Reset Password OTP</Text>

                <SafeAreaView className='flex flex-row items-center justify-center w-[22rem] h-16 mt-5'>
                    {otp.map((input, index) => {
                            return (
                            <SafeAreaView className='flex flex-row items-center justify-center w-[3rem] mx-2 h-full rounded-2xl bg-white shadow-sm'> 
                                <TextInput 
                                ref={(el) => (inputRefs.current[index] = el)} 
                                className="font-bold text-2xl leading-tight w-full h-full text-center" 
                                key={index} 
                                keyboardType="numeric" 
                                value={input}
                                onChangeText={(text) => handleChange(index, text)}
                                onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}>
                                    
                                </TextInput>
                            </SafeAreaView>)
                        })}
                </SafeAreaView>

                <SafeAreaView className='w-[22rem] mt-4 items-end'>
                    <Pressable className=''>
                        <Text className='text-[#0000FF] underline text-lg'>Resend OTP</Text>
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
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => router.replace("/")}>
                            <Text className='text-white font-bold text-lg'>Verify</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                <SafeAreaView className='w-80 mt-4 items-center'>
                    <Pressable className='mr-2' onPress={() => router.replace("/EnterEmailForVerificationScreen")}>
                        <Text className='text-[#0000FF] underline text-lg'>Change Email Address?</Text>
                    </Pressable>
                </SafeAreaView>
                
            </View>
    )
}

export default ResetPassword;