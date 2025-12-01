import userStuff from './user-services.js';
import users from './user.js';
import mongoose from "mongoose";
//import DB from "./connect";

/* Initialization */
beforeAll(async () => {
    //await DB.setupDB(false);
    await mongoose.connect("mongodb://localhost:27017/data", {
        //useNewUrlParser: true,
        //useUnifiedTopology: true
    }).catch((error) => console.log(error));

    await teardownDB();
    await setupDB();
})
afterAll(async () => {
    //await DB.destroyDB();
    await teardownDB();
})
/* Functions */
async function setupDB() {
    await users.insertMany([
        {
            username: "reg 1",
            about: "about 1",
            profile: "profile 1",
            hashedPassword: "hashedpwd1"
        },
        {
            username: "reg 2",
            about: "about 2",
            hashedPassword: "hashedpwd2"
        },
        {
            username: "reg 3",
            about: "about 3",
            hashedPassword: "hashedpwd3"
        },
        {
            username: "reg 4",
            about: "about 4",
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
    await users.deleteMany();
};

/* Tests */
describe("getUser", () => {
    describe("Success", () => {
        test("Validity Check - Username", async () => {
            expect((await userStuff.getUser("reg 1")).username).toBe("reg 1");
        });
        test("Validity Check - About", async () => {
            expect((await userStuff.getUser("reg 1")).about).toBe("about 1");
        });
        test("Validity Check - Profile", async () => {
            expect((await userStuff.getUser("reg 1")).profile).toBe("profile 1");
        });
        test("Validity Check - Password", async () => {
            expect((await userStuff.getUser("reg 1")).hashedPassword).toBe("hashedpwd1");
        });
    });
    describe("Fail", () => {
        test("Invalid Username", async () => {
            expect(async () => {
                await userStuff.getUser("who is this bro");
            }).rejects.toThrow("Username: 404!");
        });
        test("Empty Username", async () => {
            expect(async () => {
                await userStuff.getUser("");
            }).rejects.toThrow("Username: invalid!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.getUser();
            }).rejects.toThrow("Username: invalid!");
        });
    });
});

describe("createUser", () => {
    describe("Success", () => {
        test("Validity Check", async () => {
            let newUser = await userStuff.createUser("reg 5", "hashedpwd7");
            expect(newUser.username).toBe("reg 5");
        });
    });
    describe("Fail", () => {
        test("Empty Username", async () => {
            expect(async () => {
                await userStuff.createUser("", "hashedpwd8");
            }).rejects.toThrow("Username: invalid!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.createUser(null, "hashedpwd8");
            }).rejects.toThrow("Username: invalid!");
        });
        test("Duplicate Username", async () => {
            expect(async () => {
                await userStuff.createUser("reg 1", "hashedpwd8");
            }).rejects.toThrow("Username: duplicate!");
        });
    });
});

describe("editInformation", () => {
    describe("Success", () => {
        test("Validity Check - Change All", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id.toString(), "altered about", "altered profile");
            expect((await userStuff.getUser("reg 1")).about).toBe("altered about");
            expect((await userStuff.getUser("reg 1")).profile).toBe("altered profile");
        });
        test("Validity Check - No Change", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id.toString(), null, null);
            expect((await userStuff.getUser("reg 1")).about).toBe("altered about");
            expect((await userStuff.getUser("reg 1")).profile).toBe("altered profile");
        });
        test("Validity Check - Empty Strings", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id.toString(), "", "");
            expect((await userStuff.getUser("reg 1")).about).toBe("");
            expect((await userStuff.getUser("reg 1")).profile).toBe("");
        });
    });
    describe("Fail", () => {
        test("Incorrect ID", async () => {
            expect(async () => {
                await userStuff.editInformation("4c3292686ea90899e0fbb16e", "cool", "stuff");
            }).rejects.toThrow("UID: 404!");
        });
        test("Cast Failure", async () => {
            expect(async () => {
                await userStuff.editInformation(4, "hi", "sup");
            }).rejects.toThrow();
        });
        test("Empty ID", async () => {
            expect(async () => {
                await userStuff.editInformation("", "scarce", "here");
            }).rejects.toThrow("UID: invalid!");
        });
        test("Null ID", async () => {
            expect(async () => {
                await userStuff.editInformation(null, "linganguli", "wacha lingangu");
            }).rejects.toThrow("UID: invalid!")
        });
    });
});

