import React, { Component} from "react";
import { AddGuest } from "./AddGuest";
import { GuestList } from "./GuestList";
import { GuestDetails } from "./GuestDetails";

// the pages of the app
type Page = {kind: "list"} | {kind: "add"} | {kind: "details", name: string}

type WeddingAppState = {
  show: Page;
}

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {show: {kind: "list"}};
  }
  
  render = (): JSX.Element => {
    if(this.state.show.kind === "list") {
       return <GuestList onAddClick={this.doGuestClick} onNameClick={this.doNameClick}/>
    }
    else if(this.state.show.kind === "add") {
      return <AddGuest onBackClick={this.doBackClick}/>
    }
    else {
      return <GuestDetails name={this.state.show.name} onBackClick={this.doBackClick} />
    } 
  };

  // function switches the page back to the Guest List page
  doBackClick = (): void => {
    this.setState({show: {kind: "list"}});
  }

  // function switches the page from the Guest List to Add Guest 
  doGuestClick = (): void => {
    this.setState({show: {kind: "add"}});
  }

  // function switches the page from the Guest List to Guest Details
  doNameClick = (name: string): void => {
    this.setState({show: {kind: "details", name}});
  }
}