
import userStuff from './user-services.js';
import user from './user.js';


/* Initialization */
beforeAll(async () => {
    await teardownDB();
    await setupDB();
})
afterAll(async () => {
    await teardownDB();
})

/* Functions */
async function setupDB() {
    await user.insertMany([
        {
            username: "help",
            about: "i am cool",
            profile: "heehee"
        },
        {
            username: "criminal",
            about: "hackermans"
        },
        {
            username: "regular user",
            about: "i am a completely legal and cool user",
            profile: "pretend we have a link here"
        }
    ]);
};
async function teardownDB() {
    await user.deleteMany();
};

/* Tests */
// createUser
test("Add user: regular use", async () => {
    await expect(userStuff.createUser("i cant find the db")).resolves.toBeDefined();
});
test("Add user: empty username", async () => {
    await expect(userStuff.createUser("")).rejects.toThrow();
});
test("Add user: duplicate", async () => {
    await expect(userStuff.createUser("i cant find the db")).rejects.toThrow();
});
test("Add user: silly string", async () => {
    await expect(userStuff.createUser("SUPER LONG AND COMPLICATED STRING FU4379FQB48GIURKDVWA/..WE>'F'[EWF'4.'FG;WR.")).resolves.toBeDefined();
});
// getUser
test("Get user: regular use", async () => {
    await expect(userStuff.getUser("i cant find the db")).resolves.toBeDefined();
});
test("Get user: nonexistent user", async () => {
    await expect(userStuff.getUser("who is this bro")).resolves.toBeNull();
});
test("Get user: no input", async () => {
    await expect(userStuff.getUser("")).resolves.toBeDefined();
});
// editUser
test("Edit user: regular use, all", async () => {
    const user = await userStuff.getUser("i cant find the db");
    await expect(userStuff.editUser(user._id, "new cool username", "look at this cool about text!!!", "profile pic link")).resolves.toBeDefined();
});
test("Edit user: regular use, username only", async () => {
    const user = await userStuff.getUser("new cool username");
    await expect(userStuff.editUser(user._id, "epic username", user.about, user.profile)).resolves.toBeDefined();
});
test("Edit user: regular use, profile only", async () => {
    const user = await userStuff.getUser("epic username");
    await expect(userStuff.editUser(user._id, user.username, "cool about section", user.profile)).resolves.toBeDefined();
});
test("Edit user: regular use, about only", async () => {
    const user = await userStuff.getUser("epic username");
    await expect(userStuff.editUser(user._id, user.username, user.about, "cool new profile pic")).resolves.toBeDefined();
});
// setAsModerator + setAsRegular
test("Set moderator: regular use", async () => {
    const cool = await expect(userStuff.setAsModerator("epic username"));
    expect(cool).toBeDefined();
    console.log(cool);
});
test("Set moderator: nonexistent user", async () => {

});
test("Remove moderator: regular use", async () => {

});
test("Remove moderator: nonexistent user", async () => {

});
// deleteMyUser
test("Delete user by username: regular use", async () => {

});
test("Delete user by username: no input", async () => {

});
test("Delete user by username: nonexistent", async () => {

});
// deleteOtherUser