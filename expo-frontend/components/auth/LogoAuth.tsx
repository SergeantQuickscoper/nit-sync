import {View, Text, Image} from "react-native"

const LogoAuth = () => {
    return(
        <View className='items-center mt-32'>
                <Image source={require("../../assets/images/Logo.png")}/>
        </View>
    )
}

export default LogoAuth;