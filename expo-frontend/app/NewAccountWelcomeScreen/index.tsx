import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import NewAccountWelcome from "@/components/auth/NewAccountWelcome";


const NewAccountScreen = () => {
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <LogoAuth />
            <NewAccountWelcome />
        </View>
    )
}

export default NewAccountScreen;