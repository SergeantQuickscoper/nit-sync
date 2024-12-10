import {Text, View, Image, TextInput, SafeAreaView, Pressable, ScrollView} from 'react-native'
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LogoAuth from "../components/auth/LogoAuth"
import LoginInput from '@/components/auth/LoginInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = async() => {
    try {
        const token = await AsyncStorage.getItem('@userToken');
        if (token) {
          console.log('Token found:', token);
          router.push({ pathname: "/DashboardScreen", params: { registeredEmail : token } });
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error retrieving token', error);
      }

    return(
        <View className='flex-1 bg-[#F7F7F7]'>
            <ScrollView>
                <LogoAuth />
                <LoginInput />
            </ScrollView>
        </View>
    )
}

export default LoginScreen;
