// import React, { useState } from "react";
// import { Button, Card, Container, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { createChannel, ErrorFromValidation } from "../backend/boardapi";
// import { ChannelResource } from "../ChannelResources";
// import { useUserIDContext } from "./UserIDContext";


// function PageChannelCreate() {

//     const { userID } = useUserIDContext();
//     const refName = React.useRef<HTMLInputElement>(null);
//     const refDescription = React.useRef<HTMLInputElement>(null);

//     const [isPublic, setPublic] = React.useState(false);
//     const [isClosed, setClosed] = React.useState(false);
//     let navigate = useNavigate();
//     const [validated, setValidated] = React.useState<boolean | undefined>();


//     async function onCreate(e: React.FormEvent) {
//         try {
//             e.preventDefault();
//             setValidated(true);
//             const form = e.currentTarget as HTMLFormElement;
//             if (form.checkValidity() === false) {
//                 e.stopPropagation(); return;
//             }
//             const myEntry = {
//                 ownerId: userID,
//                 name: refName.current!.value,
//                 description: refDescription.current!.value,
//                 public: isPublic,
//                 closed: isClosed

//             } as ChannelResource;

//             console.log(createChannel(myEntry));
//             navigate(`/`)


//         } catch (err) {
//             if (err instanceof ErrorFromValidation) {
//                 err.validationErrors.forEach((validationError) => {
//                     switch (validationError.param) {
//                         case "name": refName.current?.setCustomValidity(validationError.msg); break;
//                         case "description": refDescription.current?.setCustomValidity(validationError.msg); break;
//                     }
//                 });
//             }
//         }
//     }

//     return (
//         <Form onSubmit={onCreate}>
//             <Form.Group controlId='formName' className="col col-sm-6">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control type='text' name='name' placeholder='write channel name' ref={refName} minLength={5} maxLength={100} required />
//                 <Form.Control.Feedback type="invalid">{refName.current?.validationMessage}</Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId='formDescription' className="col col-sm-6">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control type='text' name='description' placeholder='write channel descrioption' ref={refDescription} minLength={5} maxLength={100} required />
//                 <Form.Control.Feedback type="invalid">{refDescription.current?.validationMessage}</Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId='formPublic'>
//                 <Form.Check type='checkbox' label='Public' onChange={e => setPublic(e.target.checked)} />
//             </Form.Group>
//             <Form.Group controlId='formClosed'>
//                 <Form.Check type='checkbox' label='Closed' onChange={e => setClosed(e.target.checked)} />
//             </Form.Group><br></br>
//             <Button type="submit" variant="primary">Submit</Button>{' '}
//             <Button type="submit" variant="secondary" href="/">Cancel</Button>

//         </Form>
//     )
// }


// export default PageChannelCreate;


import React from "react";
import { useNavigate } from "react-router-dom";
import PageChannelForm from "./PageChannelForm";
import { ChannelResource } from "../ChannelResources";

function PageChannelCreate() {
    const navigate = useNavigate();

    const handleCreate = (channel: ChannelResource) => {
        navigate("/");
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div>
            <h1>Create Channel</h1>
            <PageChannelForm onSubmit={handleCreate} onCancel={handleCancel} />
        </div>
    );
}

export default PageChannelCreate;
