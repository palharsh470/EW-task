import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatTextIcon, HeartIcon, ThumbsUpIcon, UserCircleIcon, UserIcon } from "phosphor-react-native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({username, text, photo, likesCount, commentCount,id, liked, handlePosts}) {
const ip = "10.209.188.5"
    console.log(liked)
    const [isliked, setisliked] = useState(liked)
  async function handleLikes() {
    
         try {
            const token = await AsyncStorage.getItem("logedUser")

            const favourite = await fetch(`http://${ip}:3000/post/${id}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "token": token
                })

            })


            const record = await favourite.json()
            setisliked(true)

        }
        catch (err) {
            alert(err)
        }
  }

  useState(()=>{
    handlePosts()
  },[handleLikes])
    return (
        <View style={styles.postContainer}>
            <View style={styles.usernameContainer}>
                <UserCircleIcon size={35}></UserCircleIcon>
                <Text style={styles.text}>{username}</Text>
            </View>


            <Text style={{ ...styles.text, fontWeight: "black" }} >{text}</Text>

            <Image
                source={{ uri: photo }}
       
            />

            <View style={styles.horizontalLine}></View>
            <View style={styles.likeContainer}>
                <TouchableOpacity onPress={() => {
                    handleLikes()
                }} style={styles.touchBox}>
                    <HeartIcon color="red" weight={isliked!=false ? "fill" : "regular"} size={32} />
                    <Text style={{ ...styles.text, fontSize: 16 }}>{likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchBox}>
                    <ChatTextIcon size={32} />
                    <Text style={{ ...styles.text, fontSize: 16 }}>{commentCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        margin: 10,
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
        marginVertical: 10,
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
    }
})