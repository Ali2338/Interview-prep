const Session = require('../models/Session');
const Question = require('../models/Question');

exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicToFocus, description, questions } = req.body;
        const userId = req.user._id;

        // Step 1: Create the session without questions
        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicToFocus, // Make sure schema matches case
            description
        });

        // Step 2: Create Question docs and collect their IDs
        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                });
                return question._id;
            })
        );

        // Step 3: Link Question IDs to the session
        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success: true, session });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.getSessionById = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id)
        .populate({
            path: 'questions',
            options:{ sort: { isPinned: -1,createdAt: -1 } },
        })
        .exec();
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({success: true, session});

    }catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getMySessions = async (req, res) => {
    try{
        const sessions = await Session.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('questions');
        res.status(200).json(sessions);

    }catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Compare ObjectIds properly
        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this session' });
        }

        // Delete all related questions
        await Question.deleteMany({ session: session._id });

        // Delete the session itself
        await session.deleteOne();

        // Send success response
        res.status(200).json({ message: 'Session deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
