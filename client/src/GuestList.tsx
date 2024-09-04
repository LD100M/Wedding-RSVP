import React, { Component, MouseEvent} from 'react';
import { Guest, parseGuest, findMinGuest, findMaxGuest, findFamily } from "./Guest";
import { List, explode_array } from './img/list';
import { isRecord } from './record';

type listProps = {
            onAddClick: () => void
            onNameClick: (name: string) => void
        }

type listState = {
             guests: Guest[] | undefined;
        }

/** Displays a list of guests as well as the summary information about the number of guests*/
export class GuestList extends Component<listProps,listState >  {

    constructor(props: listProps) {
        super(props);
        this.state = {guests: undefined}
    }  

    // function gets the data about the list of guests from the server when renders for the first time
    componentDidMount = (): void => {
        this.doRefreshClick();
    }
    
    render = (): JSX.Element => {
        if(this.state.guests !== undefined) {
            const guestList: List<Guest> = explode_array(this.state.guests)
            const minJamesGuest = findMinGuest(guestList, "James");
            const minMollyGuest = findMinGuest(guestList, "Molly"); 
            const maxJamesGuest = findMaxGuest(guestList, "James"); 
            const maxMollyGuest = findMaxGuest(guestList, "Molly");
            const jamesFamily =  findFamily(guestList, "James");
            const mollyFamily =  findFamily(guestList, "Molly");
            const jamesTotalGuest: string = (minJamesGuest === maxJamesGuest) ? maxJamesGuest + "" : minJamesGuest + "-" + maxJamesGuest;
            const mollyTotalGuest: string = (minMollyGuest === maxMollyGuest) ? maxMollyGuest + "" : minMollyGuest + "-" + maxMollyGuest;
            return (
                <div>
                    <h3>Guest List</h3>
                    {this.renderGuests()}     
                    <h4>Summary: </h4>
                    <div>
                        <p> {mollyTotalGuest} guest(s) of Molly ({mollyFamily} family)</p>
                        <p> {jamesTotalGuest} guest(s) of James ({jamesFamily} family)</p>
                    </div>
                    <button onClick={this.doAddClick}>Add Guest</button>
                </div>
            )
        }
        else {
            return <div>
                 <h3>Guest List</h3>
                 <h4>Summary: </h4>
                 <div>
                        <p> 0 guest(s) of Molly (0 family)</p>
                        <p> 0 guest(s) of James (0 family)</p>
                    </div>
                 <button onClick={this.doAddClick}>Add Guest</button>
            </div>;
        }
    }

    // function renders the list of guests on the screen
    renderGuests = (): JSX.Element => {
        if(this.state.guests === undefined) {
            return <p>Loading Guest List...</p>
        }
        else {
            const guestList : JSX.Element[] = [];

            for(const guest of this.state.guests) {
                if(guest.hasAdd === -1) {
                    guestList.push(<li key={guest.name}><a href="#" onClick = {(evt) => this.doNameClick(evt, guest.name)}>{guest.name}</a> Guest of {guest.guestOf} +1?</li>)
                }
                else {
                    if(guest.hasAdd === 1) {
                        guestList.push(<li key={guest.name}><a href="#" onClick = {(evt) => this.doNameClick(evt,guest.name)}>{guest.name}</a> Guest of {guest.guestOf} +1</li>)
                    }
                    else {
                        guestList.push(<li key={guest.name}><a href="#" onClick = {(evt) => this.doNameClick(evt,guest.name)}>{guest.name}</a> Guest of {guest.guestOf} +0</li>)
                    }
                }
            }
            return <ul>{guestList}</ul>
        }
    }

    // function gets the information about the list of guests
    doRefreshClick = (): void => {
        fetch("/api/listGuests").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    };
    
    // function checks the status number
    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doListJson)
                .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
            resp.text().then(this.doListError)
                .catch(() => this.doListError("400 response is not text"));
        } else {
            this.doListError(`bad status code from /api/listGuests: ${resp.status}`);
        }
    };
    
    // function handles the json retrieved from the fetch
    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/listGuests: not a record", data);
            return;
        }

        if (!Array.isArray(data.guests)) {
            console.error("bad data from /api/listGuests: guests is not an array", data);
            return;
        }
    
        const guests: Guest[] = [];
        for (const val of data.guests) {
            const guest = parseGuest(val);
            if (guest === undefined)
                return;
            guests.push(guest);
        }
        this.setState({guests}); 
      };
    
    
    // function logs the error when fetch fails
    doListError = (msg: string): void => {
        console.error(`Error fetching /api/listGuests: ${msg}`);
    };
    
   // function switches the page from the Guest List to Guest Details for the chosen guest
    doNameClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        evt.preventDefault();
        this.props.onNameClick(name);
    }

    // function switches the page from the Guest List to Add Guest 
    doAddClick = (): void => {
        this.props.onAddClick();
    }
}