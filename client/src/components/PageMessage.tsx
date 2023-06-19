import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import Header from "./Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMessage, getChannel, getMessage, getMessages } from "../backend/boardapi";
import { ChannelResource, MessageResource, MessagesResource } from "../ChannelResources";
import LoadingIndicator from "../LoadingIndicator";
import { useUserIDContext } from "./UserIDContext";
import { useErrorHandler } from "react-error-boundary";
import { channel } from "diagnostics_channel";



function PageMessage() {
    const { messageID } = useParams();
    const { channelID } = useParams();

    const { userID } = useUserIDContext();
    const [message, setMessage] = React.useState<MessageResource | null>(null);


    const [showMessage, setShowMessage] = React.useState(false);

    const handleClick = () => {
        setShowMessage(true);

    };

    const params = useParams();
    const navigate = useNavigate();
    const handleError = useErrorHandler();
    const messageId = params.messageID;


    function handleNav() {
        navigate("/board");
    }

    async function load() {
        try {
            if (!messageId) {
                throw new Error("MessageID is null")
            }
            const message = await getMessage(messageId)
            setMessage(message);
        } catch (err) {
            setMessage(null);
            handleError(err);
        }
    }


    React.useEffect(() => { load() }, []);

    async function onDelete() {
        const c = await deleteMessage({
            id: message?.id,
            title: "",
            authorId: userID!,
            content: "",
            channelId: channelID!
        })
        // handleNav();
        console.log(c)
    }




    let msg = null
    if (!message) {
        return <LoadingIndicator />
    }

    return (

        <>
            <Header />


            <Card key={message.id} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{message.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{message.author}, {message.createdAt}</Card.Subtitle>
                    <Card.Text>{message.content}
                    </Card.Text>

                </Card.Body>




                {(userID !== undefined)
                    ?
                    <Button variant="danger" href={`${message!.id}/edit`} role="button">Edit</Button>
                    :
                    <>
                        <Button variant="danger" onClick={handleClick} role="button">Edit</Button>
                        {showMessage && (
                            <p>Log in is required.</p>
                        )}
                    </>
                }
                <Button role="button" href="/" onClick={onDelete}>Delete</Button>
            </Card>
            <Button className='mt-5 ms-3' href="/" role="button" >Back</Button>
        </>
    )


}



export default PageMessage;
