
import React, { Fragment } from "react";
import { NavDropdown } from "react-bootstrap";
import { Button, Form, Modal, ModalDialog, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserIDFromJWT, login, logout } from "../backend/boardapi";
import { useUserIDContext } from "./UserIDContext";

export default function LoginDialog() {
    const { userID, setUserID } = useUserIDContext();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate()


    const [showDlg, setShowDlg] = React.useState(false);
    function show() { setShowDlg(true); }
    function hide() { setShowDlg(false); }




    async function onLogin(e: React.FormEvent) {
        e.preventDefault();
        const c = await login(email, password);
        const user = getUserIDFromJWT();
        localStorage.setItem("user-info", JSON.stringify(c))
        setUserID(user)
        if (c) {
            alert(`Data: ${JSON.stringify({ email, password })}`);
            setEmail(email);
            setPassword(password);

            onCancel()
            return true;
        } else {
            alert('Error Log in Check your Email or Password');
        }
        onCancel()

    }

    function onCancel() {
        hide()
    }


    return (
        <React.Fragment>
            <Fragment>
                <NavDropdown title={userID ? "User" : "Guest"} id="navbarScrollingDropdown">
                    {userID ?
                        <NavDropdown.Item onClick={() => { logout(); setUserID(undefined); }}>
                            logout
                        </NavDropdown.Item>
                        :
                        <NavDropdown.Item onClick={() => { show(); }} >
                            login
                        </NavDropdown.Item>
                    }
                </NavDropdown>
            </Fragment>

            <Modal backdrop="static" show={showDlg} centered onHide={hide}>
                <Modal.Header closeButton><Modal.Title>Login</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="emailForm">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                id="email"
                                type="email"
                                autoFocus
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="passwordForm">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                id="password"
                                type="password"
                                autoFocus
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="cancel" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button id="loggin" variant="primary" onClick={onLogin}>Login</Button>
                </Modal.Footer>
            </Modal >
        </React.Fragment >
    )
}

