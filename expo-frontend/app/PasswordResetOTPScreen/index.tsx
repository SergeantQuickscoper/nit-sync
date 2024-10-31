import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import ResetPassword from "@/components/auth/ResetPassword";
import { useLocalSearchParams } from "expo-router";

const PasswordResetOTPScreen = () => {
    const params = useLocalSearchParams()
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <LogoAuth />
            <ResetPassword recievedParams={params}/>
        </View>
    )
}

export default PasswordResetOTPScreen;