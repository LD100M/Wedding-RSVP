import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Description of an individual guest
// RI: name, guestOf, res cannot be ""
type Guest = {
  // name of the guest
  name: string;

  // is the guest a family member
  isFamily: boolean; 

  // Is the guest a guest of James or Molly, true if it's James's guest
  guestOf: string;

  // does the guest have any dietary restriction
  res: string;

  // the name of the additional guest if James or Molly brings one
  addName: string;

  // the dietary dietRes of the additional guest if James or Molly brings one
  addRes: string;

  // indicate if there is an additional guest
  hasAdd: number;
};

// Map from name to guest details.
const guests: Map<string, Guest> = new Map();

/** Testing function to remove all the added guests. */
export const resetForTesting = (): void => {
  guests.clear();
};

/**
 * Function sends back the array of all guests' names
 * @param _req the request
 * @param res the response
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  res.send({guests: vals}); 
};


/**
 * Add a guest to the list.
 * @param req the request
 * @param res the response
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {

  const name = req.body.name;
  if(typeof name !== 'string') {
    res.status(400).send("name is not a string");
    return;
  }

  const guestOf = req.body.guestOf;
  if(typeof guestOf !== 'string') {
    res.status(400).send("host parameter is not a string");
    return;
  }

  const isFamily = req.body.isFamily;
  if(typeof isFamily  !== "boolean") {
    res.status(400).send("isFamily is missing");
    return;
  }

  const additionalGuest: Guest = {name: name, isFamily: isFamily, guestOf: guestOf, res: "", addName: "", addRes: "", hasAdd: -1}

  guests.set(additionalGuest.name, additionalGuest);
  res.send({guest: additionalGuest});
}

/**
 * Retrieves the state of a Guest.
 * @param req the request
 * @param req the response
 */
export const getGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guestData = guests.get(name);
  if (guestData === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  res.send({guest: guestData});  
}


/**
 * Function updates the current state of a Guest.
 * @param req the request
 * @param req the response
 */
export const changeGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if(typeof name !== 'string') {
    res.status(400).send("name is not a string");
    return;
  }
  
  const diet = req.body.res;
  if (typeof diet !== "string") {
    res.status(400).send("diet restriction is not a string");
    return;
  }

  const guest = guests.get(name);
  if(guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  const hasAdd = req.body.hasAdd;
  if(typeof hasAdd !== "number") {
    res.status(400).send("should specify whether to bring additional guest");
    return;
  }

  const addName = req.body.addName;
  if(typeof addName !== "string") {
    res.status(400).send("should specify the additional guest name");
    return;
  }

  const addRes = req.body.addRes;
  if(typeof addRes !== "string") {
    res.status(400).send("should specify the additional guest's dietary restriction");
    return;
  }

  if(hasAdd === 1) {
    guest.addName = addName;
    guest.addRes = addRes;
  }
  else {
    guest.addName = "";
    guest.addRes = "";
  }
  
  guest.res = diet;
  guest.hasAdd = hasAdd;
  res.send({guest: guest});
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
