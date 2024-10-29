import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import CompleteAccount from "@/components/auth/CompleteAccount";

const CompleteAccountScreen = () => {
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <LogoAuth />
            <CompleteAccount />
        </View>
    )
}

export default CompleteAccountScreen;