describe("editUsername", () => {
    describe("Success", () => {
        test("Validity Check", async () => {
            let curUser = await userStuff.getUser("reg 2");
            await userStuff.editUsername(curUser._id.toString(), "reg 69");
            let result = await userStuff.getUser("reg 69");
            expect(result.username).toBe("reg 69");
            expect(curUser._id).toEqual(result._id);
        });
    });
    describe("Fail", () => {
        let curUser;
        beforeAll(async () => {
            curUser = await userStuff.getUser("reg 69");
        });
        test("Null ID", async () => {
            expect(async () => {
                await userStuff.editUsername(null, "grug");
            }).rejects.toThrow("UID: invalid!");
        });
        test("Incorrect ID", async ()=> {
            expect(async () => {
                await userStuff.editUsername("adbe7b36e8fe25cb3f85c6b4", "grug");
            }).rejects.toThrow("UID: 404!");
        });
        test("Cast Failure", async ()=> {
            expect(async () => {
                await userStuff.editUsername(3, "grug");
            }).rejects.toThrow("UID: Not string!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.editUsername(curUser._id.toString(), "");
            }).rejects.toThrow("Username: invalid!");
        });
        test("Duplicate Username", async () => {
            expect(async () => {
                await userStuff.editUsername(curUser._id.toString(), "reg 1");
            }).rejects.toThrow("Username: duplicate!");
        });
    });
});

describe("setAsModerator/ Regular", () => {
    describe("Success", () => {
        test("Validity Check - Set as Mod", async () => {
            await userStuff.setAsModerator("reg 4");
            expect((await userStuff.getUser("reg 4")).type).toBe("moderator");
        });
        test("Validity Check - Remove Mod", async () =>{
            await userStuff.setAsRegular("reg 4");
            expect((await userStuff.getUser("reg 4")).type).toBe("regular");
        });
    });
    describe("Fail", () => {
        test("Set Cast Failure", async () => {
            expect(async () => {
                await userStuff.setAsModerator("xue hua piao piao");
            }).rejects.toThrow();
        });
        test("Set Incorrect Username", async () => {
            expect(async () => {
                await userStuff.setAsModerator(new mongoose.Types.ObjectId("56c69eebedae1f3c78c8a9de"));
            }).rejects.toThrow("Username: 404!");
        });
        test("Set Null Username", async () => {
            expect(async () => {
                await userStuff.setAsModerator(null);
            }).rejects.toThrow("Username: invalid!");
        });
        test("Set Twice", async () => {
            await userStuff.setAsModerator("reg 4");
            expect(async () => {
                await userStuff.setAsModerator("reg 4");
            }).rejects.toThrow("Type: already a mod!");
        });
        test("Remove Cast Failure", async () => {
            expect(async () => {
                await userStuff.setAsRegular("bei feng xiao xiao");
            }).rejects.toThrow();
        });
        test("Remove Incorrect Username", async () => {
            expect(async () => {
                await userStuff.setAsRegular(new mongoose.Types.ObjectId("5b71e7458f1cfc1b9cef3695"));
            }).rejects.toThrow("Username: 404!");
        });
        test("Remove Null Username", async () => {
            expect(async () => {
                await userStuff.setAsRegular(null);
            }).rejects.toThrow("Username: invalid!");
        });
        test("Remove Twice", async () => {
            await userStuff.setAsRegular("reg 4");
            expect(async () => {
                await userStuff.setAsRegular("reg 4");
            }).rejects.toThrow("Type: already regular!");
        });
    });
});

describe("deleteUser", () => {
    let userIDOne;
    let userIDTwo;
    let userIDFour;
    beforeAll(async () => {
        userIDOne = await userStuff.getUser("reg 1");
        userIDTwo = await userStuff.getUser("mod 1");
        userIDFour = await userStuff.getUser("reg 3");
    });
    describe("Success", () => {
        test("Validity Check - Regular", async () => {
            await expect(userStuff.deleteUser(userIDOne._id.toString(), "reg 1")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("reg 1");
            }).rejects.toThrow("Username: 404!");
        });
        test("Validity Check - Mod", async () => {
            await expect(userStuff.deleteUser(userIDTwo._id.toString(), "reg 69")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("reg 69");
            }).rejects.toThrow("Username: 404!");
        });
    });
    describe("Fail", () => {
        test("Empty Username", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDTwo._id.toString(), "");
            }).rejects.toThrow("Username: invalid!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDTwo._id.toString(), null);
            }).rejects.toThrow("Username: invalid!");
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDTwo._id.toString(), "bozo");
            }).rejects.toThrow("Username: 404!");
        });
        test("Null ID", async () => {
            expect(async () => {
                await userStuff.deleteUser(null, "reg 3");
            }).rejects.toThrow("UID: invalid!");
        });
        test("ID Cast Failure", async () => {
            expect(async () => {
                await userStuff.deleteUser(21, "reg 3");
            }).rejects.toThrow("UID: Not string!");
        });
        test("Incorrect ID", async () => {
            expect(async () => {
                await userStuff.deleteUser("1517f97c1720f93073bdbf4a", "reg 3");
            }).rejects.toThrow("UID: 404!");
        });
        test("Not authorized", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDFour._id.toString(), "mod 2");
            }).rejects.toThrow("UID: unauthorized!");
        });
    });
});
