import {View, Text, Image, SafeAreaView, TextInput, Pressable, ScrollView} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";

const OTPScreen = () => {
    const params = useLocalSearchParams();
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <ScrollView>
                <LogoAuth />
                <OTPInput recievedParams={params} />
            </ScrollView>
        </View>
    )
}

export default OTPScreen;