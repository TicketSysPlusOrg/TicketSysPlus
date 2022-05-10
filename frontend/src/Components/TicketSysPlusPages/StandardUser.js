import React from 'react';
import NavBarHeader from "../NavBarHeader";
import PrjSideBar from "../StandardUser/ProjectsSideBar";
import UserTickets from "../StandardUser/userTickets";
import {Container, Row} from 'react-bootstrap'

function StandardUser(props) {
    return(
        <>
            <NavBarHeader />
            <div className="row">

                <div className="col-3 " id="sidebar"><PrjSideBar /></div>

                <div className="col-8">
                    <h3 className="ms-5 ps-5 mt-5">Standard User Page</h3>

                    <Container>
                        <Row>
                            <UserTickets />
                        </Row>
                    </Container>

                </div>

            </div>

        </>
    );
}

export default StandardUser;