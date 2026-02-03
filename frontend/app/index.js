import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Camera, PaperPlaneRight, PaperPlaneRightIcon } from "phosphor-react-native"
import Card from "../components/postCard";
import * as ImagePicker from "expo-image-picker"


export default function Home() {
    const [currentUser, setcurrentUser] = useState("")
    const [posts, setposts] = useState([])
    const [photouri, setphotouri] = useState(null)
    const [photourl, setphotourl] = useState(null)
    const [posttext, setposttext] = useState("")
    const [loadingPhoto, setloadingPhoto] = useState(false)
    const ip = "10.209.188.5"
    async function handlePosts() {
        try {

            const response = await fetch(`http://${ip}:3000/posts`)

            const allPosts = await response.json()

            setposts(allPosts.data)

        }
        catch (err) {
            alert(err)
        }
    }

    const handleGalleryImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status != "granted") {
                alert("Permission denied")
                return;
            }

            setloadingPhoto(true)
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            })

            if (result.canceled) {
                setloadingPhoto(false)
                return
            }



            const formdata = new FormData()

            formdata.append("file", {
                uri: result?.assets[0]?.uri,
                name: result?.assets[0]?.name,
                type: result?.assets[0]?.mimeType
            }

            )


            formdata.append("upload_preset", "mobile_unsigned")



            const imgUrl = await fetch(`https://api.cloudinary.com/v1_1/dnkfrbwde/image/upload`, {
                method: "POST",
                body: formdata,
            });




            const imageUrldata = await imgUrl.json();

            console.log(imageUrldata)
            const cloudUrl = imageUrldata.secure_url
            setphotourl(cloudUrl)

            setphotouri(result?.assets[0]?.uri)

            setloadingPhoto(false)

        }

        catch (err) {
            console.log("Photo Selection error:", err);
            setloadingPhoto(false)
        }

    }

    async function submitPost() {


        try {


            if (!posttext?.trim() && !photourl?.trim()) {
                alert("Fill all the fields Properly")
                return
            }

            const token = await AsyncStorage.getItem("logedUser")

            const response = await fetch(`http://${ip}:3000/post/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "text": posttext?.trim(),
                    "photo": photourl?.trim(),
                    "token": token
                })

            })

            setposttext("")
            setphotourl("")

            const data = await response.json()

            if (data) {
                alert(
                    "POst Added"
                )
            }
        }
        catch (err) {
            console.log("catch")
            alert(err.message || "Something went wrong")
        }
    }

    useEffect(() => {

        AsyncStorage.getItem("logedUser").then(function (value) {

            if (!value) {
                router.replace("/login")
            }
            else {
                setcurrentUser(value)
                handlePosts();
            }
        })
    }, [])

    return (
        <View style={style.bigContainer}>
            <View style={style.postCreateContainer}>
                <Text style={style.postCreateText}>Create Post</Text>
                <TextInput onChangeText={(value) => {
                    setposttext(value)
                }} value={posttext} placeholder="What's on your mind?"></TextInput>
                <View style={style.horizontalLine}></View>
                <View style={style.cameraContainer}>
                    <TouchableOpacity onPress={handleGalleryImage}>
                        {photouri ? (
                            <>
                                <Image
                                    source={{ uri: photouri }}
                                    style={{ width: 70, height: 70 }}
                                />
                            </>
                        ) : <Camera size={38} color="#006aff" />}

                    </TouchableOpacity>
                    <TouchableOpacity onPress={submitPost} style={style.postLogoContainer}>
                        <PaperPlaneRightIcon color="white" size={25} />
                        <Text style={{ color: "white", fontWeight: "bold" }}>Post</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <FlatList
                data={posts}

                showsVerticalScrollIndicator={false}
                renderItem={(item) => {
                    console.log(currentUser)
                    return (
                        <Card username={item?.item?.creator?.username} text={item?.item?.text} photo={item?.item?.image} likesCount={item?.item?.likesCount || 0} commentCount={item?.item?.commentCount || 0} id={item?.item?._id} liked={item?.item?.likes?.includes(currentUser) ? 1 : 0} handlePosts={handlePosts}></Card>
                    )
                }}
            ></FlatList>
        </View>
    )
}

const style = StyleSheet.create({
    bigContainer: {
        padding: 10,
        flex: 1
    },
    postCreateContainer: {
        gap: 10,
        backgroundColor: "#f1ebeb",
        borderRadius: 20,
        padding: 10,
        margin: 10,

        marginTop: 40
    },
    postCreateText: {
        fontSize: 25,
        fontWeight: "bold"
    },
    horizontalLine: {
        height: 1.5,
        backgroundColor: "lightgrey"
    },
    cameraContainer: {
        marginVertical: 10,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    postLogoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "lightgrey",
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 15,


    }
})