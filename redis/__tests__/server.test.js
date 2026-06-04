import request from "supertest";
import app from "../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";




describe("GET /", () => {

    test("should return Hello World!", async () => {

        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello World!");

    })

})

describe("GET /api/notes", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        await mongoose.connection.createCollection("notes");
        await mongoose.connection.collection("notes").insertMany([
            { title: "Note 1", content: "Content of note 1" },
            { title: "Note 2", content: "Content of note 2" },
        ]);
    });

    test("should return all notes", async () => {
        const response = await request(app).get("/api/notes");

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(2);
        expect(response.body[ 0 ].title).toBe("Note 1");
        expect(response.body[ 0 ].content).toBe("Content of note 1");
        expect(response.body[ 1 ].title).toBe("Note 2");
        expect(response.body[ 1 ].content).toBe("Content of note 2");
    })


    test("Should create a new note", async () => {
        const newNote = { title: "Note 3", content: "Content of note 3" };
        const response = await request(app)
            .post("/api/notes")
            .send(newNote);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Note 3");
        expect(response.body.content).toBe("Content of note 3");
    })
})
