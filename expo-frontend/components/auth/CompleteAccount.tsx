import {View, Text, Image, SafeAreaView, TextInput, Pressable} from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import {router} from "expo-router"
import { useState, useEffect} from "react";

const CompleteAccount = ({recievedParams} : any) => {

    const email = recievedParams.registeredEmail.toString();
    const [isLocked, setIsLocked] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [passMatch, setPassMatch] = useState(true)
    const [password, setPass] = useState("")
    const [confPassword, setConfPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    useEffect(() => {
        if(password != confPassword && password != "" && confPassword != ""){
           setPassMatch(false)
        }
        else{
            setPassMatch(true)
        }
      }, [password, confPassword]);

      useEffect(() => {
        if(password != confPassword && password != "" && confPassword != "" && firstName != "" && lastName != ""){
            setIsLocked(true)
            console.log(isLocked)
        }
        else{
            setIsLocked(false)
            console.log(isLocked)
        }
      }, [passMatch, firstName, lastName]);

    const handlePassChange = async(text:string) => {
        setPass(text);
    }

    const handleConfPassChange = (text:string) => {
        setConfPassword(text); 
    }

    const handleCompleteAccount = async() => {
        console.log("it works")
        if(isLocked){
            return;
        }

        await fetch('http://172.30.59.214:8080/completeaccount', {
            method: 'POST', // Specifies a POST request
            headers: {
              'Content-Type': 'application/json', // Informs the server about the data format
            },
            body: JSON.stringify({email :email, password : password, confirmPassword : confPassword, firstName : firstName, lastName})
          })
          .then((res) => res.json())
          .then((data) => {
            if(data.success == false){
                console.log(data.message)
                setErrorMessage(data.message);
            }
            else{
                console.log(data)
                router.push({ pathname: "/NewAccountWelcomeScreen", params: { registeredEmail : email, message: data.message } });
            }
          })

    }

    return(
        <View className='flex-1 items-center mt-28'>
                <Text className='text-[1.33rem] font-bold'>Complete your Account</Text>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 mt-8 rounded-full bg-white shadow-sm justify-center'>
                    <TextInput secureTextEntry={true} value={password} onChangeText={(text) => handlePassChange(text)} className='h-full w-11/12 px-2 py-2 text-lg leading-tight' placeholder="Password" placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput secureTextEntry={true} value={confPassword} onChangeText={(text) => handleConfPassChange(text)} className='w-11/12 px-2 text-lg leading-tight' placeholder="Confirm Password" placeholderTextColor={"black"} />
                </SafeAreaView>

                <View className="w-[22rem] mt-2 h-auto">
                    {passMatch ? <Text > </Text> : <Text className=" text-red-500 ml-3 font-medium">Passwords do not match</Text>}
                </View>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='w-11/12 px-2 text-lg leading-tight' placeholder="First Name" onChangeText={(text) => {setFirstName(text)}} placeholderTextColor={"black"} />
                </SafeAreaView>

                <SafeAreaView className='flex-1 items-center w-[22rem] max-h-12 mt-10 rounded-full p-2 bg-white shadow-sm justify-center'>
                    <TextInput className='w-11/12 px-2 text-lg leading-tight' placeholder="Last Name" onChangeText={(text) => {setLastName(text)}} placeholderTextColor={"black"} />
                </SafeAreaView>


                <View className='mt-12 rounded-full shadow-sm'>
                    <LinearGradient   colors={["#15C020", "#00FF11"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderRadius: 9999}} >
                    <SafeAreaView className='flex-1 items-center w-[22rem] max-h-11 justify-center'>
                         <Pressable className='flex items-center justify-center h-full w-full' onPress={() => handleCompleteAccount()}>
                            <Text className='text-white font-bold text-xl'>Create Account</Text>
                        </Pressable>
                    </SafeAreaView>
                    </LinearGradient>
                </View>
                
                
                
            </View>
    )
}

export default CompleteAccount;