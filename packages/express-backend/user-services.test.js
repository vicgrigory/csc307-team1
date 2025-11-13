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
            hashedPassword: "hash",
            about: "about 1",
            profile: "profile 1"
        },
        {
            username: "reg 2",
            hashedPassword: "hash",
            about: "about 2"
        },
        {
            username: "reg 3",
            hashedPassword: "hash",
            about: "about 3"
        },
        {
            username: "reg 4",
            hashedPassword: "hash",
            about: "about 4"
        },
        {
            username: "mod 1",
            hashedPassword: "hash",
            type: 'moderator'
        },
        {
            username: "mod 2",
            hashedPassword: "hash",
            type: 'moderator'
        }
    ]);
};
async function teardownDB() {
    await users.deleteMany();
};

/* Tests */
// getUser
describe("GET", () => {
    describe("success", () => {
        test("1: username check", async () => {
            expect((await userStuff.getUser("reg 1")).username).toBe("reg 1");
        });
        test("1: about check", async () => {
            expect((await userStuff.getUser("reg 1")).about).toBe("about 1");
        });
        test("1: profile check", async () => {
            expect((await userStuff.getUser("reg 1")).profile).toBe("profile 1");
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

// createUser
describe("ADD", () => {
    describe("success", () => {
        test("normal", async () => {
            let newUser = await userStuff.createUser("reg 5", "hash");
            expect(newUser.username).toBe("reg 5");
            expect(newUser.hashedPassword).toBe("hash");
        });
    });
    describe("fail", () => {
        test("empty string username", async () => {
            expect(async () => {
                await userStuff.createUser("", "hash");
            }).rejects.toThrow();
        });
        test("no input username", async () => {
            expect(async () => {
                await userStuff.createUser(null, "hash");
            }).rejects.toThrow();
        });
        test("no hash", async () => {
            expect(async () => {
                await userStuff.createUser("reg 6");
            }).rejects.toThrow();
        });
        test("duplicate", async () => {
            expect(async () => {
                await userStuff.createUser("reg 1", "hash");
            }).rejects.toThrow();
        });
    });
});

// editInformation
describe("EDIT PROFILE", () => {
    describe("success", () => {
        test("all fields", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id, "altered about", "altered profile");
            expect((await userStuff.getUser("reg 1")).about).toBe("altered about");
            expect((await userStuff.getUser("reg 1")).profile).toBe("altered profile");
        });
        test("null fields", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id, null, null);
            expect((await userStuff.getUser("reg 1")).about).toBe("altered about");
            expect((await userStuff.getUser("reg 1")).profile).toBe("altered profile");
        });
        test("empty fields", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id, "", "");
            expect((await userStuff.getUser("reg 1")).about).toBe("");
            expect((await userStuff.getUser("reg 1")).profile).toBe("");
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
            let curUser = await userStuff.getUser("reg 2");
            await userStuff.editUsername(curUser._id, "reg 69");
            let result = await userStuff.getUser("reg 69");
            expect(result.username).toBe("reg 69");
            expect(curUser._id).toEqual(result._id);
        });
    });
    describe("fail", () => {
        test("invalid id", async () => {
            expect(async () => {
                await userStuff.editUsername(null, "grug");
            }).rejects.toThrow();
        });
        test("null id", async ()=> {
            expect(async () => {
                await userStuff.editUsername("jiafei", "grug");
            }).rejects.toThrow();
        });
        test("duplicate", async () => {
            let curUser = await userStuff.getUser("reg 69");
            expect(async () => {
                await userStuff.editUsername(curUser._id, "reg 1");
            }).rejects.toThrow();
        });
    });
});

// setAsModerator + setAsRegular
describe("MOD", () => {
    describe("success", () => {
        test("set as a mod", async () => {
            await userStuff.setAsModerator("reg 4");
            expect((await userStuff.getUser("reg 4")).type).toBe("moderator");
        });
        test("remove a mod", async () =>{
            console.log(await userStuff.getUser("reg 4"));
            await userStuff.setAsRegular("reg 4");
            expect((await userStuff.getUser("reg 4")).type).toBe("regular");
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
            await userStuff.setAsModerator("reg 4");
            expect(async () => {
                await userStuff.setAsModerator("reg 4");
            }).rejects.toThrow();
        });
        test("set as regular again", async () => {
            await userStuff.setAsRegular("reg 4");
            expect(async () => {
                await userStuff.setAsRegular("reg 4");
            }).rejects.toThrow();
        });
    });
});

// deleteMyUser
describe("DEL", () => {
    describe("success", () => {
        test("Delete user by username: regular use", async () => {
            await expect(userStuff.deleteUser("reg 1")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("reg 1");
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