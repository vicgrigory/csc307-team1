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
    });
    describe("Fail", () => {
        test("Invalid Username", async () => {
            expect(async () => {
                await userStuff.getUser("who is this bro");
            }).rejects.toThrow();
        });
        test("Empty Username", async () => {
            expect(async () => {
                await userStuff.getUser("");
            }).rejects.toThrow();
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.getUser();
            }).rejects.toThrow();
        });
    });
});

describe("createUser", () => {
    describe("Success", () => {
        test("Validity Check", async () => {
            let newUser = await userStuff.createUser("reg 5");
            expect(newUser.username).toBe("reg 5");
        });
    });
    describe("Fail", () => {
        test("Empty Username", async () => {
            expect(async () => {
                await userStuff.createUser("");
            }).rejects.toThrow();
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.createUser(null);
            }).rejects.toThrow();
        });
        test("Duplicate Username", async () => {
            expect(async () => {
                await userStuff.createUser("reg 1");
            }).rejects.toThrow();
        });
    });
});

describe("editInformation", () => {
    describe("Success", () => {
        test("Validity Check - Change All", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id, "altered about", "altered profile");
            expect((await userStuff.getUser("reg 1")).about).toBe("altered about");
            expect((await userStuff.getUser("reg 1")).profile).toBe("altered profile");
        });
        test("Validity Check - No Change", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id, null, null);
            expect((await userStuff.getUser("reg 1")).about).toBe("altered about");
            expect((await userStuff.getUser("reg 1")).profile).toBe("altered profile");
        });
        test("Validity Check - Empty Strings", async () => {
            await userStuff.editInformation((await userStuff.getUser("reg 1"))._id, "", "");
            expect((await userStuff.getUser("reg 1")).about).toBe("");
            expect((await userStuff.getUser("reg 1")).profile).toBe("");
        });
    });
    describe("Fail", () => {
        test("Incorrect ID", async () => {
            expect(async () => {
                await userStuff.editInformation("invalid id", "cool", "stuff");
            }).rejects.toThrow();
        });
        test("Empty ID", async () => {
            expect(async () => {
                await userStuff.editInformation("", "scarce", "here");
            }).rejects.toThrow();
        });
        test("Null ID", async () => {
            expect(async () => {
                await userStuff.editInformation(null, "linganguli", "wacha lingangu");
            }).rejects.toThrow()
        });
    });
});

describe("editUsername", () => {
    describe("Success", () => {
        test("Validity Check", async () => {
            let curUser = await userStuff.getUser("reg 2");
            await userStuff.editUsername(curUser._id, "reg 69");
            let result = await userStuff.getUser("reg 69");
            expect(result.username).toBe("reg 69");
            expect(curUser._id).toEqual(result._id);
        });
    });
    describe("Fail", () => {
        test("Null ID", async () => {
            expect(async () => {
                await userStuff.editUsername(null, "grug");
            }).rejects.toThrow();
        });
        test("Incorrect ID", async ()=> {
            expect(async () => {
                await userStuff.editUsername("jiafei", "grug");
            }).rejects.toThrow();
        });
        test("Duplicate Username", async () => {
            let curUser = await userStuff.getUser("reg 69");
            expect(async () => {
                await userStuff.editUsername(curUser._id, "reg 1");
            }).rejects.toThrow();
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
        test("Set Incorrect Username", async () => {
            expect(async () => {
                await userStuff.setAsModerator("xue hua piao piao");
            }).rejects.toThrow();
        });
        test("Set Null Username", async () => {
            expect(async () => {
                await userStuff.setAsModerator(null);
            }).rejects.toThrow();
        });
        test("Remove Incorrect Username", async () => {
            expect(async () => {
                await userStuff.setAsRegular("bei feng xiao xiao");
            }).rejects.toThrow();
        });
        test("Remove Null Username", async () => {
            expect(async () => {
                await userStuff.setAsRegular(null);
            }).rejects.toThrow();
        });
        test("Set Twice", async () => {
            await userStuff.setAsModerator("reg 4");
            expect(async () => {
                await userStuff.setAsModerator("reg 4");
            }).rejects.toThrow();
        });
        test("Remove Twice", async () => {
            await userStuff.setAsRegular("reg 4");
            expect(async () => {
                await userStuff.setAsRegular("reg 4");
            }).rejects.toThrow();
        });
    });
});

describe("deleteUser", () => {
    describe("Success", () => {
        let userIDOne;
        let userIDTwo;
        let userIDFour;
        beforeAll(async () => {
            userIDOne = await userStuff.getUser("reg 1");
            userIDTwo = await userStuff.getUser("mod 1");
            userIDFour = await userStuff.getUser("reg 3");
        });
        test("Validity Check - Regular", async () => {
            await expect(userStuff.deleteUser(userIDOne._id, "reg 1")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("reg 1");
            }).rejects.toThrow();
        });
        test("Validity Check - Mod", async () => {
            await expect(userStuff.deleteUser(userIDTwo._id, "reg 69")).resolves.toBeTruthy();
            expect(async () => {
                await userStuff.getUser("reg 69");
            }).rejects.toThrow();
        });
    });
    describe("Fail", () => {
        test("Empty Username", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDTwo._id, "");
            }).rejects.toThrow();
        });
        test("Null Username", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDTwo._id, null);
            }).rejects.toThrow();
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDTwo._id, "garbage");
            }).rejects.toThrow();
        });
        test("Null ID", async () => {
            expect(async () => {
                await userStuff.deleteUser(null, "reg 3");
            }).rejects.toThrow();
        });
        test("Incorrect ID", async () => {
            expect(async () => {
                await userStuff.deleteUser("sunset at 4 sucks", "reg 3");
            }).rejects.toThrow();
        });
        test("Not authorized", async () => {
            expect(async () => {
                await userStuff.deleteUser(userIDFour._id, "mod 1");
            }).rejects.toThrow();
        });
    });
});