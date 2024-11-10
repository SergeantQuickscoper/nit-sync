import {View, Text, Image, SafeAreaView, TextInput, Pressable, ScrollView} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import { useLocalSearchParams } from "expo-router";
import EmailForReset from "@/components/auth/EmailForReset";


const EnterEmailForVerificationScreen = () => {
    const params = useLocalSearchParams()
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <ScrollView>
                <LogoAuth />
                <EmailForReset recievedParams={params}/>
            </ScrollView>
        </View>
    )
}

export default EnterEmailForVerificationScreen;