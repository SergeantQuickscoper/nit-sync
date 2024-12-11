import {Text, View, Image, TextInput, SafeAreaView, Pressable, ScrollView} from 'react-native'
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LogoAuth from "../components/auth/LogoAuth"
import LoginInput from '@/components/auth/LoginInput';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginScreen = () => {

    useEffect(() => {
        const checkToken = async() => {
            try {
                const token = await AsyncStorage.getItem('jwt');
                const isCR = await AsyncStorage.getItem('isCR')
                if (token && isCR != undefined) {
                  console.log('Token found:', token);
                  router.push({ pathname: "/DashboardScreen", params: { registeredEmail : token, isCR: isCR} });
                } else {
                  console.log('No token found');
                }
              } catch (error) {
                console.error('Error retrieving token', error)
              }
        }

        checkToken()

      }, []);

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
