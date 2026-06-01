import mongoose from 'mongoose';

const SandboxSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sandbox: {
        type: String,
        required: true,
        unique: true
    }
})

const Sandbox = mongoose.model('sandbox', SandboxSchema);

export default Sandbox;