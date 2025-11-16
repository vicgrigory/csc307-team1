/*
import fileStuff from './file-services';
import file from './file';
import user from './user';
import userStuff from './user-services';

/* Initialization 
beforeAll(async () => {
    await tearDownDB();
    await setupDB();
});
afterAll(async () => {
    await tearDownDB();
});

/* Functions 
async function setupDB() {
    await user.insertMany([
        {
            username: "reg 1",
        },
        {
            username: "reg 2",
        },
        {
            username: "mod 1",
            type: 'moderator'
        }
    ]);
    await file.insertMany([
        {
            title: "file 1",
            link: "external link 1",
            filetype: 'mp3',
            userID: (await userStuff.getUser("reg 1"))._id,
            tags: ["test", "science"]
        },
        {
            title: "file 2",
            link: "external link 2",
            filetype: 'pdf',
            userID: (await userStuff.getUser("mod 1"))._id,
            tags: ["math", "science"]
        },
        {
            title: "file 3",
            link: "external link 3",
            filetype: 'pdf',
            userID: (await userStuff.getUser("reg 1"))._id
        }
    ]);
}
async function tearDownDB() {
    await user.deleteMany();
    await file.deleteMany();
}

/* Tests 
describe("myFiles", () => {
    describe("Success", () => {
        test("Validity Test - Basic", async () => {
            expect(async () => {
                fileStuff.myFiles("reg 1");
            }).resolves.toBeTruthy;
        });
        test("Validity Test - Specific", async () => {
            let retrieved = (await fileStuff.myFiles("reg 1"))[0];
            expect(["file 1", "file 3"]).toContain(retrieved.title);
            expect(["external link 1", "external link 3"]).toContain(retrieved.link);
            expect(['mp3', 'pdf']).toContain(retrieved.filetype);
        });
        test("Validity Test - No Results", async () => {
            let retrieved = await fileStuff.myFiles("reg 2");
            expect(retrieved).toEqual([]);
        });
    });
    describe("Fail", () => {
        test("Null Username", async () => {
            expect( async () => {
                await fileStuff.myFiles();
            }).rejects.toThrow();
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await fileStuff.myFiles("reg 6");
            }).rejects.toThrow();
        });
    });
});

describe("searchFiles", () => {
    describe("Success", () => {
        test("Query, None", async () => {
            let result = await fileStuff.searchFiles("file", null);
            expect(["file 1", "file 2", "file 3"]).toContain(result[0].title);
        });
        test("None, Tags", async () => {
            let result = await fileStuff.searchFiles(null, ["science", "math"]);
            expect(["file 2"]).toContain(result[0].title);
        });
        test("Query, Tags", async () => {
            let result = await fileStuff.searchFiles("2", ["math", "science"]);
            expect(["file 2"]).toContain(result[0].title);
        });
        test("None, None", async () => {
            let result = await fileStuff.searchFiles(null, null);
            expect(["file 1", "file 2", "file 3"]).toContain(result[0].title);
        });
        test("No Results", async () => {
            let result = await fileStuff.searchFiles("3", ["math"]);
            expect(result).toEqual([]);
        });
    });
    describe("Fail", () => {
        test("String as Tag", async () => {
            expect(async () => {
                await fileStuff.searchFiles("some query", "huh");
            }).rejects.toThrow()
        });
    });
});

describe("getFile", () => {
    describe("Success", () => {
        let fileDet;
        beforeAll(async () => {
            let fileId = (await fileStuff.searchFiles("file 1"))[0]._id;
            console.log(fileId);
            fileDet = await fileStuff.getFile(fileId);
        })
        test("Validity Check - Title", async () => {
            expect(fileDet.title).toBe("file 1");
        });
        test("Validity Check - Link", async () => {
            expect(fileDet.link).toBe("external link 1");
        });
        // Can add more validity tests if needed
    });
    describe("Fail", () => {
        test("Null ID", async () => {
            expect(async () => {
                await fileStuff.getFile();
            }).rejects.toThrow();
        });
        test("Incorrect ID", async () => {
            expect(async () => {
                await fileStuff.getFile("somerandomidhere4239040358");
            }).rejects.toThrow();
        });
    });
});

describe("addFile", () => {
    describe("Success", () => {
        let fullFile;
        let minFile;
        beforeAll(async () => {
            fullFile = await fileStuff.addFile("reg 1", "file 4", "link 4", 'pdf', "creator 4", "date 4", ["science", "english"]);
            minFile = await fileStuff.addFile("mod 1", "file 5", "link 5", 'mp3');
        });
        test("Validity Check - Username (Full)", async () => {
            let curUser = await userStuff.getUser("reg 1");
            expect(fullFile.userID).toEqual(curUser._id);
        });
        test("Validity Check - Title (Full)", async () => {
            expect(fullFile.title).toBe("file 4");
        });
        test("Validity Check - Link (Full)", async () => {
            expect(fullFile.link).toBe("link 4");
        });
        test("Validity Check - Tags (Full)", async () => {
            expect(fullFile.tags).toEqual(["science", "english"]);
        });
        test("Validity Check - Username (Min)", async () => {
            let curUser = await userStuff.getUser("mod 1");
            expect(minFile.userID).toEqual(curUser._id);
        });
        test("Validity Check - Title (Min)", async () => {
            expect(minFile.title).toBe("file 5");
        });
        test("Validity Check - Link (Min)", async () => {
            expect(minFile.link).toBe("link 5");
        });
    });
    describe("Fail", () => {
        test("Null Username", async () => {
            expect(async () => {
                await fileStuff.addFile(null, "file 6", "link 6", 'pdf');
            }).rejects.toThrow();
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 2", "file 6", "link 6", 'pdf');
            }).rejects.toThrow();
        });
        test("Null Title", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", null, "link 6", 'pdf');
            }).rejects.toThrow();
        });
        test("Null Link", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", "file 6", null, 'pdf');
            }).rejects.toThrow();
        });
        test("Null Filetype", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", "file 6", "link 6", null);
            }).rejects.toThrow();
        });
        test("String as Tag", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", "file 6", "link 6", 'pdf', null, null, "hey");
            }).rejects.toThrow();
        });
    });
});

describe("editFile", () => {
    describe("Success", () => {
        let editFile;
        beforeAll(async () => {
            let results = await fileStuff.searchFiles("file");
            editFile = results[0]._id;
            console.log((await user.findOne({_id: results[0].userID})).username);
        });
        test("Validity Check - Title (All fields)", async () => {
            await fileStuff.editFile(editFile, "reg 1", "file 6", "creator 6", new Date("2001-09-11"), ["mongolian throat singing", "cathode ray tubes"]);
            let result = await fileStuff.getFile(editFile);
            expect(result.title).toBe("file 6");
        });
        test("Validity Check - Title", async () => {
            await fileStuff.editFile(editFile, "reg 1", "file 1");
            let result = await fileStuff.getFile(editFile);
            expect(result.title).toBe("file 1");
        });
        test("Validity Check - Creator", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, "creator 1");
            let result = await fileStuff.getFile(editFile);
            expect(result.creator).toBe("creator 1");
        });
        test("Validity Check - Date", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, null, new Date("2008-11-13"));
            let result = await fileStuff.getFile(editFile);
            expect(result.creationDate).toEqual(new Date("2008-11-13"));
        });
        test("Validity Check - Tags", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, null, null, ["cathode ray tubes"]);
            let result = await fileStuff.getFile(editFile);
            expect(result.tags).toEqual(["cathode ray tubes"]);
        });
        test("Validity Check - None", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, null, null, null);
            let result = await fileStuff.getFile(editFile);
            expect(result.title).toBe("file 1");
            expect(result.creator).toBe("creator 1");
            expect(result.creationDate).toEqual(new Date("2008-11-13"));
        });
        test("Mod Edit Check", async () => {
            await fileStuff.editFile(editFile, "mod 1", null, "mario mario", new Date("2006-10-24"));
            let result = await fileStuff.getFile(editFile);
            expect(result.creator).toBe("mario mario");
            expect(result.creationDate).toEqual(new Date("2006-10-24"));
        });
    });
    describe("Fail", () => {
        test("Null File ID", async () => {
            expect(async () => {
                await fileStuff.editFile(null, "mod 1", "hi");
            }).rejects.toThrow();
        });
        test("Incorrect File ID", async () => {
            expect(async () => {
                await fileStuff.editFile("random", "mod 1", "hi");
            }).rejects.toThrow();
        });
        test("Null Username", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, null, "hi");
            }).rejects.toThrow();
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, "mod 15", "hi");
            }).rejects.toThrow();
        });
        test("String as Tag", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, "mod 1", null, null, null, "helloooooo")
            }).rejects.toThrow();
        });
        test("Unauthorized", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, "reg 2", "hi");
            }).rejects.toThrow();
        });
    });
});

describe("removeFile", () => {
    describe("Success", () => {
        let three;
        let four;
        beforeAll(async () => {
            three = await fileStuff.searchFiles("file 3");
            four = await fileStuff.searchFiles("file 4");
        });
        test("Validity Check - Owner", async () => {
            await fileStuff.removeFile(four[0]._id, "reg 1");
            expect(async () => {
                await fileStuff.getFile(four[0]._id);
            }).rejects.toThrow();
        });
        test("Validity Check - Moderator", async () => {
            await fileStuff.removeFile(three[0]._id, "mod 1");
            expect(async () => {
                await fileStuff.getFile(three[0]._id);
            }).rejects.toThrow();
        });
    });
    describe("Fail", () => {
        let five;
        beforeAll(async () => {
            five = await fileStuff.searchFiles("file 5");
        })
        test("Null File ID", async () => {
            expect(async () => {
                await fileStuff.removeFile(null, "mod 1");
            }).rejects.toThrow();
        });
        test("Incorrect File ID", async () => {
            expect(async () => {
                await fileStuff.removeFile("random", "mod 1");
            }).rejects.toThrow();
        });
        test("Unauthorized", async () => {
            expect(async () => {
                await fileStuff.removeFile(five[0]._id, "reg 2");
            }).rejects.toThrow();
        });

    });
});

describe("addFavorite", () => {
    let two;
    beforeAll(async () => {
        two = await fileStuff.searchFiles("file 2");
    });
    describe("Success", () => {
        test("Validity Check", async () => {
            await fileStuff.addFavorite("reg 1", two[0]._id);
            let curUser = await userStuff.getUser("reg 1");
            expect(curUser.favorites).toContainEqual(two[0]._id);
        });
    });
    describe("Fail", () => {
        test("Null File ID", async () => {
            expect(async () => {
                await fileStuff.addFavorite("reg 1", null);
            }).rejects.toThrow();
        });
        test("Incorrect File ID", async () => {
            expect(async () => {
                await fileStuff.addFavorite("reg 1", "hi");
            }).rejects.toThrow();
        });
        test("Null Username", async () => {
            expect(async () => {
                await fileStuff.addFavorite(null, two._id);
            }).rejects.toThrow();
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await fileStuff.addFavorite("peak", two._id);
            }).rejects.toThrow();
        });
        test("Already In List", async () => {
            expect(async () => {
                await fileStuff.addFavorite("reg 1", two._id);
            }).rejects.toThrow();
        });
    });
});

describe("removeFavorite", () => {
    let two;
    beforeAll(async () => {
        two = await fileStuff.searchFiles("file 2");
    });
    describe("Success", () => {
        test("Validity Check", async () => {
            await fileStuff.removeFavorite("reg 1", two[0]._id);
            let curUser = await userStuff.getUser("reg 1");
            expect(curUser.favorites).not.toContainEqual(two[0]._id);
        });
    });
    describe("Fail", () => {
        test("Null File ID", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("reg 1", null);
            }).rejects.toThrow();
        });
        test("Incorrect File ID", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("reg 1", "hi");
            }).rejects.toThrow();
        });
        test("Null Username", async () => {
            expect(async () => {
                await fileStuff.removeFavorite(null, two._id);
            }).rejects.toThrow();
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("peak", two._id);
            }).rejects.toThrow();
        });
        test("Not in the List", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("reg 1", two._id);
            }).rejects.toThrow();
        });
    });
});
*/