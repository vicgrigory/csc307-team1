import user from './user';
import file from './file';
import fileStuff from './file-services';
import reviewStuff from './review-services';
import review from './review';
import mongoose from "mongoose";

/* Initialization */
beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/data", {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        }).catch((error) => console.log(error));

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
        },
        {
            username: "reg 2",
        },
        {
            username: "reg 3",
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
describe("getReviewsUser", () => {
    describe("Success", () => {
        test("Validity Check - Results", async () => {
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].title).toBe("review 1");
            expect(result[0].content).toBe("this sucks");
            expect(result[0].rating).toBe(0);
        });
        test("Validity Check - No Results", async () => {
            let result = await reviewStuff.getReviewsUser("reg 2");
            expect(result).toEqual([]);
        });
    });
    describe("Fail", () => {
        test("Null Username", async () => {
            expect(async () => {
                await reviewStuff.getReviewsUser();
            }).rejects.toThrow("Username: invalid!");
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await reviewStuff.getReviewsUser("coca cola");
            }).rejects.toThrow("Username: 404!");
        });
        
    });
});

describe("getReviewsMedia", () => {
    describe("Success", () => {
        let curFileOne;
        let curFileTwo;
        beforeAll(async () => {
            curFileOne = await fileStuff.searchFiles("file 1");
            curFileTwo = await fileStuff.searchFiles("file 2");
        });
        test("Validity Check - Results", async () => {
            let result = await reviewStuff.getReviewsMedia(curFileOne[0]._id.toString());
            expect(result[0].title).toBe("review 1");
            expect(result[0].content).toBe("this sucks");
            expect(result[0].rating).toBe(0);
            expect(result[1].title).toBe("review 2");
            expect(result[1].content).toBe("this is peak");
            expect(result[1].rating).toBe(5);
        });
        test("Validity Check - No Results", async () => {
            let result = await reviewStuff.getReviewsMedia(curFileTwo[0]._id.toString());
            expect(result).toEqual([]);
        });
    });
    describe("Fail", () => {
        test("Null File ID", async () => {
            expect(async () => {
                await reviewStuff.getReviewsMedia();
            }).rejects.toThrow("FID: invalid!");
        });
        test("ID Cast Failure", async () => {
            expect(async () => {
                await reviewStuff.getReviewsMedia(5);
            }).rejects.toThrow("FID: Not a string!");
        });
        test("Incorrect File ID", async () => {
            expect(async () => {
                await reviewStuff.getReviewsMedia("39224ad4a6e3a2e966cf15a2");
            }).rejects.toThrow("FID: 404!");
        });
    });
});

describe("addReview", () => {
    let curFile;
    beforeAll(async () => {
        curFile = await fileStuff.searchFiles("file 1");
    });
    describe("Success", () => {
        test("Validity Check", async () => {
            await reviewStuff.addReview(curFile[0]._id.toString(), "reg 3", "review 3", "content 3", 5);
            let curReview = await reviewStuff.getReviewsUser("reg 3");
            expect(curReview[0].title).toBe("review 3");
            expect(curReview[0].content).toBe("content 3");
            expect(curReview[0].rating).toBe(5);
        });
    });
    describe("Fail", () => {
        test("Null File ID", async () => {
            expect(async () => {
                await reviewStuff.addReview(null, "reg 2", "review 4", "content 4", 2);
            }).rejects.toThrow("FID: invalid!");
        });
        test("ID Cast Failure", async () => {
            expect(async () => {
                await reviewStuff.addReview(67, "reg 2", "review 4", "content 4", 2);
            }).rejects.toThrow("FID: Not a string!");
        });
        test("Incorrect File ID", async () => {
            expect(async () => {
                await reviewStuff.addReview("1afe85ef3da9476ecef010a0", "reg 2", "review 4", "content 4", 2);
            }).rejects.toThrow("FID: 404!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), null, "review 4", "content 4", 2);
            }).rejects.toThrow("Username: invalid!");
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "peak", "review 4", "content 4", 2);
            }).rejects.toThrow("Username: 404!");
        });
        test("Empty Title", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "reg 2", "", "content 4", 2);
            }).rejects.toThrow("Title: invalid!");
        });
        test("Empty Content", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "reg 2", "review 4", "", 2);
            }).rejects.toThrow("Content: invalid!");
        });
        test("Null Rating", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "reg 2", "review 4", "content 4", null);
            }).rejects.toThrow("Rating: invalid!");
        });
        test("Invalid Rating", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "reg 2", "review 4", "content 4", "peak");
            }).rejects.toThrow("Rating: invalid!");
        });
        test("Bad Rating", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "reg 2", "review 4", "content 4", -1);
            }).rejects.toThrow("Rating: invalid!");
        });
        test("Duplicate Review", async () => {
            expect(async () => {
                await reviewStuff.addReview(curFile[0]._id.toString(), "reg 3", "review 4", "content 4", 2);
            }).rejects.toThrow("Review: duplicate!");
        });
    });
});

