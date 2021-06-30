/*
Test Suite for testing set van status functionality
*/
const request = require('supertest');

const mongoose = require('mongoose')
const Van = require('../../model/van')

const app = require('../../app');

describe('Integration test: set van status open', () => {

    let agent = request.agent(app);

    let cookie = null;

    beforeAll(() => agent
        // send a POST request to login
        .post('/vendor')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        // send the username and password
        .send({
            vanName: 'SnackSquid',
            password: '1234qwer',
        })
        // when we get back the cookie, store it in a variable.
        // If the API server returns a token store it here instead
        // of the cookie
        .then((res) => {
            cookie = res
                .headers['set-cookie'][0]
                .split(',')
                .map(item => item.split(';')[0])
                .join(';')
        })

    );

    // Test 1: test van open
    test("check if van can open", async() => {
        let location = { location: "new location" }
        // get response from routes
        const response = await agent.post('/vendor/open-for-business/open').send(location);

        expect(response.statusCode).toBe(302);
        expect(response.text).toContain('/vendor/order');
    })


    // Test2: test close van
    test("check if van can close", async() => {
        const response = await agent
            .get('/vendor/profile/close');
        expect(response.statusCode).toBe(302);
        expect(response.text).toContain('/vendor/');
    })

    
});

