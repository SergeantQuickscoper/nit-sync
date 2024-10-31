import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import CompleteAccount from "@/components/auth/CompleteAccount";

const DashboardScreen = () => {
    const params = useLocalSearchParams();    
    return(
        <View className='flex-1 items-center justify-center bg-[#F7F7F7]'>
            <View className="">
                <Text className="">Future Dashboard Screen</Text>
                <Pressable className="mt-2" onPress={() => {router.replace("/")}}>
                    <Text className="text-center underline">Go to Login</Text>
                </Pressable>
            </View>
            
        </View>
    )
}

export default DashboardScreen;