describe("editReview", () => {
    let curReview;
    beforeAll(async () => {
        curReview = await reviewStuff.getReviewsUser("reg 1");
    });
    describe("Success", () => {
        test("Content, Rating", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id.toString(), "new content", 5);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("new content");
            expect(result[0].rating).toBe(5);
        });
        test("Content, None", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id.toString(), "content 1");
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("content 1");
        });
        test("None, Rating", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id.toString(), null, 0);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].rating).toBe(0);
        });
        test("None, None", async () => {
            await reviewStuff.editReview("reg 1", curReview[0]._id.toString());
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("content 1");
            expect(result[0].rating).toBe(0);
        });
        test("Mod Action", async () => {
            await reviewStuff.editReview("mod 1", curReview[0]._id.toString(), "content 4", 4);
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result[0].content).toBe("content 4");
            expect(result[0].rating).toBe(4);
        });
    });
    
    describe("Fail", () => {
        test("Null Review ID", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", null);
            }).rejects.toThrow("RID: invalid!");
        });
        test("RID Cast Failure", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", 9);
            }).rejects.toThrow("RID: Not a string!");
        });
        test("Incorrect Review ID", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", "79b235ad4cf8f8b17d0a6c0c");
            }).rejects.toThrow("RID: 404!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await reviewStuff.editReview(null, "peak");
            }).rejects.toThrow("Username: invalid!");
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await reviewStuff.editReview("gruh", curReview[0]._id.toString());
            }).rejects.toThrow("Username: 404!");
        });
        test("String Rating", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", curReview[0]._id.toString(), null, "abc");
            }).rejects.toThrow("Rating: invalid!");
        });
        test("Bad Rating", async () => {
            expect(async () => {
                await reviewStuff.editReview("mod 1", curReview[0]._id.toString(), null, 6);
            }).rejects.toThrow("Rating: invalid!");
        });
        test("Not Authorized", async () => {
            expect(async () => {
                await reviewStuff.editReview("reg 2", curReview[0]._id.toString(), "fhwebfbub", 2);
            }).rejects.toThrow("Username: unauthorized!");
        });
    });
});

describe("deleteReview", () => {
    let curFileOne;
    let curFileTwo;
    let curFileThree;
    beforeAll(async () => {
        curFileOne = await reviewStuff.getReviewsUser("reg 1");
        curFileTwo = await reviewStuff.getReviewsUser("reg 3");
        curFileThree = await reviewStuff.getReviewsUser("mod 1");
    });
    describe("Success", () => {
        test("Validity Check", async () => {
            await reviewStuff.deleteReview("reg 1", curFileOne[0]._id.toString());
            let result = await reviewStuff.getReviewsUser("reg 1");
            expect(result).toEqual([]);
        });
        test("Mod Action", async () => {
            await reviewStuff.deleteReview("mod 1", curFileTwo[0]._id.toString());
            let result = await reviewStuff.getReviewsUser("reg 3");
            expect(result).toEqual([]);
        });
    });
    describe("Fail", () => {
        test("Null Review ID", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("mod 1", null);
            }).rejects.toThrow("RID: invalid!");
        });
        test("RID Cast Failure", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("mod 1", 8);
            }).rejects.toThrow("RID: Not a string!");
        });
        test("Incorrect Review ID", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("mod 1", "855b115aef8a8f314f027675");
            }).rejects.toThrow("RID: 404!");
        });
        test("Null Username", async () => {
            expect(async () => {
                await reviewStuff.deleteReview(null, curFileThree[0]._id.toString());
            }).rejects.toThrow("Username: invalid!");
        });
        test("Incorrect Username", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("peak", curFileThree[0]._id.toString());
            }).rejects.toThrow("Username: 404!");
        });
        test("Not Authorized", async () => {
            expect(async () => {
                await reviewStuff.deleteReview("reg 1", curFileThree[0]._id.toString());
            }).rejects.toThrow("Username: unauthorized!");
        });
    });
});