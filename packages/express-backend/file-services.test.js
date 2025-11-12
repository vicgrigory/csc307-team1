import fileStuff from './file-services';
import file from './file';
import user from './user';
import userStuff from './user-services';

/* Initialization */
beforeAll(async () => {
    await setupDB();
});
afterAll(async () => {
    await tearDownDB();
});

/* Functions */
async function setupDB() {
    await user.insertMany([
        {
            username: "reg 1",
            hashedPassword: "hash"
        },
        {
            username: "reg 2",
            hashedPassword: "hash"
        },
        {
            username: "mod 1",
            hashedPassword: "hash",
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

/* Tests */
// myFiles
describe("USER", () => {
    describe("success", () => {
        test("normal use, truthy", async () => {
            expect(async () => {
                fileStuff.myFiles("reg 1");
            }).resolves.toBeTruthy;
        });
        test("normal use, parameters", async () => {
            let retrieved = (await fileStuff.myFiles("reg 1"))[0];
            expect(["file 1", "file 3"]).toContain(retrieved.title);
            expect(["external link 1", "external link 3"]).toContain(retrieved.link);
            expect(['mp3', 'pdf']).toContain(retrieved.filetype);
        });
        test("no results", async () => {
            let retrieved = await fileStuff.myFiles("reg 2");
            expect(retrieved).toEqual([]);
        });
    });
    describe("fail", () => {
        test("invalid username", async () => {
            expect( async () => {
                await fileStuff.myFiles();
            }).rejects.toThrow();
        });
        test("nonexistent user", async () => {
            expect(async () => {
                await fileStuff.myFiles("reg 6");
            }).rejects.toThrow();
        });
    });
});

// searchFiles
describe("QUERY", () => {
    describe("success", () => {
        test("query and no tags", async () => {
            let result = await fileStuff.searchFiles("file", null)[0];
            console.log(result);
            expect(["file 1", "file 2", "file 3"]).toContain(result.title);
        });
        test("no query but tags", async () => {
            let result = await fileStuff.searchFiles(null, ["science", "math"])[0];
            expect(["file 2"]).toContain(result.title);
        });
        test("query and tags", async () => {
            let result = await fileStuff.searchFiles("2", ["math", "science"])[0];
            expect(["file 2"]).toContain(result.title);
        });
        test("nothing inputted", async () => {
            let result = await fileStuff.searchFiles(null, null)[0];
            expect(["file 1", "file 2", "file 3"]).toContain(result.title);
        });
        test("no results", async () => {
            let result = await fileStuff.searchFiles("3", ["math"]);
            expect(result).toEqual([]);
        });
    });
    describe("fail", () => { // implement
        test("invalid tag", async () => {
            expect(async () => {
                await fileStuff.searchFiles("some query", "huh");
            }).rejects.toThrow()
        });
    });
});
/*
// getFile
describe("GET", () => {
    describe("success", () => {
        let fileDet;
        beforeAll(async () => {
            let fileId = (await fileStuff.searchFiles("file"))._id
            fileDet = await fileStuff.getFile(fileId);
        })
        test("title check", async () => {
            expect(fileDet.title).toBe();
        });
        test("link check", async () => {
            expect(fileDet.link).toBe();
        });
        // these should be enough to verify the file but can add more if needed
    });
    describe("fail", () => {
        test("invalid id", async () => {
            expect(async () => {
                await fileStuff.getFile();
            }).rejects.toThrow();
        });
        test("nonexistent id", async () => {
            expect(async () => {
                await fileStuff.getFile("somerandomidhere4239040358");
            }).rejects.toThrow();
        });
    });
});

// addFile
describe("ADD", () => {
    describe("success", () => {
        let fullFile
        let minFile
        beforeAll(async () => {
            fullFile = await fileStuff.addFile("reg 1", "file 4", "link 4", 'pdf', "creator 4", "date 4");
            minFile = await fileStuff.addFile("mod 1", "file 5", "link 5", 'mp3');
        });
        test("full username check", async () => {
            let curUser = await userStuff.getUser("reg 1");
            expect(fullFile.userID).toEqual(curUser._id);
        });
        test("full title check", async () => {
            expect(fullFile.title).toBe("file 4");
        });
        test("full link check", async () => {
            expect(fullFile.link).toBe("link 4");
        });
        test("minimal username check", async () => {
            let curUser = await userStuff.getUser("mod 1");
            expect(minFile.userID).toEqual(curUser._id);
        });
        test("minimal title check", async () => {
            expect(minFile.title).toBe("file 5");
        });
        test("min link check", async () => {
            expect(minFile.link).toBe("link 5");
        });
    });
    describe("fail", () => {
        test("missing username", async () => {
            expect(async () => {
                await fileStuff.addFile(null, "file 6", "link 6", 'pdf');
            }).rejects.toThrow();
        });
        test("invalid username", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 2", "file 6", "link 6", 'pdf');
            }).rejects.toThrow();
        });
        test("missing title", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", null, "link 6", 'pdf');
            }).rejects.toThrow();
        });
        test("missing file link", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", "file 6", null, 'pdf');
            }).rejects.toThrow();
        });
        test("missing file type", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", "file 6", "link 6", null);
            }).rejects.toThrow();
        });
        test("invalid file type", async () => {
            expect(async () => {
                await fileStuff.addFile("mod 1", "file 6", "link 6", 'brstm');
            }).rejects.toThrow();
        });
    });
});
/*
// editFile
describe("EDIT", () => {
    describe("success", () => {
        let editFile;
        beforeAll(async () => {
            let results = await fileStuff.searchFiles("file");
            editFile = results._id; // Rewrite to search through array
        });
        test("all fields, title check", async () => {
            await fileStuff.editFile(editFile, "reg 1", "file 6", "creator 6", "date 6");
            let result = await fileStuff.getFile(editFile);
            expect(result.title).toBe("file 6"); // can add more tests here if needed
        });
        test("title only", async () => {
            await fileStuff.editFile(editFile, "reg 1", "file 1");
            let result = await fileStuff.getFile(editFile);
            expect(result.title).toBe("file 1");
        });
        test("creator only", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, "creator 1");
            let result = await fileStuff.getFile(editFile);
            expect(result.creator).toBe("creator 1");
        });
        test("date only", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, null, "date 1");
            let result = await fileStuff.getFile(editFile);
            expect(result.creationDate).toBe("date 1");
        });
        test("nothing", async () => {
            await fileStuff.editFile(editFile, "reg 1", null, null, null);
            let result = await fileStuff.getFile(editFile);
            expect(result.title).toBe("file 1");
            expect(result.creator).toBe("creator 1");
            expect(result.creationDate).toBe("date 1");
        });
        test("mod editing", async () => {
            await fileStuff.editFile(editFile, "mod 1", null, "", "");
            let result = await fileStuff.getFile(editFile);
            expect(result.creationDate).toBe("");
            expect(result.creator).toBe("");
        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {
            expect(async () => {
                await fileStuff.editFile(null, "mod 1", "hi");
            }).rejects.toThrow();
        });
        test("nonexistent file id", async () => {
            expect(async () => {
                await fileStuff.editFile("random", "mod 1", "hi");
            }).rejects.toThrow();
        });
        test("invalid username", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, null, "hi");
            }).rejects.toThrow();
        });
        test("nonexistent username", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, "mod 15", "hi");
            }).rejects.toThrow();
        });
        test("not authorized", async () => {
            expect(async () => {
                await fileStuff.editFile(editFile, "reg 2", "hi");
            }).rejects.toThrow();
        });
    });
});

// removeFile
describe("DELETE", () => {
    describe("success", () => {
        let three;
        let four;
        let five;
        beforeAll(async () => {
            three = await fileStuff.searchFiles("file 3");
            four = await fileStuff.searchFiles("file 4");
            five = await fileStuff.searchFiles("file 5");
        });
        test("authorized - owner", async () => {
            await fileStuff.removeFile(four._id, "reg 1");
            expect(async () => {
                await fileStuff.getFile(four._id);
            }).rejects.toThrow();
        });
        test("authorized - mod", async () => {
            await fileStuff.removeFile(three._id, "mod 1");
            expect(async () => {
                await fileStuff.getFile(three._id);
            }).rejects.toThrow();
        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {
            expect(async () => {
                await fileStuff.removeFile(null, "mod 1");
            }).rejects.toThrow();
        });
        test("nonexistent file id", async () => {
            expect(async () => {
                await fileStuff.removeFile("random", "mod 1");
            }).rejects.toThrow();
        });
        test("not authorized", async () => {
            expect(async () => {
                await fileStuff.removeFile(five._id, "reg 2");
            }).rejects.toThrow();
        });

    });
});

// addFavorite
describe("ADDFAV", () => {
    let two;
    beforeAll(async () => {
        two = await fileStuff.searchFiles("file 2");
    });
    describe("success", () => {
        test("normal use", async () => {
            await fileStuff.addFavorite("reg 1", two._id);
            let user = userStuff.getUser("reg 1");
            expect(user.favorites).toContain(two);
        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {
            expect(async () => {
                await fileStuff.addFavorite("reg 1", null);
            }).rejects.toThrow();
        });
        test("nonexistent file id", async () => {
            expect(async () => {
                await fileStuff.addFavorite("reg 1", "hi");
            }).rejects.toThrow();
        });
        test("invalid username", async () => {
            expect(async () => {
                await fileStuff.addFavorite(null, two._id);
            }).rejects.toThrow();
        });
        test("nonexistent username", async () => {
            expect(async () => {
                await fileStuff.addFavorite("peak", two._id);
            }).rejects.toThrow();
        });
        test("already in list", async () => {
            expect(async () => {
                await fileStuff.addFavorite("reg 1", two._id);
            }).rejects.toThrow();
        });
    });
});

// removeFavorite
describe("DELFAV", () => {
    let two;
    beforeAll(async () => {
        two = await fileStuff.searchFiles("file 2");
    });
    describe("success", () => {
        test("normal use", async () => {
            await fileStuff.removeFavorite("reg 1", two._id);
            let user = userStuff.getUser("reg 1");
            expect(user.favorites).not.toContain(two);
        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("reg 1", null);
            }).rejects.toThrow();
        });
        test("nonexistent file id", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("reg 1", "hi");
            }).rejects.toThrow();
        });
        test("invalid username", async () => {
            expect(async () => {
                await fileStuff.removeFavorite(null, two._id);
            }).rejects.toThrow();
        });
        test("nonexistent username", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("peak", two._id);
            }).rejects.toThrow();
        });
        test("not in list", async () => {
            expect(async () => {
                await fileStuff.removeFavorite("reg 1", two._id);
            }).rejects.toThrow();
        });
    });
});
*/