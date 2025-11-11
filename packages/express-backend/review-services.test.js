import user from './user';
import userStuff from './user-services';
import file from './file';
import fileStuff from './file-services';
import reviewStuff from './review-services';
import review from './review';

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
    await user.insertMany([
        {
            username: "reg 1"
        },
        {
            username: "reg 2"
        },
        {
            username: "reg 3"
        },
        {
            username: "mod 1",
            type: 'moderator'
        }
    ])
    await file.insertMany([
        {
            title: "file 1",
            link: "link 1",
            filetype: 'mp3',
            userID: (await user.findOne({username: "reg 1"}))._id
        },
        {
            title: "file 2",
            link: "link 2",
            filetype: 'pdf',
            userID: (await user.findOne({username: "mod 1"}))._id
        }
    ])
    await review.insertMany([
        {
            mediaID: (await file.findOne({title: "file 1"}))._id,
            userID: (await user.findOne({username: "reg 1"}))._id,
            title: "review 1",
            content: "this sucks",
            rating: 0
        },
        {
            mediaID: (await file.findOne({title: "file 1"}))._id,
            userID: (await user.findOne({username: "mod 1"}))._id,
            title: "review 2",
            content: "this is peak",
            rating: 5
        }
    ]);
}
async function tearDownDB() {
    await review.deleteMany();
    await file.deleteMany();
    await user.deleteMany();
}

/* Tests */
// getReview user
describe("GET /USER", () => {
    describe("success", () => {
        test("results", async () => {
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result).toContain({
                mediaID: (await file.findOne({title: "file 1"}))._id,
                userID: (await user.findOne({username: "reg 1"}))._id,
                title: "review 1",
                content: "this sucks",
                rating: 0
            });
        });
        test("no results", async () => {
            let result = await reviewStuff.getReviewsUser("reg 2");
            expect(result).toBeNull();
        });
    });
    describe("fail", () => {
        test("bad user", async () => {
            
        });
        test("wrong user", async () => {

        });
        
    });
});

// getReview media
describe("GET /MEDIA", () => {
    describe("success", () => {
        test("results", async () => {

        });
        test("no results", async () => {

        });
    });
    describe("fail", () => {
        test("bad file", async () => {

        });
        test("wrong file", async () => {

        });
    });
});

// addReview
describe("ADD", () => {
    describe("success", () => {
        let curFile;
        beforeAll(async () => {
            curFile = await fileStuff.searchFiles("file 1");
        });
        test("normal use", async () => {
            await reviewStuff.addReview(curFile._id, "reg 3", "review 3", "content 3", 5);
            let curReview = await reviewStuff.getReviewsUser("reg 3");
            expect(curReview.title).toBe("review 3");
            expect(curReview.content).toBe("content 3");
            expect(curReview.rating).toBe(5);
        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {
            // do w reg 2
        });
        test("nonexistent file id", async () => {

        });
        test("invalid username", async () => {

        });
        test("nonexistent username", async () => {

        });
        test("no content", async () => {

        });
        test("no rating", async () => {

        });
        test("second review", async () => {
            // do w reg 3
        });
    });
});

// editReview
describe("EDIT", () => {
    describe("success", () => {
        test("content and rating", async () => {

        });
        test("content only", async () => {

        });
        test("rating only", async () => {

        });
        test("none", async () => {

        });
        test("mod auth", async () => {

        });
    });
    describe("fail", () => {
        test("invalid review id", async () => {

        });
        test("nonexistent review id", async () => {

        });
        test("remove content", async () => {

        });
        test("remove rating", async () => {

        });
        test("not authorized", async () => {

        });
    });
});

// deleteReview
describe("DEL", () => {
    describe("success", () => {
        test("normal use", async () => {

        });
        test("mod auth", async () => {

        });
    });
    describe("fail", () => {
        test("invalid review id", async () => {

        });
        test("nonexistent review id", async () => {

        });
        test("not authorized", async () => {

        });
    });
});