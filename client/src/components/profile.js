import { useState } from "react";
import Profilepic from "./profilepic";
import Bioeditor from "./bioeditor";
import { Button, Modal, Stack, Form, Row, Col } from "react-bootstrap";

export default function Profile(props) {
    return (
        <Form>
            <Row>
                <Col sm={3}>
                    <Profilepic src={props.src} size={"large"} />
                </Col>
                <Col sm={4}>
                    <h1>
                        {props.user.firstname}
                        <span></span>
                        {props.user.lastname}
                    </h1>
                    <Bioeditor
                        bio={props.bio || props.user.bio}
                        bioUpdated={props.bioUpdated}
                    />
                </Col>
            </Row>
        </Form>
    );
}
