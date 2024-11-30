import {View, Text, Image, SafeAreaView, TextInput, Pressable, ScrollView} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router"
import LogoAuth from "@/components/auth/LogoAuth";
import OTPInput from "@/components/auth/OTPInput";
import CompleteAccount from "@/components/auth/CompleteAccount";

const DashboardScreen = () => {
    const params = useLocalSearchParams();    
    return(
        <View className='flex-1 bg-[#F7F7F7] border-2 justify-center items-center'>
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}> {/* This content Container Style is a weird little caveat cant really use native wind with this style*/}
            <View className="items-center">
                <Text className="">Future Dashboard Screen</Text>
                <Pressable className="mt-2" onPress={() => {router.replace("/")}}>
                    <Text className="text-center underline">Go to Login</Text>
                </Pressable>
            </View>
            </ScrollView>  
        </View>
    )
}

export default DashboardScreen;