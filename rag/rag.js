import 'dotenv/config';
import fs from 'fs';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { MistralAIEmbeddings } from "@langchain/mistralai"
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from 'uuid';


const pdfPath = "./story.pdf"
const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRALAI_API_KEY,
    model: "mistral-embed"
})

// const loader = new PDFLoader(pdfPath, {
//     splitPages: true,
// });

// const docs = await loader.load();

// const vectors = await embeddings.embedDocuments(docs.map((doc) => doc.pageContent));

// const records = vectors.map((vector, index) => ({
//     id: uuidv4(),
//     values: vector,
//     metadata: {
//         text: docs[ index ].pageContent,
//         page: index + 1,
//     },
// }));

const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY,
});
const index = await pinecone.Index("kodr-rag");

// const upsertResult = await index.upsert({
//     records: records
// })

// console.log(upsertResult)

const vector = await embeddings.embedQuery("Tell me about the Internship ?")

const queryResult = await index.query({
    vector,
    topK: 2,
    includeMetadata: true,
})

console.log(JSON.stringify(queryResult))

