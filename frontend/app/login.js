
import { useState } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
export default function Login() {
   const ip = "192.168.31.151"
    const [isLogin, setisLogin] = useState(false)
    const [loginEmail, setloginEmail] = useState("");
    const [loginPassword, setloginPassword] = useState("")
    const [email, setemail] = useState("")
    const [signupUserName, setSigupUserName] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [err, seterr] = useState("")


    async function handleLogin() {

        try {

            if (!loginEmail?.trim() || !loginPassword?.trim()) {
                alert("Invalid credentials");
                setloginPassword("")
                setloginEmail("")
                return
            }

            const response = await fetch(`https://your-backend.vercel.app/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "email": loginEmail, "password": loginPassword })

            })
            const loginData = await response.json();
            console.log(loginData)
            if (loginData.success == false) {
                seterr(loginData.message)
                alert(loginData.message)
                return
            }

            const token = loginData.token;
            await AsyncStorage.setItem("logedUser", token);

            alert("User logged in")
            router.replace("/")

            setloginPassword("")
            setloginEmail("")

        }
        catch (err) {
            seterr(err.message)
            alert(err.message)
        }

    }

    async function handleSignup() {

        try {

            if (!signupPassword?.trim() || !signupUserName?.trim() || !email?.trim()) {
                alert("Invalid credentials");
                setSignupPassword("")
                setSigupUserName("")
                setemail("")
                return
            }

            const response = await fetch(`https://your-backend.vercel.app/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "username": signupUserName, "email": email, "password": signupPassword })
                
            })
            const signupData = await response.json();
            console.log(signupData)

            if (signupData.success == false) {
                seterr(signupData.message)
                alert(signupData.message)
                return
            }

            const token = signupData.token;
            await AsyncStorage.setItem("logedUser", token);

            router.replace("/")
            alert("User created successfully")

            setSignupPassword("")
            setemail("")
            setSigupUserName("")

        }
        catch (err) {
            seterr(err.message)
            alert(err.message)
        }
    }

    function login() {
        setisLogin(true)
    }
    function signup() {
        setisLogin(false)
    }

    return (
        <View style={styles.container}>
            {
                isLogin &&
                <View style={{
                    margin: 10
                }}>

                    <Text style={{
                        color: "black",
                        fontSize: 28,
                        textAlign: "center",
                        fontWeight: "600",
                        marginTop: 25
                    }}>Welcome Back</Text>


                    <View style={{
                        marginTop: -10,
                        alignItems: "flex-start",
                        paddingVertical: 10
                    }}>

                        <Text style={{
                            color: "grey",
                            fontSize: 25,
                            fontWeight: "600",
                            marginTop: 20,
                            marginBottom: 10

                        }}>Enter E-Mail</Text>

                        <TextInput onChangeText={(value) => {
                            setloginEmail(value)
                        }}
                            value={loginEmail} placeholder="Your E-mail">

                        </TextInput>

                        <View style={{
                            borderWidth: 2,
                            borderColor: "grey",
                            height: 0,
                            backgroundColor: "grey",
                            width: "90%", opacity: 0.3,

                        }}></View>
                        <Text style={{
                            color: "grey",
                            fontSize: 25,
                            fontWeight: "600",
                            marginTop: 30,
                            marginBottom: 10
                        }}>Enter Password</Text>
                        <TextInput onChangeText={(value) => {
                            setloginPassword(value)
                        }}
                            value={loginPassword} placeholder="Your Password">


                        </TextInput>
                        <View style={{
                            borderWidth: 2,
                            borderColor: "grey",
                            height: 0,
                            backgroundColor: "grey",
                            width: "90%", opacity: 0.3

                        }}></View>

                    </View>

                    <View style={{
                        alignItems: "center",
                        margin: 15
                    }}>

                        <View style={{
                            width: "60%",
                            backgroundColor: "blue",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 5,
                            borderRadius: 10
                        }}>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={{
                                    fontWeight: 600,
                                    color: "white",
                                    fontSize: 18
                                }}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            margin: 5
                        }}>

                            <Text style={{
                                fontWeight: "600",
                            }}>
                                Don't have an account
                            </Text>

                            <TouchableOpacity onPress={signup}>
                                <Text style={{
                                    color: "blue",
                                    marginLeft: 5
                                }}>
                                    sign up
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            }
            {!isLogin &&
                <View style={{
                    margin: 10
                }}>

                    <Text style={{
                        color: "black",
                        fontSize: 28,
                        textAlign: "center",
                        fontWeight: "600",
                        marginTop: 10
                    }}>Welcome</Text>


                    <View style={{
                        marginTop: -10,
                        alignItems: "flex-start",
                        paddingVertical: 10
                    }}>

                        <Text style={{
                            color: "grey",
                            fontSize: 25,
                            fontWeight: "600",
                            marginTop: 20,


                        }}>Enter username</Text>

                        <TextInput onChangeText={(value) => {
                            setSigupUserName(value)
                        }} value={signupUserName} placeholder="Your Username">

                        </TextInput>

                        <View style={{
                            borderWidth: 2,
                            borderColor: "grey",
                            height: 0,
                            backgroundColor: "grey",
                            width: "90%", opacity: 0.3,

                        }}></View>
                        <Text style={{
                            color: "grey",
                            fontSize: 25,
                            fontWeight: "600",
                            marginTop: 15,

                        }}>Enter Email</Text>
                        <TextInput style={{

                        }} onChangeText={(value) => {
                            setemail(value)
                        }} value={email} placeholder="Your Email">

                        </TextInput>
                        <View style={{
                            borderWidth: 2,
                            borderColor: "grey",
                            height: 0,
                            backgroundColor: "grey",
                            width: "90%", opacity: 0.3

                        }}></View>
                        <Text style={{
                            color: "grey",
                            fontSize: 25,
                            fontWeight: "600",
                            marginTop: 15,

                        }}>Enter Password</Text>
                        <TextInput style={{

                        }} onChangeText={(value) => {
                            setSignupPassword(value)
                        }} value={signupPassword} placeholder="Your Password">

                        </TextInput>
                        <View style={{
                            borderWidth: 2,
                            borderColor: "grey",
                            height: 0,
                            backgroundColor: "grey",
                            width: "90%", opacity: 0.3

                        }}></View>

                    </View>


                    <View style={{
                        alignItems: "center",
                        margin: 10
                    }}>

                        <View style={{
                            width: "60%",
                            backgroundColor: "blue",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 5,
                            borderRadius: 10
                        }}>
                            <TouchableOpacity onPress={handleSignup} >
                                <Text style={{
                                    fontWeight: 600,
                                    color: "white",
                                    fontSize: 18
                                }}>
                                    Sign up
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            margin: 5
                        }}>

                            <Text style={{
                                fontWeight: "600",
                            }}>
                                Already have an account
                            </Text>

                            <TouchableOpacity onPress={login}>
                                <Text style={{
                                    color: "blue",
                                    marginLeft: 5
                                }}>
                                    sign in
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>}


        </View>
    )

}

const styles = StyleSheet.create({
container : {
marginVertical : "auto"
}

})