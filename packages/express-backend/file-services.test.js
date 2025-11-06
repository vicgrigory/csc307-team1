import dotenv from 'dotenv';
import fileStuff from './file-services';
import file from './file';
dotenv.config();

/* Initialization */
beforeAll(async () => {
    await tearDownDB();
    await setupDB();
});
afterAll(async () => {
    await tearDownDB();
});
/* Functions */
async function setupDB() {
    await file.insertMany([
        {

        }
    ]);
}
async function tearDownDB() {
    await file.deleteMany();
}

/* Tests */
/*
// addFile
describe("", () => {
    describe("success", () => {
        test("full", async () => {

        });
        test("minimal", async () => {

        });
    });
    describe("fail", () => {
        test("missing username", async () => {

        });
        test("missing title", async () => {

        });
        test("missing file link", async () => {

        });
        test("missing file type", async () => {

        });
        test("invalid file type", async () => {
            // how to implement this lol
        });
    });
});

// editFile
describe("", () => {
    describe("success", () => {
        test("all fields", async () => {

        });
        test("title only", async () => {

        });
        test("creator only", async () => {

        });
        test("date only", async () => {

        });
        test("nothing", async () => {

        });
        test("mod editing", async () => {

        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {

        });
        test("nonexistent file id", async () => {

        });
        test("invalid user id", async () => {

        });
        test("nonexistent user id", async () => {

        });
        test("not authorized", async () => {

        });
    });
});

// removeFile
describe("", () => {
    describe("success", () => {
        test("valid", async () => {

        });
        test("authorized - owner", async () => {

        });
        test("authorized - mod", async () => {

        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {

        });
        test("null file id", async () => {

        });
        test("not authorized", async () => {

        });

    });
});

// searchFiles
describe("", () => {
    describe("success", () => {
        test("query and no tags", async () => {

        });
        test("no query but tags", async () => {

        });
        test("query and tags", async () => {

        });
        test("nothing inputted", async () => {

        });
        test("no results", async () => {

        });
    });
    describe("fail", () => {
        test("invalid tag", async () => {
            // how to implement?
            // add another list with available enums in the code with the enums in the schema, update seperately
        });
        test("null query", () => {

        });
        
    });
});

// myFiles
describe("", () => {
    describe("success", () => {
        test("normal use", async () => {

        });
        test("no results", async () => {

        });
    });
    describe("fail", () => {
        test("invalid username", async () => {

        });
        test("nonexistent user", async () => {

        });
    });
});

// getFile
describe("", () => {
    describe("success", () => {
        test("normal use", async () => {

        });
    });
    describe("fail", () => {
        test("invalid id", async () => {

        });
        test("nonexistent id", async () => {

        });
    });
});

// addFavorite
describe("", () => {
    describe("success", () => {
        test("normal use", async () => {

        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {

        });
        test("nonexistent file id", async () => {

        });
        test("invalid username", async () => {

        });
        test("nonexistent username", async () => {

        });
        test("already in list", async () => {

        });
        test("not authorized", async () => {

        });
    });
});

// removeFavorite
describe("", () => {
    describe("success", () => {
        test("normal use", async () => {

        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {

        });
        test("nonexistent file id", async () => {

        });
        test("invalid username", async () => {

        });
        test("nonexistent username", async () => {

        });
        test("not in list", async () => {

        });
        test("not authorized", async () => {

        });
    });
});
*/