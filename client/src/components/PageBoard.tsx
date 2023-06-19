import React from "react";
import { BoardResource } from "../ChannelResources";
import { Link } from "react-router-dom";
import { getBoard } from "../backend/boardapi";
import LoadingIndicator from "../LoadingIndicator";
import { Button, Card, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Header from "./Header";
import { UserIDContext, useUserIDContext } from "./UserIDContext";
// import PageChannelCreate from "./PageChannelCreate";

export default function PageBoard() {
    const [channels, setChannels] = React.useState<BoardResource | null>(null);
    const { userID } = useUserIDContext();

    async function load() {
        const c = await getBoard();
        setChannels(c);
    }

    React.useEffect(() => { load(); }, [userID]);


    if (!channels) {
        return <LoadingIndicator />
    } else {
        return (
            <>

                <Header />
                <h1>Board</h1>
                <Button id="newChannel" name="newCHannel" variant="dark" size="lg" href={'/channel/create'} role="button" style={{ margin: '10px' }}>New Channel</Button>

                <Row className="g-2">


                    {
                        channels.channels.map(channel =>
                            <Card key={channel.id} border="dark" bg="dark" text='white' style={{ width: '18rem', margin: '10px' }}>
                                <Card.Body>
                                    <Card.Title>{channel.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{channel.description}</Card.Subtitle>
                                    <Card.Text>
                                        Owner: {channel.owner}, Messages: {channel.messageCount} Created at {channel.createdAt}
                                    </Card.Text>
                                    <Button variant="primary" href={`/channel/${channel.id}`} role="button">View</Button>{' '}
                                    <Button variant="secondary" href={`/channel/${channel.id}/edit`} role="button">Edit</Button>
                                </Card.Body>
                            </Card>
                        )
                    }
                </Row>

            </>


        )
    }
}





