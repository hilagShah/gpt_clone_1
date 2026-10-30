import express from "express";
import Thread from "../models/thread.js";
import getGeminiAIAPIResponse from "../utils/geminiai.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/thread", protect, async(req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id }).sort({updatedAt: -1});
        res.json(threads);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", protect, async(req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId, userId: req.user.id });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch thread"});
    }
});

router.delete("/thread/:threadId", protect, async (req, res) => {
    const { threadId } = req.params;

    try {
        const deleteThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id });

        if(!deleteThread) {
            return res.status(404).json({error: "Thread not found"});
        }
        console.log("Thread deleted !");
        res.status(200).json({success: "Thread deleted successfully."});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete the thread"});
    }
});

router.post("/chat", protect, async(req, res) => {
    const { threadId, message } = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing fields required"});
    }

    try {
        let thread = await Thread.findOne({ threadId, userId: req.user.id });

        if(!thread) {
            thread = new Thread({
                userId: req.user.id,
                threadId,
                title : message,
                messages : [{role: "user", content: message}]
            });
        }
        else {
            thread.messages.push({role: "user", content: message});
        }

        try {
            const assistantReply = await getGeminiAIAPIResponse(message);

            thread.messages.push({
                role: "assistant",
                content: assistantReply,
            });

            await thread.save();

            res.json({ reply: assistantReply });

        } catch (err) {
            return res.status(503).json({
                error: err.message
            });
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;