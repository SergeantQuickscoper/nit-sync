import {Text, View, Image, TextInput, SafeAreaView, Pressable} from 'react-native'
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LogoAuth from "../components/auth/LogoAuth"
import LoginInput from '@/components/auth/LoginInput';
const LoginScreen = () => {
    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            
            <LogoAuth />

            <LoginInput />
        </View>
    )
}

export default LoginScreen;
