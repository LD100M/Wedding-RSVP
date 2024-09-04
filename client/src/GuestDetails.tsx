import React, { ChangeEvent, MouseEvent, Component} from 'react';
import { Guest, parseGuest } from "./Guest";
import {isRecord} from './record';

type detailProps = {
                    name: string
                    onBackClick: () => void
                    }

type detailState = {
                    guest: Guest | undefined,
                    hasAdd: number, 
                    res: string,
                    addRes: string,
                    addName: string,
                    errorMsg: string
                    }

/** 
 *  Shows the information about a guset, including his name, dietary restriction,
 *  whether he brings an additional guest, if so, the name and the dietary restriction
 *  of the additional guest. 
 */
export class GuestDetails extends Component<detailProps, detailState> {
    
    constructor(props: detailProps) {
        super(props)
        this.state = {guest: undefined, hasAdd: -1, res: "", addRes: "", addName: "", errorMsg: ""};
    }

    // function gets the data about the guest from the server when renders for the first time
    componentDidMount = () : void => {
        this.doInitializationClick();
    }

    render = (): JSX.Element => {
        if(this.state.guest === undefined){
            return <div></div>
        }else{
            return (
                <div>
                    <h2>Guest Details</h2>
                    {this.state.guest.isFamily ? 
                    (<p>{this.state.guest.name}, guest of {this.state.guest.guestOf}, family</p>) : 
                    (<p>{this.state.guest.name}, guest of {this.state.guest.guestOf} </p>)}

                    <p>Dietary Restrictions: (Specify "none" if none)</p>

                    <input type="text" value={this.state.res} onChange={this.doDietChange}></input> <br/>

                    <label htmlFor="numGuestSelect">Additional Guest?</label>

                    <select id="numGuestSelect" value={this.state.hasAdd+""} onChange={this.doGuestChange}>
                        <option value={"-1"}>Unknown</option>
                        <option value={"0"}>0</option>
                        <option value ={"1"}>1</option>
                    </select><br/>
                    {this.renderAdditionalGuest()}
                    <button onClick={this.doSaveClick}>Save</button>
                    <button onClick={this.doBackClick}>Back</button>
                    {this.renderError()}
                </div>
            )
        }
    };

    // function gets the initial information from the guest 
    doInitializationClick = (): void => {
        fetch("/api/getGuest?name=" + encodeURIComponent(this.props.name))
          .then(this.doGetResp)
          .catch(() => this.doGetError("failed to connect to server"));
    }

    // function checks the status number
    doGetResp = (res: Response): void => {
        if (res.status === 200) {
            res.json().then(this.doGetJson)
                .catch(() => this.doGetError("200 res is not JSON"));
        } else if (res.status === 400) {
            res.text().then(this.doGetError)
                .catch(() => this.doGetError("400 response is not text"));
        } else {
            this.doGetError(`bad status code from /api/getGuest: ${res.status}`);
        }
    };

    // function logs the error when fetch fails
    doGetError = (msg: string): void => {
        console.error(`Error fetching /api/getGuest: ${msg}`);
      };

    // function handles the json retrieved from the fetch
    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/getGuest: not a record", data);
            return;
        }
        this.doRetrieveGuestChange(data);
    }

    // function updates the state of the guest with the updated data
    doRetrieveGuestChange = (data: {guest?: unknown}): void => {
        const guest = parseGuest(data.guest);
        if (guest !== undefined) {
          this.setState({guest, hasAdd: guest.hasAdd, addName: guest.addName, addRes: guest.addRes, res: guest.res})
        } else {
          console.error("guest from /api/getGuest did not parse", data.guest)
        }
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

    // function renders the forms if an additional guest is provided
    renderAdditionalGuest = (): JSX.Element => {
        if(this.state.hasAdd === 1) {
            return <div>
                    <label htmlFor="additionalName">Guest Name: </label>
                    <input type="text" id="additionalName" value={this.state.addName} onChange={this.doAddNameChange}></input><br/>
                    <p>Guest Dietary Restrictions: (Specify "none" if none)</p>
                    <input type="text" value={this.state.addRes} onChange={this.doAddResChange}></input><br/>
                </div>
        }
        return <div></div>
    }

    // function saves the changes made to a guest
    doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.hasAdd === 1) {
            if(this.state.addName.trim().length === 0) {
                this.setState({errorMsg: " Must specify name of the guest"});
                return;
            }
            else if(this.state.addRes.trim().length === 0) {
                this.setState({errorMsg: " Must specify any dietary restrictions for the guest or 'none'."});
                return;
            }
            else if(this.state.res.trim().length === 0) {
                this.setState({errorMsg: " Must specify any dietary restrictions or 'none'."});
                return;
            }
        }
        else {
            if(this.state.res.trim().length === 0) {
                this.setState({errorMsg: " Must specify any dietary restrictions or 'none'."});
                return;
            }
        }

        const args = {name: this.props.name, res: this.state.res, hasAdd: this.state.hasAdd, addName: this.state.addName, addRes : this.state.addRes}
        fetch("/api/changeGuest", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
          .then(this.doUpdateResp)
          .catch(() => this.doUpdateError("failed to connect to server"));
    }

    // function checks the status number
    doUpdateResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doUpdateJson)
              .catch(() => this.doUpdateError("200 response is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doUpdateError)
              .catch(() => this.doUpdateError("400 response is not text"));
        } else {
          this.doUpdateError(`bad status code from /api/changeGuest: ${res.status}`);
        }
      };

    // function handles the json retrieved
    doUpdateJson = (data: unknown): void => {
        if (this.state.guest === undefined)
          throw new Error("impossible");
    
        if (!isRecord(data)) {
          console.error("bad data from /api/changeGuest: not a record", data);
          return;
        }
        this.doRetrieveGuestChange(data);
      };
    
    // function logs the error message when the fetch fails
    doUpdateError = (msg: string): void => {
        console.error(`Error fetching /api/changeGuest: ${msg}`);
    };

    // function swithes the page back to Guest List
    doBackClick = (): void => {
        this.props.onBackClick();
    }

    // function updates the information about the additional guest depending on whether one is provided
    doGuestChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        if(evt.target.value === "0") {
            this.setState({addName: "", hasAdd: 0})
        }
        else if(evt.target.value === "1") {
            this.setState({hasAdd: 1});
        }
        else {
            this.setState({addName: "", hasAdd: -1})
        }
    }

    // function changes the guest's dietary restriction
    doDietChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({res: evt.target.value, errorMsg: ""});
    }

    // function changes the additional guest's name
    doAddNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({addName: evt.target.value, errorMsg: ""});
    }

    // function changes the additional guest's dietary restriction
    doAddResChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({addRes: evt.target.value, errorMsg: ""});
    }
}

