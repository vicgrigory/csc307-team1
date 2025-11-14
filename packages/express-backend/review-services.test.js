
import user from './user';
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
            username: "reg 1",
            hashedPassword: "hash"
        },
        {
            username: "reg 2",
            hashedPassword: "hash"
        },
        {
            username: "reg 3",
            hashedPassword: "hash"
        },
        {
            username: "mod 1",
            hashedPassword: "hash",
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
            expect(result[0].title).toBe("review 1");
            expect(result[0].content).toBe("this sucks");
            expect(result[0].rating).toBe(0);
        });
        test("no results", async () => {
            let result = await reviewStuff.getReviewsUser("reg 2");
            expect(result).toEqual([]);
        });
    });
    describe("fail", () => {
        test("bad user", async () => {
            expect(async () => {
                await reviewStuff.getReviewsUser();
            }).rejects.toThrow();
        });
        test("wrong user", async () => {
            expect(async () => {
                await reviewStuff.getReviewsUser("coca cola");
            }).rejects.toThrow();
        });
        
    });
});

// getReview media
describe("GET /MEDIA", () => {
    describe("success", () => {
        let curFileOne;
        let curFileTwo;
        beforeAll(async () => {
            curFileOne = await fileStuff.searchFiles("file 1");
            curFileTwo = await fileStuff.searchFiles("file 2");
        });
        test("results", async () => {
            let result = await reviewStuff.getReviewsMedia(curFileOne[0]._id);
            expect(result[0].title).toBe("review 1");
            expect(result[0].content).toBe("this sucks");
            expect(result[0].rating).toBe(0);
            expect(result[1].title).toBe("review 2");
            expect(result[1].content).toBe("this is peak");
            expect(result[1].rating).toBe(5);
        });
        test("no results", async () => {
            let result = await reviewStuff.getReviewsMedia(curFileTwo[0]);
            expect(result).toEqual([]);
        });
    });
    describe("fail", () => {
        test("bad file", async () => {
            expect(async () => {
                await reviewStuff.getReviewsMedia();
            }).rejects.toThrow();
        });
        test("wrong file", async () => {
            expect(async () => {
                await reviewStuff.getReviewsMedia("peak");
            }).rejects.toThrow();
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
            await reviewStuff.addReview(curFile[0]._id, "reg 3", "review 3", "content 3", 5);
            let curReview = await reviewStuff.getReviewsUser("reg 3");
            expect(curReview[0].title).toBe("review 3");
            expect(curReview[0].content).toBe("content 3");
            expect(curReview[0].rating).toBe(5);
        });
    });
    describe("fail", () => {
        test("invalid file id", async () => {
            expect(async () => {
                await reviewStuff.addReview(null, "reg 2", "review 4", "content 4", 2);
            }).rejects.toThrow();
        });
        test("nonexistent file id", async () => {
            expect(async () => {
                await reviewStuff.addReview("peak", "reg 2", "review 4", "content 4", 2);
            }).rejects.toThrow();
        });
        test("invalid username", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile._id, null, "review 4", "content 4", 2);
            }).rejects.toThrow();
        });
        test("nonexistent username", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile._id, "peak", "review 4", "content 4", 2);
            }).rejects.toThrow();
        });
        test("no title", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile._id, "reg 2", "", "content 4", 2);
            }).rejects.toThrow();
        });
        test("no content", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile._id, "reg 2", "review 4", "", 2);
            }).rejects.toThrow();
        });
        test("no rating", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile._id, "reg 2", "review 4", "content 4", null);
            }).rejects.toThrow();
        });
        test("second review", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile._id, "reg 3", "review 4", "content 4", 2);
            }).rejects.toThrow();
        });
    });
});

// editReview
describe("EDIT", () => {
    let curReview;
    beforeAll(async () => {
        curReview = await reviewStuff.getReviewsUser("reg 1");
    });
    describe("success", () => {
        test("content and rating", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id, "new content", 5);
            let result = await reviewStuff.getReviewsUser("reg 1");
            console.log(result);
            expect(result[0].content).toBe("new content");
            expect(result[0].rating).toBe(5);
        });
        test("content only", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id, "content 1");
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("content 1");
        });
        test("rating only", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id, null, 0);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].rating).toBe(0);
        });
        test("none", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("content 1");
            expect(result[0].rating).toBe(0);
        });
        test("mod auth", async () => {
            await reviewStuff.editReview("mod 1", curReview[0]._id, "content 4", 4);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("content 4");
            expect(result[0].rating).toBe(4);
        });
    });
    describe("fail", () => {
        test("invalid review id", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", null);
            }).rejects.toThrow();
        });
        test("nonexistent review id", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", "peak");
            }).rejects.toThrow();
        });
        test("invalid user", async () => {
            expect(async () => {
                await reviewStuff.editReview(null, "peak");
            }).rejects.toThrow();
        });
        test("nonexistent user", async () => {
            expect(async () => {
                await reviewStuff.editReview("gruh", "peak");
            }).rejects.toThrow();
        });
        test("not authorized", async () => {
            expect(async () => {
                await reviewStuff.editReview("reg 2", curFile._id, "fhwebfbub", 2);
            }).rejects.toThrow();
        });
    });
});

// deleteReview
describe("DEL", () => {
    let curFileOne;
    let curFileTwo;
    let curFileThree;
    beforeAll(async () => {
        curFileOne = await reviewStuff.getReviewsUser("reg 1");
        curFileTwo = await reviewStuff.getReviewsUser("reg 3");
        curFileThree = await reviewStuff.getReviewsUser("mod 1");
    });
    describe("success", () => {
        test("normal use", async () => {
            await reviewStuff.deleteReview("reg 1", curFileOne[0]._id);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result).toEqual([]);
        });
        test("mod auth", async () => {
            await reviewStuff.deleteReview("mod 1", curFileTwo[0]._id);
            let result = await reviewStuff.getReviewsUser("reg 3");
            expect(result).toEqual([]);
        });
    });
    describe("fail", () => {
        test("invalid review id", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("mod 1", null);
            }).rejects.toThrow();
        });
        test("nonexistent review id", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("mod 1", "peak");
            }).rejects.toThrow();
        });
        test("invalid user", async () => {
            expect(async () => {
                await reviewStuff.deleteReview(null, curFileThree[0]._id);
            }).rejects.toThrow();
        });
        test("nonexistent user", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("peak", curFileThree[0]._id);
            }).rejects.toThrow();
        });
        test("not authorized", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("reg 1", curFileThree[0]._id);
            }).rejects.toThrow();
        });
    });
});