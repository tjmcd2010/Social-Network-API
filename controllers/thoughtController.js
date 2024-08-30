const { ObjectId } = require('mongoose').Types;
const { Thought, User} = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // Get a single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Create a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought created, but found no user with that ID',
                    })
                    : res.json('Created the thought ���')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Delete a thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought deleted but no user with this id!',
                    })
                    : res.json({ message: 'Thought successfully deleted!' })
            )
            .catch((err) => res.status(500).json(err));
    },
    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Add a reaction to a thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Remove a reaction from a thought
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};



// //Get route to get all thoughts
// router.get('/', async (req, res) => {
//     try {
//         const thoughts = await Thought.find();
//         res.json(thoughts);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Get route to get a single thought by its _id
// router.get('/:thoughtId', async (req, res) => {
//     try {
//         const thought = await Thought.findOne({ _id: req.params.thoughtId });
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Post route to create a new thought. Also pushes the created thoughts '_id' 
// //to the associated user's thought's array field
// router.post('/', async (req, res) => {
//     try {
//         const thought = await Thought.create(req.body);
//         const user = await User.findOneAndUpdate(
//             { username: req.body.username },
//             { $push: { thoughts: thought._id } },
//             { new: true }
//         );
//         if (!user) {
//             res.status(404).json({ message: 'No user found with this username!' });
//             return;
//         }
//         res.json(thought);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Put route to update a thought by its _id
// router.put('/:thoughtId', async (req, res) => {
//     try {
//         const thought = await Thought.findOneAndUpdate(
//             { _id: req.params.thoughtId },
//             { $set: req.body },
//             { runValidators: true, new: true }
//         );
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Delete route to delete a thought by its _id
// router.delete('/:thoughtId', async (req, res) => {
//     try {
//         const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json({ message: 'Thought deleted!' });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Post route to create a reaction stored in a single thought's reactions array field
// router.post('/:thoughtId/reactions', async (req, res) => {
//     try {
//         const thought = await Thought.findOneAndUpdate(
//             { _id: req.params.thoughtId },
//             { $addToSet: { reactions: req.body } },
//             { runValidators: true, new: true }
//         );
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Delete route to pull and remove a reaction by the reaction's reactionId value
// router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
//     try {
//         const thought = await Thought.findOneAndUpdate(
//             { _id: req.params.thoughtId },
//             { $pull: { reactions: { reactionId: req.params.reactionId } } },
//             { runValidators: true, new: true }
//         );
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;