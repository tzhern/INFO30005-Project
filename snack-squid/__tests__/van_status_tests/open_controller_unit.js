const openController = require("../../controllers/vendor/openController");
const Van = require('../../model/van');

describe('openController', function() {
    const res = {
        redirect: jest.fn()
}

    //  properties needed for request to test
    //  openForBusiness
    const req = {
        session:{vanId: '60ab52f48210f61385c3d5a7'},
        body: {location: "peter hall"}
    };

    beforeAll(() => {
        // clear the render method (also read about mockReset)
        res.redirect.mockClear();
        
        // mock the Mongoose updateOne method
        Van.updateOne = jest.fn().mockResolvedValue([
            {
                _id: '60b22de29833ae2d9238ddf7',
                vanName: "SnackSquid",
                open: "false"
            }
        ]);
        
        // mock lean() method
        Van.updateOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(
                {
                    _id: '60b22de29833ae2d9238ddf7',
                    vanName: "SnackSquid",
                    open: "false"
                }),
                
            }));

        // call the controller function before testing various properties of
        // it
        openController.openForBusiness(req, res);
        jest.spyOn(console, 'log').mockImplementation(() => {});
      });

    afterAll(() => {
        // Restore mock after all tests are done, so it won't affect other test suites
        console.log.mockRestore();
    });
    afterEach(() => {
        // Clear mock (all calls etc) after each test. 
        console.log.mockClear();
    });

    // Test 1: test the console
    test("Test 1: test console log, expecting to be the van is open", ()=>{
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).toHaveBeenLastCalledWith('the van is open')
     });

    // Test 2: testing correct redirect routes 
    test("Test 2: testing with existing van, update van status to open, expecting redirect to order page \
      with console", () => {
        // when I run the controller, I expect that the redirect method will
        // be called exactly once        
        expect(res.redirect.mock.calls.length).toEqual(1);
        
        expect(res.redirect).toHaveBeenCalledWith('/vendor/order');
        });




})