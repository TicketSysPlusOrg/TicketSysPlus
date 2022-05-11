import React, { createRef } from "react";
import axios from "axios";

class PlayerForm extends React.Component {
    constructor(props) {
        super(props);
        this.inputFirstName = createRef();
        this.inputLastName = createRef();
        this.inputPhone = createRef();
        this.inputEmail = createRef();

        this.submitPlayer = this.submitPlayer.bind(this);
    }

    submitPlayer(event) {
    //stop page from reloading
        event.preventDefault();
        const theInputFirstName = this.inputFirstName.current.value;
        const theInputLastName = this.inputLastName.current.value;
        const theInputPhone = this.inputPhone.current.value;
        const theInputEmail = this.inputEmail.current.value;

        axios
            .post("http://localhost:4001/players", {
                firstName: theInputFirstName,
                lastName: theInputLastName,
                phone: theInputPhone,
                email: theInputEmail,
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="row">
                <div className="col ">
                    <h1 className="center">Add a New Player</h1>
                    <form className="col s12" onSubmit={this.submitPlayer.bind()}>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="firstName" ref={this.inputFirstName} type="text" />
                                <label htmlFor="firstName">First Name</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="lastName" ref={this.inputLastName} type="text" />
                                <label htmlFor="lastName">Last Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="phone" ref={this.inputPhone} type="text" />
                                <label htmlFor="phone">Phone</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="email" ref={this.inputEmail} type="text" />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <button
                            className="btn waves-effect waves-light "
                            type="submit"
                            name="action"
                        >
                            Add Player
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default PlayerForm;
