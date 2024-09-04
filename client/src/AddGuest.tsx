import React, { Component, ChangeEvent, MouseEvent} from 'react';
import { isRecord } from './record';

type addProps = {
            onBackClick: () => void
            }

type addState = {
                 name: string
                 guestOf: string
                 isFamily: boolean
                 errorMsg: string
                }

/** show the page about adding a guest, includes the name of the guest and his/her dietary restriction */
export class AddGuest extends Component<addProps, addState> {

    constructor(props: addProps) {
        super(props);
        this.state = {name: "", guestOf: "", isFamily: false, errorMsg: ""};
    }

    render = (): JSX.Element => {
        return (
            <div>
                <h3>Add Guest</h3>
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" value={this.state.name} onChange={this.doNameChange}/>
                <p>Guest of: </p>
                <input type="radio" id="Molly" name="person" value="Molly" checked={this.state.guestOf === 'Molly'} onChange={this.doGuestOfChange} />
                <label htmlFor="Molly">Molly</label><br/>
                <input type="radio" id="James" name="person" value="James" checked={this.state.guestOf === 'James'} onChange={this.doGuestOfChange}/>
                <label htmlFor="James">James</label><br/>
                <input onChange={this.doFamilyChange} type="checkbox" id="option1" checked={this.state.isFamily}/>
                <label htmlFor="option1">Family?</label><br/>
                <button onClick={this.doAddClick}>Add</button>
                <button onClick={this.doBackClick}>Back</button>
                {this.renderError()}
            </div>
        )}
    
    // function updates the name of the added guest
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value});
    }

    // function updates whether the guest is a family member
    doFamilyChange = (): void => {
        this.setState({isFamily: !(this.state.isFamily)});
    }

    // function adds the information of the guest to the server
    doAddClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.name.trim() === "") {
            this.setState({errorMsg: "Name should not be empty"});
            return;
        }
        else if(this.state.guestOf.trim() === "") {
            this.setState({errorMsg: "host is required"});
            return;
        }
        
        const args = {name: this.state.name, guestOf: this.state.guestOf, isFamily: this.state.isFamily, }
        fetch("/api/addGuest", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
          .then(this.doAddResp)
          .catch(() => this.doAddError("failed to connect to server"));
    }

    // function handles the status number
    doAddResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doAddJson)
              .catch(() => this.doAddError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doAddError)
              .catch(() => this.doAddError("400 response is not text"));
        } else {
          this.doAddError(`bad status code from /api/addGuest: ${resp.status}`);
        }
      };
    
    // function handles the json retrieved
    doAddJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/addGuest: not a record", data);
            return;
         }
        this.props.onBackClick();  
    };

    // function logs error if the fetch fails
    doAddError = (msg: string): void => {
        this.setState({errorMsg: msg})
    };

    // function swithches the page to the Guest List page
    doBackClick = (): void => {
        this.props.onBackClick();
        this.setState({name: "", guestOf: "", isFamily: false});
    }

    // function updates the status of who the guest belongs to 
    doGuestOfChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({guestOf: evt.target.value});
    }

    // function renders the error message
    renderError = (): JSX.Element => {
        if(this.state.errorMsg === "") {
            return <div></div>
        }
        else {
            return <div>Error: {this.state.errorMsg}</div>
        }
    }
}