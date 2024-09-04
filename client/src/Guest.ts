import { List } from "./img/list";
import { isRecord } from "./record";

// Description of an individual guest
export type Guest = {
    // name of the guest
    readonly name: string;

    // is the guest a family member
    readonly isFamily: boolean; 

    // Is the guest a guest of James or Molly, true if it's James's guest
    readonly guestOf: string;

    // does the guest have any dietary restriction
    readonly res: string;

    // the name of the additional guest if James or Molly brings one
    readonly addName: string;

    // the dietary dietRes of the additional guest if James or Molly brings one
    readonly addRes: string;

    // indicate if there is an additional guest
    readonly hasAdd: number;
};

/**
 * Parses unknown data into Guest. Will log an error and return undefined
 * if it is not a valid Guest.
 * @param val unknown data to parse into a Guest
 * @return Guest if val is a valid Guest and undefined otherwise
 */
export const parseGuest = (val: unknown): undefined | Guest => {
  if (!isRecord(val)) {
    console.error("not an guest", val)
    return undefined;
  }

  if (typeof val.name !== "string") {
    console.error("not a Guest: missing 'name'", val)
    return undefined;
  }

  if (typeof val.isFamily !== "boolean") {
    console.error("not a Guest: missing 'isFamily'", val)
    return undefined;
  }

  if (typeof val.guestOf !== "string") {
    console.error("not an Guest: missing 'guestOf'", val)
    return undefined;
  }

  if (typeof val.res !== "string") {
    console.error("not a Guest: missing 'dietary dietRes'", val)
    return undefined;
  }

  if (typeof val.addName !== "string") {
    console.error("not a additional Guest: missing 'addtional guest name'", val)
    return undefined;
  }

  if (typeof val.addRes !== "string") {
    console.error("not a additional Guest: missing 'addtional guest dietary restriction'", val)
    return undefined;
  }

  if (typeof val.hasAdd !== "number") {
    console.error("not a additional Guest: missing 'has additional guest'", val)
    return undefined;
  }

  return {
    name: val.name, addName: val.addName, addRes: val.addRes, 
    isFamily: val.isFamily, guestOf: val.guestOf, res: val.res, hasAdd: val.hasAdd
  };
}; 


/**
 * function finds the minimum number of possible guests for James or Molly 
 * @param guests: the list of guests
 * @param guestOf: the person that the guest belongs to
 * @returns the minimum number of possible guests for James or Molly 
 */
export const findMinGuest = (guests: List<Guest>, guestOf: string): number => {
  if(guests.kind === "nil") {
      return 0;
  }
  else {                                                                     
      const currentGuest = guests.hd; 
      if(currentGuest.guestOf === guestOf && (currentGuest.hasAdd === -1 || currentGuest.hasAdd === 0)) {
          return 1 + findMinGuest(guests.tl, guestOf);
      }
      else if(currentGuest.guestOf === guestOf && (currentGuest.hasAdd !== -1 && currentGuest.hasAdd !== 0)) { 
          return 2+ findMinGuest(guests.tl, guestOf);
      }
      else {
          return findMinGuest(guests.tl, guestOf);
      }
  }
}

/**
 * function finds the maximum number of possible guests for James or Molly 
 * @param guests: the list of guests
 * @param guestOf: the person that the guest belongs to
 * @returns the maximum number of possible guests for James or Molly 
 */
export const findMaxGuest = (guests: List<Guest>, guestOf: string): number => {
  if(guests.kind === "nil") {
      return 0;
  }
  else {
      const currentGuest = guests.hd; 
      if(currentGuest.guestOf === guestOf && (currentGuest.hasAdd !== 0)) {
          return 2 + findMaxGuest(guests.tl, guestOf);
      }
      else if(currentGuest.guestOf === guestOf && currentGuest.hasAdd === 0) {
          return 1 + findMaxGuest(guests.tl, guestOf);
      }
      else {
          return findMaxGuest(guests.tl, guestOf);
      }
  }
}

/**
 * function finds the number of guests for James or Molly who are their family
 * @param guests: the list of guests
 * @param guestOf: the person that the guest belongs to
 * @returns the number of guests for James or Molly who are their family
 */
export const findFamily = (guests: List<Guest>, guestOf: string): number => {
  if(guests.kind === "nil") {
      return 0;
  }
  else {
      const currentGuest = guests.hd;
      if(currentGuest.guestOf === guestOf && currentGuest.isFamily) {
          return 1 + findFamily(guests.tl, guestOf);
      }
      else {
          return findFamily(guests.tl, guestOf);
      }
  }
}