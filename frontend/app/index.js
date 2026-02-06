import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Camera, PaperPlaneRight, PaperPlaneRightIcon, SelectionBackgroundIcon, XCircleIcon } from "phosphor-react-native"
import Card from "../components/postCard";
import * as ImagePicker from "expo-image-picker"
import { BlurView } from "expo-blur";

export default function Home() {
    const [commentText, setcommentText] = useState("")
    const [postToComment, setpostToComment] = useState("")
    const [currentUser, setcurrentUser] = useState("")
    const [showmodal, setshowmodal] = useState(false)
    const [posts, setposts] = useState([])
    const [photouri, setphotouri] = useState(null)
    const [photourl, setphotourl] = useState(null)
    const [posttext, setposttext] = useState("")
    const [loadingPhoto, setloadingPhoto] = useState(false)
    const ip = "192.168.31.151"
  
    async function handlePosts() {
        try {

            const response = await fetch(`http://localhost:3000/posts`)

            const allPosts = await response.json()
            // console.log(allPosts)
            setposts(allPosts.data)

        }
        catch (err) {
            alert(err)
        }
    }

    const handleGalleryImage = async () => {
        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                alert("Permission denied");
                return;
            }



            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            if (result.canceled) {
                setloadingPhoto(false);
                return;
            }

            setloadingPhoto(true);
            const uri = result.assets[0].uri;

            const data = new FormData();
            data.append("file", {
                uri: uri,
                name: "photo.jpg",
                type: "image/jpeg",
            });

            data.append("upload_preset", "mobile_unsigned");

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dqfnqt5mt/image/upload",
                {
                    method: "POST",
                    body: data,
                }
            );

            const imageUrldata = await response.json();


            if (!imageUrldata.secure_url) {
                throw new Error("Upload failed");
            }

            // console.log(imageUrldata.secure_url)

            setphotourl(imageUrldata.secure_url);
            setphotouri(uri);
            setloadingPhoto(false);
        } catch (err) {

            setloadingPhoto(false);
        }
    };

    async function handleComments() {

        try {
         
            const token = await AsyncStorage.getItem("logedUser")

            const addComment = await fetch(`http://localhost:3000/post/${postToComment}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "token": token,
                    "text": commentText
                })

            })


            const record = await addComment.json()

            console.log(record)


        }
        catch (err) {
            alert(err)
        }

        setcommentText("")
        setshowmodal(false)
        handlePosts()
    }

    async function submitPost() {


        try {


            if (!posttext?.trim() && !photourl?.trim()) {
                alert("Fill all the fields Properly")
                return
            }

            const token = await AsyncStorage.getItem("logedUser")
        
            const response = await fetch(`http://localhost:3000/post/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "text": posttext?.trim(),
                    "image": photourl,
                    "token": token
                })

            })




            const data = await response.json()

            if (data) {
                alert("POst Added")
            }
        }
        catch (err) {

            alert(err.message || "Something went wrong")
        }

        setphotourl(""),
            setphotouri(""),
            setposttext("")

        handlePosts()
    }

    async function getLoggedUserId(token) {
        try {

            const response = await fetch(`http://localhost:3000/user/id`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "token": token
                })

            })
            const userId = await response.json();

            setcurrentUser(userId?.data)
        }
        catch (err) {
            alert(err.message || "Something went wrong")
        }
    }

    useEffect(() => {

        AsyncStorage.getItem("logedUser").then(function (value) {

            if (!value) {
                router.replace("/login")
            }
            else {

                handlePosts();
                getLoggedUserId(value)
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
                        {loadingPhoto ? <ActivityIndicator size="large" /> : photouri ? (
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
    
                    return (
                        <Card username={item?.item?.creator?.username} post={item?.item?._id}
                            text={item?.item?.text} photo={item?.item?.image}
                            likesCount={item?.item?.likesCount || 0} 
                            commentCount={item?.item?.commentCount || 0}
                            id={item?.item?._id}
                            liked={item?.item?.likes?.includes(currentUser) ? 1 : 0}
                            handlePosts={handlePosts} setshowmodal={setshowmodal}
                            handleComment={handleComments} setpostToComment={setpostToComment}></Card>
                    )
                }}
            ></FlatList>


            {showmodal && (
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            )}
            <Modal animationType="fade"

                transparent={true}
                visible={showmodal}
            >
                <View style={style.commentContainer}>
                    <TouchableOpacity onPress={() => { setshowmodal(!showmodal) }} style={style.commentClose}><XCircleIcon size={27} /></TouchableOpacity>
                    <View>
                        <TextInput onChangeText={(value) => {
                            setcommentText(value)
                        }} value={commentText} placeholder="Add your comment..."></TextInput>
                        <View style={style.horizontalLine}></View>
                    </View>
                    <Button onPress={handleComments} title="submit"></Button>
                </View>
            </Modal>

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


    },
    commentContainer: {

        backgroundColor: "white",
        width: "70%",
        position: "absolute",
        top: "40%",
        left: "15%",
        borderRadius: 10,
        borderColor: "grey",
        borderWidth: 2,
        padding: 15,
        gap: 15

    },
    commentClose: {
        position: "absolute",
        right: 0
    }

})