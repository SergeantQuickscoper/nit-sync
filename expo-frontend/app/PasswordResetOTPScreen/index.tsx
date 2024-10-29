import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import ResetPassword from "@/components/auth/ResetPassword";


const PasswordResetOTPScreen = () => {
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <LogoAuth />
            <ResetPassword />
        </View>
    )
}

export default PasswordResetOTPScreen;