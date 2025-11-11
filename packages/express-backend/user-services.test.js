
import userServices from './user-services.js';
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
            profile: "heehee",
            hashedPassword: "hashedpwd1"
        },
        {
            username: "criminal",
            about: "hackermans",
            hashedPassword: "hashedpwd2"
        },
        {
            username: "peak",
            about: "mega peak",
            hashedPassword: "hashedpwd3"
        },
        {
            username: "why does this take so long",
            about: "dark falz",
            hashedPassword: "hashedpwd4"
        },
        {
            username: "mod 1",
            type: 'moderator',
            hashedPassword: "hashedpwd5"
        },
        {
            username: "mod 2",
            type: 'moderator',
            hashedPassword: "hashedpwd6"
        }
    ]);
};
async function teardownDB() {
    await user.deleteMany();
};

/* Tests */
// createUser
describe("ADD", () => {
    describe("success", () => {
        test("normal", async () => {
            await expect((userStuff.createUser("having fun", "funhaverhshpwd"))).resolves.toBeTruthy();
        });
    });
    describe("fail", () => {
        test("empty string username", async () => {
            expect(async () => {
                await userStuff.createUser("", "hshpwdempty");
            }).rejects.toThrow();
        });
        test("no password", async () => {
            expect(async () => {
                await userStuff.createUser("i have no password");
            }).rejects.toThrow();
        });
        test("no input username", async () => {
            expect(async () => {
                await userStuff.createUser();
            }).rejects.toThrow();
        })
        test("duplicate", async () => {
            expect(async () => {
                await userStuff.createUser("criminal", "hshpwdcrmnl");
            }).rejects.toThrow();
        });
    });
});

// getUser
describe("GET", () => {
    describe("success", () => {
        test("1: username check", async () => {
            expect((await userStuff.getUser("help")).username).toBe("help");
        });
        test("2: password check", async () => {
            expect((await userStuff.getUser("help")).hashedPassword).toBe("hashedpwd1");
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

// editUser
describe("EDIT", () => {
    describe("success", () => {
        test("normal usage + validity checking", async () => {
            await userStuff.editUser(await userStuff.getUser("help"), "new cool username", "look at this cool about text!!!", "profile pic link");
            expect((await userStuff.getUser("new cool username")).username).toBe("new cool username");
            expect((await userStuff.getUser("new cool username")).about).toBe("look at this cool about text!!!");
            expect((await userStuff.getUser("new cool username")).profile).toBe("profile pic link");
        });
    });
    describe("fail", () => {
        test("invalid id", async () => {
            expect(async () => {
                await userStuff.editUser("invalid id", "cool", "stuff", "here");
            }).rejects.toThrow();
        });
        test("empty id", async () => {
            expect(async () => {
                await userStuff.editUser("", "its", "scarce", "here");
            }).rejects.toThrow();
        });
        test("invalid fields", async () => {
            expect(async () => {
                await userStuff.editUser((await userStuff.getUser("new cool username"))._id, null, "cool", "cool");
            });
            expect(async () => {
                await userStuff.editUser((await userStuff.getUser("new cool username"))._id, "cool", null, "cool");
            });
            expect(async () => {
                await userStuff.editUser((await userStuff.getUser("new cool username"))._id, "cool", "cool", null);
            });
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
describe("MY DEL", () => {
    describe("success", () => {
        test("Delete user by username: regular use", async () => {
            await expect(userStuff.deleteMyUser("new cool username")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("new cool username");
            }).rejects.toThrow();
        });
    });
    describe("fail", () => {
        test("empty string", async () => {
            expect(async () => {
                await userStuff.deleteMyUser("");
            }).rejects.toThrow();
        });
        test("no input", async () => {
            expect(async () => {
                await userStuff.deleteMyUser();
            }).rejects.toThrow();
        });
        test("nonexistent", async () => {
            expect(async () => {
                await userStuff.deleteMyUser("garbage");
            }).rejects.toThrow();
        });
    });
});

// deleteOtherUser
describe("MOD DEL", () => {
    describe("success", () => {
        test("mod deletes regular", async () => {
            console.log((await userStuff.getUser("mod 1"))._id)
            await expect(userStuff.deleteOtherUser((await userStuff.getUser("mod 1"))._id, (await userStuff.getUser("peak"))._id)).resolves.toBeTruthy();
        });
    });
    describe("fail", () => {
        test("regular deletes regular", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser((await userStuff.getUser("why does this take so long"))._id, (await userStuff.getUser("criminal"))._id);
            }).rejects.toThrow();
        });
        test("mod deletes mod", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser((await userStuff.getUser("mod 1"))._id, (await userStuff.getUser("mod 2"))._id);
            }).rejects.toThrow();
        });
        test("regular deletes mod", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser((await userStuff.getUser("criminal"))._id, (await userStuff.getUser("mod 1"))._id);
            }).rejects.toThrow();
        });
        test("nonexistent deletee", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser((await userStuff.getUser("mod 1"))._id, (await userStuff.getUser("coca cola"))._id);
            }).rejects.toThrow();
        });
        test("nonexistent deleter", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser((await userStuff.getUser("hee hee hee hah"))._id, (await userStuff.getUser("criminal"))._id);
            }).rejects.toThrow();
        });
        test("empty deletee", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser((await userStuff.getUser("mod 1"))._id, );
            }).rejects.toThrow();
        });
        test("empty deleter", async () => {
            expect(async () => {
                await userStuff.deleteOtherUser(null, (await userStuff.getUser("criminal"))._id);
            }).rejects.toThrow();
        });
    });
});