import { MongoClient as mongo } from 'mongodb';
import userStuff from './user-services.js';
import users from './user.js';
let connection;
let db;
let user;

/* Initialization */
beforeAll(async () => {
    await setupDB();
})
afterAll(async () => {
    await teardownDB();
})
/* Functions */
async function setupDB() {
    // this needs to be in the services file :( ??
    connection = await mongo.connect(global.__MONGO_URI__, {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
    });
    db = await connection.db();
    user = await db.collection('WebUser');
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
            username: "peak",
            about: "mega peak"
        },
        {
            username: "why does this take so long",
            about: "dark falz"
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
    await db.collection('WebUser').deleteMany();
    await connection.close();
};

/* Tests */
// createUser
describe("ADD", () => {
    describe("success", () => {
        test("normal", async () => {
            expect((userStuff.createUser("having fun"))).resolves.toBeTruthy();
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
                await userStuff.createUser("criminal");
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