
import React from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap/lib/Tab";
import { useErrorHandler } from "react-error-boundary";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteChannel, deleteMessage, getChannel, getMessages } from "../backend/boardapi";
import { ChannelResource, MessageResource, MessagesResource } from "../ChannelResources";
import LoadingIndicator from "../LoadingIndicator";
import Header from "./Header";
import { UserIDContext, useUserIDContext } from "./UserIDContext";



function PageChannel() {
    const params = useParams();
    const channelID = params.channelID;

    const [messages, setMessages] = React.useState<MessagesResource | null>(null);
    const [channel, setChannel] = React.useState<ChannelResource | null>(null);
    const handleError = useErrorHandler();
    const { userID } = useUserIDContext();
    let navigate = useNavigate();
    function handleNav() {
        navigate("/");
    }



    const [showMessage, setShowMessage] = React.useState(false);

    const handleClick = () => {
        setShowMessage(true);
    };



    async function load() {
        try {
            const m = await getMessages(channelID!);
            const c = await getChannel(channelID!)
            setMessages(m);
            setChannel(c);
        } catch (err) {
            setMessages(messages);
            setChannel(channel);
            handleError(err);
        }
    }
    // let deleteButton = <React.Fragment></React.Fragment>


    async function onDelete() {
        const c = await deleteChannel({
            id: channel?.id,
            ownerId: userID!,
            name: "",
            description: "",
            public: false,
            closed: false
        })
        handleNav();
        console.log(c)
    }

    // if (userID === channel?.ownerId) {
    //     deleteButton = (<Button id="deleteChannel" variant="primary" onClick={() => handleDelete()}>
    //         Delete Channel
    //     </Button>)
    // }

    React.useEffect(() => { load(); }, [userID]);


    let msg = null
    if (!messages) {
        return <LoadingIndicator />
    } else {
        msg = (
            <>
                {(userID !== undefined)
                    ?
                    <Button variant="danger" href={`${channel!.id}/newMessage`} role="button">New Message</Button>
                    :
                    <>
                        <Button variant="danger" onClick={handleClick} role="button">New Message</Button>
                        {showMessage && (
                            <p>Log in is required.</p>
                        )}
                    </>
                }


                {

                    messages.messages.map(message =>

                        <Card key={message.id} border="dark" style={{ width: '18rem', margin: '10px' }}>
                            <Card.Body>
                                <Card.Title>{message.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{message.author}, {message.createdAt}</Card.Subtitle>
                                <Card.Text>
                                    {message.content}
                                </Card.Text>
                                <Button variant="success" href={`/message/${message.id}`} role="button">View</Button> {' '}
                            </Card.Body>
                        </Card>
                    )
                }
            </>
        )
    }


    if (!channel) {
        return <LoadingIndicator />
    } else {
        return (
            <>
                <Header />
                <Card key={channel.id}>
                    <Card.Body >
                        <Card.Title>{channel.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{channel.description}</Card.Subtitle>
                        <Card.Text>
                            Owner: {channel.owner}, Messages: {channel.messageCount}
                        </Card.Text>
                        {msg}
                        {' '}
                        <Button id="deleteChannel" variant="primary" onClick={() => onDelete()}>
                            Delete Channel
                        </Button>
                    </Card.Body>

                </Card>
                <Button variant="info" className='mt-5 ms-3' href="/" role="button" >Back</Button>

            </>
        )

    }

}





export default PageChannel;
