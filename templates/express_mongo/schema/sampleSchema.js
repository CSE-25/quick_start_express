import mongoose from "mongoose";

const sampleSchema1 = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const sampleSchema2 = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        reqired: true,
        min: 0,
    },
});

export { sampleSchema1, sampleSchema2 };
