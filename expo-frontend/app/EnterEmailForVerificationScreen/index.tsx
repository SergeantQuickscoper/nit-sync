import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import EmailForReset from "@/components/auth/EmailForReset";


const EnterEmailForVerificationScreen = () => {
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <LogoAuth />
            <EmailForReset />
        </View>
    )
}

export default EnterEmailForVerificationScreen;