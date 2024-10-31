import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import CompleteAccount from "@/components/auth/CompleteAccount";

const CompleteAccountScreen = () => {
    const params = useLocalSearchParams();    
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <LogoAuth />
            <CompleteAccount recievedParams={params}/>
        </View>
    )
}

export default CompleteAccountScreen;