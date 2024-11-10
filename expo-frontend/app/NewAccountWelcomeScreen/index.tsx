import {View, Text, Image, SafeAreaView, TextInput, Pressable, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import NewAccountWelcome from "@/components/auth/NewAccountWelcome";


const NewAccountScreen = () => {
    const params = useLocalSearchParams()
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <ScrollView>
                <LogoAuth />
                <NewAccountWelcome recievedParams={params}/>
            </ScrollView>
        </View>
    )
}

export default NewAccountScreen;