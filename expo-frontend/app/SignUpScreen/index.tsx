import { View, Text, SafeAreaView, Pressable, TextInput, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LogoAuth from "@/components/auth/LogoAuth";
import SigninInput from "@/components/auth/SigninInput";

const SignUpScreen = () => {
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            
            <LogoAuth />
            <SigninInput />
        
        </View>
    )
}

export default SignUpScreen;