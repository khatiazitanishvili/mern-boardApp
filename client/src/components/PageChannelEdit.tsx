// import React, { useState } from "react";
// import { Button, Card, Container, Form } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import { createChannel, ErrorFromValidation, getChannel, updateChannel } from "../backend/boardapi";
// import { ChannelResource } from "../ChannelResources";
// import { useUserIDContext } from "./UserIDContext";


// function PageChannelEdit() {
//     const { userID, setUserID } = useUserIDContext();
//     const refName = React.useRef<HTMLInputElement>(null);
//     const refDescription = React.useRef<HTMLInputElement>(null);

//     const [isPublic, setPublic] = React.useState(false);
//     const [isClosed, setClosed] = React.useState(false);
//     let navigate = useNavigate();
//     const [validated, setValidated] = React.useState<boolean | undefined>();

//     const [channel, setChannel] = React.useState<ChannelResource | null>(null);
//     const params = useParams();
//     const channelID = params.channelID;





//     function handleNav() {
//         navigate("/board");
//     }






//     async function onUpdate(e: React.FormEvent) {
//         try {
//             e.preventDefault();
//             setValidated(true);
//             const form = e.currentTarget as HTMLFormElement;
//             if (form.checkValidity() === false) {
//                 e.stopPropagation(); return;
//             }
//             const myEntry = {
//                 id: channelID,
//                 ownerId: userID,
//                 name: refName.current!.value,
//                 description: refDescription.current!.value,
//                 public: isPublic,
//                 closed: isClosed

//             } as ChannelResource;

//             console.log(updateChannel(myEntry));
//             handleNav();


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
//         <div>


//             <Form onSubmit={onUpdate} style={{ margin: '50px' }}>
//                 <Form.Group controlId='formName' className="col col-sm-6">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control type='text' name='name' placeholder='update name' ref={refName} minLength={5} maxLength={100} required />
//                     <Form.Control.Feedback type="invalid">{refName.current?.validationMessage}</Form.Control.Feedback>
//                 </Form.Group>
//                 <Form.Group controlId='formDescription' className="col col-sm-6">
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control type='text' name='description' placeholder='update description' ref={refDescription} minLength={5} maxLength={100} required />
//                     <Form.Control.Feedback type="invalid">{refDescription.current?.validationMessage}</Form.Control.Feedback>
//                 </Form.Group>
//                 <Form.Group controlId='formPublic'>
//                     <Form.Check type='checkbox' label='Public' onChange={e => setPublic(e.target.checked)} />
//                 </Form.Group>
//                 <Form.Group controlId='formClosed'>
//                     <Form.Check type='checkbox' label='Closed' onChange={e => setClosed(e.target.checked)} />
//                 </Form.Group><br></br>
//                 <Button type="submit" variant="primary">Submit</Button>{' '}
//                 <Button variant="secondary" onClick={handleNav}>Cancel</Button>

//             </Form>


//         </div>
//     )
// }


// export default PageChannelEdit;


import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChannel } from "../backend/boardapi";
import PageChannelForm from "./PageChannelForm";
import { ChannelResource } from "../ChannelResources";

function PageChannelEdit() {
    const navigate = useNavigate();
    const { channelID } = useParams();
    const [channel, setChannel] = React.useState<ChannelResource | null>(null);

    React.useEffect(() => {
        const fetchChannel = async () => {
            const fetchedChannel = await getChannel(channelID!);
            setChannel(fetchedChannel);
        };

        fetchChannel();
    }, [channelID]);

    const handleUpdate = (updatedChannel: ChannelResource) => {
        navigate("/");
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div>
            <h1>Edit Channel</h1>
            {channel ? (
                <PageChannelForm onSubmit={handleUpdate} onCancel={handleCancel} initialChannel={channel} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default PageChannelEdit;
