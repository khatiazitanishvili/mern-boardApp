

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { createChannel, createMessage, ErrorFromValidation } from "../backend/boardapi";
import { MessageResource } from "../ChannelResources";
import { useUserIDContext } from "./UserIDContext";


function PageMessageCreate() {
    const { userID } = useUserIDContext();
    const params = useParams();
    const channelID = params.channelID;
    const refTitle = React.useRef<HTMLInputElement>(null);
    const refContent = React.useRef<HTMLInputElement>(null);
    let navigate = useNavigate();
    const [validated, setValidated] = React.useState<boolean | undefined>();


    async function onCreate(e: React.FormEvent) {
        try {
            e.preventDefault();
            setValidated(true);
            const form = e.currentTarget as HTMLFormElement;
            if (form.checkValidity() === false) {
                e.stopPropagation(); return;
            }
            const myEntryMessage = {
                title: refTitle.current!.value,
                authorId: userID,
                content: refContent.current!.value,
                channelId: channelID

            } as MessageResource;
            await createMessage(myEntryMessage)
            navigate(`/channel/${params.channelID}`)


        } catch (err) {
            if (err instanceof ErrorFromValidation) {
                err.validationErrors.forEach((validationError) => {
                    switch (validationError.param) {
                        case "name": refTitle.current?.setCustomValidity(validationError.msg); break;
                        case "description": refContent.current?.setCustomValidity(validationError.msg); break;
                    }
                });
            }
        }
    }
    return (
        <Form onSubmit={onCreate} style={{ width: '18rem', margin: '10px' }} >
            <Form.Group className="mb-3">
                <Form.Label>Title:</Form.Label>
                <Form.Control type="text" name="title" placeholder="Enter title" ref={refTitle} minLength={3} maxLength={100} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Content:</Form.Label>
                <Form.Control type="text" name="content" placeholder="Enter content" ref={refContent} minLength={5} maxLength={100} required />
            </Form.Group>
            <Button id="sub" type="submit" variant="primary">Submit</Button>{' '}
            <Button type="submit" variant="secondary" href={`/channel/${params.channelID}`} > Cancel</Button>
        </Form >
    );
}

export default PageMessageCreate;
