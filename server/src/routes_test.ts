import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addGuest, changeGuest, getGuest, listGuests, resetForTesting } from './routes';

describe('routes', function() {

  it('addGuest', function() {
    // First Branch, straight line code, Error Case
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {guestOf: "James", isFamily: true}});
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
                            "name is not a string");

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {guestOf: "Molly", isFamily: true}});
    const res2 = httpMocks.createResponse();
    addGuest(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
                            "name is not a string");


    // Second Branch, straight line code, Error Case
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Lunjia", isFamily: true}});
    const res3 = httpMocks.createResponse();
    addGuest(req3, res3);

    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
                    "host parameter is not a string");
    
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Kevin", isFamily: true}});
    const res4 = httpMocks.createResponse();
    addGuest(req4, res4);

    assert.deepStrictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
                    "host parameter is not a string");

    // Third Branch, straight line code, Error Case
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Lunjia", guestOf: "James"}});
    const res5 = httpMocks.createResponse();
    addGuest(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
                                "isFamily is missing");
    
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Lunjia", guestOf: "James"}});
    const res6 = httpMocks.createResponse();
    addGuest(req6, res6);

    assert.deepStrictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
                                "isFamily is missing");

    // Fourth Branch, straight line code
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Lunjia", guestOf: "James", isFamily: false}});
    const res7 = httpMocks.createResponse();
    addGuest(req7, res7);
    
    assert.deepStrictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData(), {guest: {name: "Lunjia", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1}});

    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Kevin", guestOf: "James", isFamily: false}});
    const res8 = httpMocks.createResponse();
    addGuest(req8, res8);
    
    assert.deepStrictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData(), {guest: {name: "Kevin", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1}});

    resetForTesting();
  });

  it('listGuests', function() {
    // Straight line code

    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Lunjia", guestOf: "James", isFamily: false}});
    const res7 = httpMocks.createResponse();
    addGuest(req7, res7);
    
    
    const req = httpMocks.createRequest({method: 'GET', url: '/listGuests'});
    const res = httpMocks.createResponse();
    listGuests(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {guests:[{name: "Lunjia", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1}]});
    
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Kevin", guestOf: "James", isFamily: false}});
    const res8 = httpMocks.createResponse();
    addGuest(req8, res8);

    const req2 = httpMocks.createRequest({method: 'GET', url: '/listGuests'});
    const res2 = httpMocks.createResponse();
    listGuests(req2, res2);
    assert.deepStrictEqual(res2._getData(), {guests:[{name: "Lunjia", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1},{name: "Kevin", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1}]});

    resetForTesting();
  }); 

  it('getGuest', function() {
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Kevi", guestOf: "James", isFamily: false}});
    const res8 = httpMocks.createResponse();
    addGuest(req8, res8);

    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Kev", guestOf: "James", isFamily: false}});
    const res9 = httpMocks.createResponse();
    addGuest(req9, res9);

    // First Branch, Straight line code, Error case
    const req = httpMocks.createRequest({method: 'GET', url: '/getGuest', query: {}});
    const res = httpMocks.createResponse();
    getGuest(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), "missing 'name' parameter");

    const req2 = httpMocks.createRequest({method: 'GET', url: '/getGuest', query: {df: "dfsf"}});
    const res2 = httpMocks.createResponse();
    getGuest(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'name' parameter");

    // Second Branch, Straight line code, Error case
    const req3 = httpMocks.createRequest({method: 'GET', url: '/getGuest', query: {name: "James"}});
    const res3 = httpMocks.createResponse();
    getGuest(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "no guest with name 'James'");

    const req4 = httpMocks.createRequest({method: 'GET', url: '/getGuest', query: {name: "Kevin"}});
    const res4 = httpMocks.createResponse();
    getGuest(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "no guest with name 'Kevin'");

    // Third Branch, Straight line code
    const req5 = httpMocks.createRequest({method: 'GET', url: '/getGuest', query: {name: "Kevi"}});
    const res5 = httpMocks.createResponse();
    getGuest(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {guest: {name: "Kevi", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1}});

    const req6 = httpMocks.createRequest({method: 'GET', url: '/getGuest', query: {name: "Kev"}});
    const res6 = httpMocks.createResponse();
    getGuest(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {guest: {name: "Kev", isFamily: false, guestOf: "James", res: "", addName: "", addRes: "", hasAdd: -1}});
    
    resetForTesting();
  });

  it('changeGuest', function() {
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "Kevin", guestOf: "James", isFamily: false}});
    const res = httpMocks.createResponse();
    addGuest(req, res);

    const req100 = httpMocks.createRequest(
        {method: 'POST', url: '/addGuest', body: {name: "James", guestOf: "James", isFamily: false}});
    const res100 = httpMocks.createResponse();
    addGuest(req100, res100);

    // First Branch, Straight line code, Error case
    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {}});
    const res9 = httpMocks.createResponse();
    changeGuest(req9, res9);

    assert.deepStrictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
                            "name is not a string");
    
    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {}});
    const res10 = httpMocks.createResponse();
    changeGuest(req10, res10);

    assert.deepStrictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(),
                            "name is not a string");

    // Second Branch, Straight line code, Error case
    const req11 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "James"}});
    const res11 = httpMocks.createResponse();
    changeGuest(req11, res11);

    assert.deepStrictEqual(res11._getStatusCode(), 400);
    assert.deepStrictEqual(res11._getData(),
                            "diet restriction is not a string");
    
    const req12 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin"}});
    const res12 = httpMocks.createResponse();
    changeGuest(req12, res12);

    assert.deepStrictEqual(res12._getStatusCode(), 400);
    assert.deepStrictEqual(res12._getData(),
                            "diet restriction is not a string");
    
    // Third Branch, Straight line code, Error case
    const req39 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "sfsjksjkfjk", res: "dsfsd"}});
    const res39 = httpMocks.createResponse();
    changeGuest(req39, res39);

    assert.deepStrictEqual(res39._getStatusCode(), 400);
    assert.deepStrictEqual(res39._getData(),
    "no guest with name 'sfsjksjkfjk'");
    
    const req40 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "kskfsif9324n234", res: "cheese"}});
    const res40 = httpMocks.createResponse();
    changeGuest(req40, res40);

    assert.deepStrictEqual(res40._getStatusCode(), 400);
    assert.deepStrictEqual(res40._getData(),
    "no guest with name 'kskfsif9324n234'");


    // Foruth Branch, Straight line code, Error case
    const req13 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "James", res: "dsfsd"}});
    const res13 = httpMocks.createResponse();
    changeGuest(req13, res13);

    assert.deepStrictEqual(res13._getStatusCode(), 400);
    assert.deepStrictEqual(res13._getData(),
    "should specify whether to bring additional guest");
    
    const req14 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese"}});
    const res14 = httpMocks.createResponse();
    changeGuest(req14, res14);

    assert.deepStrictEqual(res14._getStatusCode(), 400);
    assert.deepStrictEqual(res14._getData(),
    "should specify whether to bring additional guest");

    // Fifth Branch, Straight line code, Error case
    const req15 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "James", res: "dsfsd", hasAdd: 1}});
    const res15 = httpMocks.createResponse();
    changeGuest(req15, res15);

    assert.deepStrictEqual(res15._getStatusCode(), 400);
    assert.deepStrictEqual(res15._getData(),
    "should specify the additional guest name");
    
    const req16 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese", hasAdd: 1}});
    const res16 = httpMocks.createResponse();
    changeGuest(req16, res16);

    assert.deepStrictEqual(res16._getStatusCode(), 400);
    assert.deepStrictEqual(res16._getData(),
    "should specify the additional guest name");

    // Sixth Branch, Straight line code, Error case
    const req17 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "James", res: "dsfsd", hasAdd: 1, addName: "fd"}});
    const res17 = httpMocks.createResponse();
    changeGuest(req17, res17);

    assert.deepStrictEqual(res17._getStatusCode(), 400);
    assert.deepStrictEqual(res17._getData(),
    "should specify the additional guest's dietary restriction");
    
    const req18 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese", hasAdd: 1, addName: "fds"}});
    const res18 = httpMocks.createResponse();
    changeGuest(req18, res18);

    assert.deepStrictEqual(res18._getStatusCode(), 400);
    assert.deepStrictEqual(res18._getData(),
    "should specify the additional guest's dietary restriction");

    // Seventh Branch, Straight line code 
    const req19 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese", hasAdd: 1, addName: "lol", addRes: "none"}});
    const res19 = httpMocks.createResponse();
    changeGuest(req19, res19);

    assert.deepStrictEqual(res19._getStatusCode(), 200);
    assert.deepStrictEqual(res19._getData(), {guest: {name: "Kevin", isFamily: false, guestOf: "James", res: "cheese", addName: "lol", addRes: "none", hasAdd: 1}});
    
    const req20 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese", hasAdd: 1, addName: "lolo", addRes: "none"}});
    const res20 = httpMocks.createResponse();
    changeGuest(req20, res20);

    assert.deepStrictEqual(res20._getStatusCode(), 200);
    assert.deepStrictEqual(res20._getData(), {guest: {name: "Kevin", isFamily: false, guestOf: "James", res: "cheese", addName: "lolo", addRes: "none", hasAdd: 1}});
    
    // Eighth Branch, Straight line code
    const req21 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese", hasAdd: 0, addName: "lol", addRes: "none"}});
    const res21 = httpMocks.createResponse();
    changeGuest(req21, res21);

    assert.deepStrictEqual(res21._getStatusCode(), 200);
    assert.deepStrictEqual(res21._getData(), {guest: {name: "Kevin", isFamily: false, guestOf: "James", res: "cheese", addName: "", addRes: "", hasAdd: 0}});

    const req22 = httpMocks.createRequest(
        {method: 'POST', url: '/changeGuest', body: {name: "Kevin", res: "cheese", hasAdd: 0, addName: "fs89fsiufsjk", addRes: "none"}});
    const res22 = httpMocks.createResponse();
    changeGuest(req22, res22);

    assert.deepStrictEqual(res22._getStatusCode(), 200);
    assert.deepStrictEqual(res22._getData(), {guest: {name: "Kevin", isFamily: false, guestOf: "James", res: "cheese", addName: "", addRes: "", hasAdd: 0}});

    resetForTesting();
  });

});
