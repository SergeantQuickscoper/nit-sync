import { View, Text, SafeAreaView, Pressable, TextInput, Image, ScrollView} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import LogoAuth from "@/components/auth/LogoAuth";
import SigninInput from "@/components/auth/SigninInput";

const SignUpScreen = () => {
    const params = useLocalSearchParams();
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <ScrollView >
                <LogoAuth />
                <SigninInput recievedParams={params} />
            </ScrollView>
        </View>
    )
}

export default SignUpScreen;