import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"

const NewAccountWelcome = ({recievedParams} : any) => {
    const message = recievedParams.message;
    return(
        <View className='flex-1 items-center mt-28'>
                <Text className='text-[1.33rem] font-bold text-3xl'>That's it you're all set!</Text>

                <Image className="w-32 h-[8.17rem] mt-10" source={require("../../assets/images/CheckBox.png")}/>

                <Text className="mt-10 mx-6 font-medium text-base text-center">{message.split(": ")[0]} </Text>
                <Text className="mt-1 mx-6 font-bold text-lg">{message.split(": ")[1]}</Text>


                <View className='mt-12 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => router.replace("/DashboardScreen")}>
                            <Text className='text-white font-bold text-xl'>Go To Dashboard</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                
                
            </View>
    )
}

export default NewAccountWelcome;