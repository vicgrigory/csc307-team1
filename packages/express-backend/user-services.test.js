import userStuff from './user-services.js';
import users from './user.js';

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
    await users.insertMany([
        {
            username: "reg 1",
            about: "about 1",
            profile: "profile 1"
        },
        {
            username: "reg 2",
            about: "about 2"
        },
        {
            username: "reg 3",
            about: "about 3"
        },
        {
            username: "reg 4",
            about: "about 4"
        },
        {
            username: "mod 1",
            type: 'moderator'
        },
        {
            username: "mod 2",
            type: 'moderator'
        }
    ]);
};
async function teardownDB() {
    await users.deleteMany();
};

/* Tests */
// createUser
describe("ADD", () => {
    describe("success", () => {
        test("normal", async () => {
            expect(async () => {
                await userStuff.createUser("reg 5");
            }).resolves.toBeTruthy();
        });
    });
    describe("fail", () => {
        test("empty string username", async () => {
            expect(async () => {
                await userStuff.createUser("");
            }).rejects.toThrow();
        });
        test("no input username", async () => {
            expect(async () => {
                await userStuff.createUser();
            }).rejects.toThrow();
        })
        test("duplicate", async () => {
            expect(async () => {
                await userStuff.createUser("reg 1");
            }).rejects.toThrow();
        });
    });
});
/*
// getUser
describe("GET", () => {
    describe("success", () => {
        test("1: username check", async () => {
            expect((await userStuff.getUser("help")).username).toBe("help");
        });
        test("1: about check", async () => {
            expect((await userStuff.getUser("help")).about).toBe("i am cool");
        });
        test("1: profile check", async () => {
            expect((await userStuff.getUser("help")).profile).toBe("heehee");
        });
    });
    describe("fail", () => {
        test("nonexistent", async () => {
            expect(async () => {
                await userStuff.getUser("who is this bro");
            }).rejects.toThrow();
        });
        test("empty", async () => {
            expect(async () => {
                await userStuff.getUser("");
            }).rejects.toThrow();
        });
    });
});

// editInformation
describe("EDIT PROFILE", () => {
    describe("success", () => {
        test("all fields", async () => {
            await userStuff.editInformation((await userStuff.getUser("help"))._id, "look at this cool about text!!!", "profile pic link");
            expect((await userStuff.getUser("help")).about).toBe("look at this cool about text!!!");
            expect((await userStuff.getUser("help")).profile).toBe("profile pic link");
        });
        test("null fields", async () => {
            await userStuff.editInformation((await userStuff.getUser("help"))._id, null, null);
            expect((await userStuff.getUser("help")).about).toBe("look at this cool about text!!!");
            expect((await userStuff.getUser("help")).profile).toBe("profile pic link");
        });
        test("empty fields", async () => {
            await userStuff.editInformation((await userStuff.getUser("help"))._id, "", "");
            expect((await userStuff.getUser("help")).about).toBe("");
            expect((await userStuff.getUser("help")).profile).toBe("");
        });
    });
    describe("fail", () => {
        test("invalid id", async () => {
            expect(async () => {
                await userStuff.editInformation("invalid id", "cool", "stuff");
            }).rejects.toThrow();
        });
        test("empty id", async () => {
            expect(async () => {
                await userStuff.editInformation("", "scarce", "here");
            }).rejects.toThrow();
        });
    });
});

// editUsername
describe("EDIT USERNAME", () => {
    describe("success", () => {
        test("normal", async () => {

        });
    });
    describe("fail", () => {
        test("invalid id", async () => {

        });
        test("null id", async ()=> {

        });
        test("duplicate", async () => {

        });
    });
});

// setAsModerator + setAsRegular
describe("MOD", () => {
    describe("success", () => {
        test("set as a mod", async () => {
            await userStuff.setAsModerator("criminal");
            expect((await userStuff.getUser("criminal")).type).toBe("moderator");
        });
        test("remove a mod", async () =>{
            console.log(await userStuff.getUser("criminal"));
            await userStuff.setAsRegular("criminal");
            expect((await userStuff.getUser("criminal")).type).toBe("regular");
        });
    });
    describe("fail", () => {
        test("set nonexistent", async () => {
            expect(async () => {
                await userStuff.setAsModerator("xue hua piao piao");
            }).rejects.toThrow();
        });
        test("remove nonexistent", async () => {
            expect(async () => {
                await userStuff.setAsRegular("bei feng xiao xiao");
            }).rejects.toThrow();
        });
        test("set as mod again", async () => {
            await userStuff.setAsModerator("criminal");
            expect(async () => {
                await userStuff.setAsModerator("criminal");
            }).rejects.toThrow();
        });
        test("set as regular again", async () => {
            await userStuff.setAsRegular("criminal");
            expect(async () => {
                await userStuff.setAsRegular("criminal");
            }).rejects.toThrow();
        });
    });
});

// deleteMyUser
describe("DEL", () => {
    describe("success", () => {
        test("Delete user by username: regular use", async () => {
            await expect(userStuff.deleteUser("new cool username")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("new cool username");
            }).rejects.toThrow();
        });
    });
    describe("fail", () => {
        test("empty string", async () => {
            expect(async () => {
                await userStuff.deleteUser("");
            }).rejects.toThrow();
        });
        test("no input", async () => {
            expect(async () => {
                await userStuff.deleteUser();
            }).rejects.toThrow();
        });
        test("nonexistent", async () => {
            expect(async () => {
                await userStuff.deleteUser("garbage");
            }).rejects.toThrow();
        });
    });
});
*/