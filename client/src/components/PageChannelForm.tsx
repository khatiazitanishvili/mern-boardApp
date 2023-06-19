import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createChannel, ErrorFromValidation, updateChannel } from "../backend/boardapi";
import { ChannelResource } from "../ChannelResources";
import { useUserIDContext } from "./UserIDContext";

interface PageChannelFormProps {
    onSubmit: (channel: ChannelResource) => void;
    onCancel: () => void;
    initialChannel?: ChannelResource;
}

function PageChannelForm({ onSubmit, onCancel, initialChannel }: PageChannelFormProps) {
    const { userID } = useUserIDContext();
    const refName = useRef<HTMLInputElement>(null);
    const refDescription = useRef<HTMLInputElement>(null);
    const [isPublic, setPublic] = useState(initialChannel?.public || false);
    const [isClosed, setClosed] = useState(initialChannel?.closed || false);
    const navigate = useNavigate();
    const [validated, setValidated] = useState<boolean | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setValidated(true);
            const form = e.currentTarget as HTMLFormElement;
            if (form.checkValidity() === false) {
                e.stopPropagation();
                return;
            }
            const channel: ChannelResource = {
                id: initialChannel?.id || "",
                ownerId: userID || "",
                name: refName.current!.value,
                description: refDescription.current!.value,
                public: isPublic,
                closed: isClosed,
            };

            if (initialChannel) {
                await updateChannel(channel);
            } else {
                await createChannel(channel);
            }
            onSubmit(channel);
        } catch (err) {
            if (err instanceof ErrorFromValidation) {
                err.validationErrors.forEach((validationError) => {
                    switch (validationError.param) {
                        case "name":
                            refName.current?.setCustomValidity(validationError.msg);
                            break;
                        case "description":
                            refDescription.current?.setCustomValidity(validationError.msg);
                            break;
                    }
                });
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="col col-sm-6">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter channel name"
                    ref={refName}
                    minLength={5}
                    maxLength={100}
                    required
                    defaultValue={initialChannel?.name}
                />
                <Form.Control.Feedback type="invalid">{refName.current?.validationMessage}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formDescription" className="col col-sm-6">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter channel description"
                    ref={refDescription}
                    minLength={5}
                    maxLength={100}
                    required
                    defaultValue={initialChannel?.description}
                />
                <Form.Control.Feedback type="invalid">{refDescription.current?.validationMessage}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPublic">
                <Form.Check type="checkbox" label="Public" onChange={(e) => setPublic(e.target.checked)} checked={isPublic} />
            </Form.Group>
            <Form.Group controlId="formClosed">
                <Form.Check type="checkbox" label="Closed" onChange={(e) => setClosed(e.target.checked)} checked={isClosed} />
            </Form.Group>
            <br />
            <Button type="submit" variant="primary">
                Submit
            </Button>{" "}
            <Button variant="secondary" onClick={onCancel}>
                Cancel
            </Button>
        </Form>
    );
}

export default PageChannelForm;
