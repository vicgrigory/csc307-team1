import dotenv from 'dotenv';
import files from './file-services';
import file from './file';
dotenv.config({
  override: false
});

// Initialization
/*
beforeEach(() => {

});
afterEach(() => {

});
*/

// Tests
test("Placeholder", () => {
    const got = 1;
    expect(got).toBe(1);
})
// Functions to test with
function setupDB() {
    const add1 = new file(
        {
            title: "a cool psychology book",
            filetype: "mp3",
            creator: "me",
            creationDate: "janrurary 32",
            // userid
        }
    );
    add1.save();
    const add2 = new file();
    add2.save();
    const add3 = new file();
    add3.save();
    const add4 = new file();
    add4.save();
}
function tearDownDB() {

}
