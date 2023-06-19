import React from "react";
import { Button } from "react-bootstrap";
import { useErrorHandler } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";
import { createMessage, getMessage, updateMessage } from "../backend/boardapi";
import { MessageResource } from "../ChannelResources";
import { useUserIDContext } from "./UserIDContext";

import { MessageForm } from "./MessageForm";
import Header from "./Header";

export default function PageMessageEdit() {
    const { userID } = useUserIDContext();
    const navigate = useNavigate();
    const param = useParams()
    const handleError = useErrorHandler();
    const [newMessage, setNewMessage] = React.useState<MessageResource>({ authorId: "", title: "", content: "", channelId: "" });



    async function load() {
        try {
            if (!param.messageID) {
                throw new Error("Message id not found")
            }
            const newMessage = await getMessage(param.messageID)
            if (!newMessage) {
                throw new Error("Message with this id not found")
            }
            setNewMessage(newMessage);

        } catch (err) {
            handleError(err);
        }
    }


    React.useEffect(() => { load(); }, []);




    async function onUpdate() {
        try {


            if (!param.messageID) {
                throw new Error("ChannelID is null");
            }

            const m = await updateMessage(newMessage);
            console.log(m)
            navigate(`/message/${param.messageID}`)
        } catch (err) {
            handleError(err);
        }
    }



    return (
        <div>
            <Header />
            <MessageForm newMessage={newMessage} setNewMessage={setNewMessage} />
            <Button onClick={() => onUpdate()} variant="primary">Update</Button>{' '}
            <Button onClick={() => navigate(`/message/${param.messageID}`)} variant="secondary">Cancel</Button>
        </div >
    )
}
