import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatTextIcon, HeartIcon, ThumbsUpIcon, UserCircleIcon, UserIcon } from "phosphor-react-native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({ username, post, text, photo, likesCount, commentCount, id, liked, handlePosts, setshowmodal, handleComment , setpostToComment}) {
    const ip = "192.168.31.151"
    const [isliked, setisliked] = useState(liked)
    const [postLikes, setpostLikes] = useState(likesCount)
    async function handleLikes() {

        try {
            const token = await AsyncStorage.getItem("logedUser")

            const favourite = await fetch(`http:/localhost:3000/post/${id}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "token": token
                })

            })


            const record = await favourite.json()

     

            setpostLikes(record?.likesCount)
            setisliked(record?.liked)

        }
        catch (err) {
            alert(err)
        }
    }




    useState(() => {
        handlePosts()
    }, [handleLikes])
    return (
        <View style={styles.postContainer}>
            <View style={styles.usernameContainer}>
                <UserCircleIcon size={35}></UserCircleIcon>
                <Text style={styles.text}>{username}</Text>
            </View>

            {text &&
                <Text style={{ ...styles.text, fontWeight: "black" }} >{text}</Text>}

            {photo && <Image
                style={styles.photoStyle}
                source={{ uri: photo }}
                resizeMode="contain"
            />}

            <View style={styles.horizontalLine}></View>
            <View style={styles.likeContainer}>
                <TouchableOpacity onPress={() => {
                    handleLikes()
                }} style={styles.touchBox}>
                    <HeartIcon color="red" weight={isliked != false ? "fill" : "regular"} size={28} />
                    <Text style={{ ...styles.text, fontSize: 16 }}>{postLikes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchBox} onPress={()=>{
                    setshowmodal(true)
                    setpostToComment(post)
                   
                }
                
                }>
                    <ChatTextIcon size={28} />
                    <Text style={{ ...styles.text, fontSize: 16 }}>{commentCount}</Text>
                </TouchableOpacity>
            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        margin: 10,
        gap: 10,
        padding: 10,
        borderColor: 'lightgrey',
        borderWidth: 2,
        borderRadius: 10
    },
    usernameContainer: {
        marginVertical: 10,
        flexDirection: "row",
        gap: 5,
        alignItems: "center"
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    horizontalLine: {

        height: 1.5,
        backgroundColor: "lightgrey"
    },
    likeContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    touchBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    photoStyle: {
        height: 400,
        width: 300,
        alignSelf: "center"
    }
})