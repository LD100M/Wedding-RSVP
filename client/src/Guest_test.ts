import { findMinGuest, parseGuest, Guest, findMaxGuest, findFamily } from "./Guest";
import * as assert from 'assert';
import { cons, nil } from "./img/list";

describe ("Guest", function() {
    const guest1: Guest = {name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: "a", hasAdd: 0}; 
    const guest2: Guest = {name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: "b", hasAdd: -1};
    const guest5: Guest = {name: "kid", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: "a", hasAdd: 0}; 
    const guest6: Guest = {name: "lol", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: "b", hasAdd: -1};
    const guest3: Guest = {name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: "a", hasAdd: 1}; 
    const guest4: Guest = {name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: "b", hasAdd: 1};
    const guest7: Guest = {name: "muda", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: "a", hasAdd: 1}; 
    const guest8: Guest = {name: "ora", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: "b", hasAdd: 1};
    const guest9: Guest = {name: "lunjia", isFamily: true, guestOf: "Jes", res: "cheese", addName: "a", addRes: "a", hasAdd: 0}; 
    const guest10: Guest = {name: "dai", isFamily: false, guestOf: "Mhappyly", res: "cheese", addName: "b", addRes: "b", hasAdd: -1};

    it("parseGuest", function() {
        // first branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest("Hello"), undefined);
        assert.deepStrictEqual(parseGuest("Hello"), undefined);

        // second branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: 1, isFamily: true, guestOf: "James", res: "cheese", addName:"peter", addRes: "apple", hasAdd: 1}), undefined);
        assert.deepStrictEqual(parseGuest({name: 1, isFamily: false, guestOf: "Molly", res: "cheese", addName:"Jack", addRes: "orange", hasAdd: 1}), undefined);

        // third branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: 1, guestOf: "James", res: "cheese", addName:"peter", addRes: "apple", hasAdd: 1}), undefined);
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: 2, guestOf: "Molly", res: "cheese", addName:"Jack", addRes: "orange", hasAdd: 1}), undefined);

        // fourth branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: true, guestOf: 1, res: "cheese", addName:"peter", addRes: "apple", hasAdd: 1}), undefined);
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: false, guestOf: 2, res: "cheese", addName:"Jack", addRes: "orange", hasAdd: 1}), undefined);

        // fifth branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: true, guestOf: 1, res: 0, addName:"peter", addRes: "apple", hasAdd: 1}), undefined);
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: false, guestOf: 2, res: 2, addName:"Jack", addRes: "orange", hasAdd: 1}), undefined);

        // sixth branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: 0, addRes: "apple", hasAdd: 1}), undefined);
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: 1, addRes: "orange", hasAdd: 1}), undefined);

        // seventh branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: 1, hasAdd: 1}), undefined);
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: 2, hasAdd: 1}), undefined);

        // eigth branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: 1, hasAdd: "a"}), undefined);
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: 2, hasAdd: "b"}), undefined);

        // ninth branch, straight line code, 2 tests
        assert.deepStrictEqual(parseGuest({name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: "a", hasAdd: 1}), {name: "lunjia", isFamily: true, guestOf: "James", res: "cheese", addName: "a", addRes: "a", hasAdd: 1});
        assert.deepStrictEqual(parseGuest({name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: "b", hasAdd: 1}), {name: "dai", isFamily: false, guestOf: "Molly", res: "cheese", addName: "b", addRes: "b", hasAdd: 1});
    }) 
    
    it("findMinGuest", function() {
        // 0-1-many hueristic: zero recursive call case
        assert.deepStrictEqual(findMinGuest(nil, "James"), 0);
        assert.deepStrictEqual(findMinGuest(nil, "Molly"), 0);

        // 0-1-many hueristic: one recursive call case (6 tests) 
        assert.deepStrictEqual(findMinGuest(cons(guest1, nil), "James"), 1);
        assert.deepStrictEqual(findMinGuest(cons(guest2, nil), "Molly"), 1);

        assert.deepStrictEqual(findMinGuest(cons(guest3, nil), "James"), 2);
        assert.deepStrictEqual(findMinGuest(cons(guest4, nil), "Molly"), 2);

        assert.deepStrictEqual(findMinGuest(cons(guest3, nil), "Jams"), 0);
        assert.deepStrictEqual(findMinGuest(cons(guest4, nil), "Mlly"), 0);

        // 0-1-many hueristic: more than 1 recursive calls case (2nd to 2nd)
        assert.deepStrictEqual(findMinGuest(cons(guest1, cons(guest5, nil)), "James"), 2);
        assert.deepStrictEqual(findMinGuest(cons(guest2, cons(guest6, nil)), "Molly"), 2);

        // 0-1-many hueristic: more than 1 recursive calls case (3rd to 3rd)
        assert.deepStrictEqual(findMinGuest(cons(guest3, cons(guest7, nil)), "James"), 4);
        assert.deepStrictEqual(findMinGuest(cons(guest4, cons(guest8, nil)), "Molly"), 4);

        // 0-1-many hueristic: more than 1 recursive calls case (4th to 4th)
        assert.deepStrictEqual(findMinGuest(cons(guest3, cons(guest7, nil)), "Jam"), 0);
        assert.deepStrictEqual(findMinGuest(cons(guest4, cons(guest8, nil)), "My"), 0);

        // 0-1-many hueristic: more than 1 recursive calls case (2nd to 3rd)
        assert.deepStrictEqual(findMinGuest(cons(guest3, cons(guest5, nil)), "James"), 3);
        assert.deepStrictEqual(findMinGuest(cons(guest4, cons(guest6, nil)), "Molly"), 3);

        // 0-1-many hueristic: more than 1 recursive calls case (2nd to 4th)
        assert.deepStrictEqual(findMinGuest(cons(guest1, cons(guest9, nil)), "James"), 1);
        assert.deepStrictEqual(findMinGuest(cons(guest2, cons(guest10, nil)), "Molly"), 1);

        // 0-1-many hueristic: more than 1 recursive calls case (3rd to 4th)
        assert.deepStrictEqual(findMinGuest(cons(guest3, cons(guest9, nil)), "James"), 2);
        assert.deepStrictEqual(findMinGuest(cons(guest4, cons(guest10, nil)), "Molly"), 2);
    }) 

    it("findMaxGuest", function() {
        // 0-1-many hueristic: zero recursive call case
        assert.deepStrictEqual(findMaxGuest(nil, "James"), 0);
        assert.deepStrictEqual(findMaxGuest(nil, "Molly"), 0);

        // 0-1-many hueristic: one recursive call case (6 tests) 
        assert.deepStrictEqual(findMaxGuest(cons(guest3, nil), "James"), 2);
        assert.deepStrictEqual(findMaxGuest(cons(guest4, nil), "Molly"), 2);

        assert.deepStrictEqual(findMaxGuest(cons(guest1, nil), "James"), 1);
        assert.deepStrictEqual(findMaxGuest(cons(guest5, nil), "James"), 1);

        assert.deepStrictEqual(findMaxGuest(cons(guest1, nil), "Jaes"), 0);
        assert.deepStrictEqual(findMaxGuest(cons(guest5, nil), "Jams"), 0);

        // 0-1-many hueristic: more than 1 recursive calls case (2nd to 2nd)
        assert.deepStrictEqual(findMaxGuest(cons(guest3, cons(guest7, nil)), "James"), 4);
        assert.deepStrictEqual(findMaxGuest(cons(guest7, cons(guest3, nil)), "James"), 4);

        // 0-1-many hueristic: more than 1 recursive calls case (3rd to 3rd)
        assert.deepStrictEqual(findMaxGuest(cons(guest1, cons(guest5, nil)), "James"), 2);
        assert.deepStrictEqual(findMaxGuest(cons(guest5, cons(guest1, nil)), "James"), 2);

        // 0-1-many hueristic: more than 1 recursive calls case (4th to 4th)
        assert.deepStrictEqual(findMaxGuest(cons(guest1, cons(guest5, nil)), "muda"), 0);
        assert.deepStrictEqual(findMaxGuest(cons(guest5, cons(guest1, nil)), "ora"), 0);

        // 0-1-many hueristic: more than 1 recursive calls case (2nd to 3rd)
        assert.deepStrictEqual(findMaxGuest(cons(guest7, cons(guest5, nil)), "James"), 3);
        assert.deepStrictEqual(findMaxGuest(cons(guest7, cons(guest1, nil)), "James"), 3);

        // 0-1-many hueristic: more than 1 recursive calls case (2nd to 4th)
        assert.deepStrictEqual(findMaxGuest(cons(guest7, cons(guest9, nil)), "James"), 2);
        assert.deepStrictEqual(findMaxGuest(cons(guest7, cons(guest10, nil)), "James"), 2);

        // 0-1-many hueristic: more than 1 recursive calls case (3rd to 4th)
        assert.deepStrictEqual(findMaxGuest(cons(guest5, cons(guest9, nil)), "James"), 1);
        assert.deepStrictEqual(findMaxGuest(cons(guest5, cons(guest10, nil)), "James"),1);
    })

    it("findFamily", function() {
        // 0-1-many hueristic: zero recursive call case
        assert.deepStrictEqual(findFamily(nil, "James"), 0);
        assert.deepStrictEqual(findFamily(nil, "Molly"), 0);

        // 0-1-many hueristic: one recursive call case
        assert.deepStrictEqual(findFamily(cons(guest1, nil), "James"), 1);
        assert.deepStrictEqual(findFamily(cons(guest3, nil), "James"), 1);

        assert.deepStrictEqual(findFamily(cons(guest1, nil), "Jamdes"), 0);
        assert.deepStrictEqual(findFamily(cons(guest2, nil), "Mod"), 0);

        // 0-1-many hueristic: more than 1 recursive call case(2nd to 2nd)
        assert.deepStrictEqual(findFamily(cons(guest1, cons(guest1, nil)), "James"), 2);
        assert.deepStrictEqual(findFamily(cons(guest3, cons(guest3, nil)), "James"), 2);

        // 0-1-many hueristic: more than 1 recursive call case(3rd to 3rd)
        assert.deepStrictEqual(findFamily(cons(guest1, cons(guest1, nil)), "Jam"), 0);
        assert.deepStrictEqual(findFamily(cons(guest3, cons(guest3, nil)), "Jaes"), 0);

        // 0-1-many hueristic: more than 1 recursive call case(2nd to 2nd)
        assert.deepStrictEqual(findFamily(cons(guest1, cons(guest10, nil)), "James"), 1);
        assert.deepStrictEqual(findFamily(cons(guest3, cons(guest10, nil)), "James"), 1);

        assert.deepStrictEqual(findFamily(cons(guest10, cons(guest1, nil)), "James"), 1);
        assert.deepStrictEqual(findFamily(cons(guest10, cons(guest3, nil)), "James"), 1);
    })
})