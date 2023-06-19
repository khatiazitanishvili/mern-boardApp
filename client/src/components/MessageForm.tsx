import React from "react";
import { Form } from "react-bootstrap";
import { MessageResource } from "../ChannelResources"

export type MessageRes = {
    newMessage: MessageResource,
    setNewMessage: (f: MessageResource) => void
}

export function MessageForm({ newMessage, setNewMessage }: MessageRes) {

    const [validationErrors, setValidationErrors] = React.useState<MessageResource>({ title: "", content: "", authorId: "", channelId: "" });


    function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setNewMessage({ ...newMessage, [e.target.name]: e.target.value })
    }

    function validate(e: React.FocusEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case "title": setValidationErrors({
                ...validationErrors,
                title: (newMessage.title.length < 5 || newMessage.title.length > 100)
                    ? "Title must be at least 5 characters long and maximum 100 characters long." : ""
            });
                break;
            case "content": setValidationErrors({
                ...validationErrors,
                content: (newMessage.content.length < 5 || newMessage.content.length > 1000)
                    ? "Content must be at least 5 characters long and maximum 100 characters long." : ""
            });
                break;
        }
    }



    return (
        <Form style={{ width: '18rem', margin: '10px' }} >
            <Form.Group className="mb-3">
                <Form.Label>Title:</Form.Label>

                <Form.Control type="text" name="title" placeholder="update title" minLength={3} maxLength={100} onChange={update} onBlur={validate} required />
                <p>{validationErrors.title}</p>

            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Content:</Form.Label>
                <Form.Control type="text" name="content" placeholder="update content" minLength={5} maxLength={100} onChange={update} onBlur={validate} required />
                <p>{validationErrors.content}</p>
            </Form.Group>
        </Form>
    )
}
