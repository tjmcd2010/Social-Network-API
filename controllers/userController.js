
const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    
    // get a single user by its _id and populated thought and friend data
    async getSingleUser(req, res) {
        try {
            const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // update a user by its _id
    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a user by its _id remove a user's associated 
    //thoughts when user id is deleted

        async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },



    // post route to add a new friend to a user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete route to remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

// //Create Get route to get all users
// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Create Get route to get a single user by its _id and populated thought and friend data
// router.get('/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// //Create Post route to create a new user
// router.post('/', async (req, res) => {
//     try {
//         const user = await User.create(req.body);
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Create Put route to update a user by its _id
// router.put('/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// //Create Delete route to remove a user by its _id
// router.delete('/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// //Remove a user's associated thoughts when user id is deleted
// router.delete('/:userId/thoughts/:thoughtId', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             req.params.userId,
//             { $pull: { thoughts: req.params.thoughtId } },
//             { new: true }
//         );
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// // post route to add a new friend to a user's friend list
// router.post('/:userId/friends/:friendId', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             req.params.userId,
//             { $addToSet: { friends: req.params.friendId } },
//             { new: true }
//         );
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// // delete route to remove a friend from a user's friend list
// router.delete('/:userId/friends/:friendId', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             req.params.userId,
//             { $pull: { friends: req.params.friendId } },
//             { new: true }
//         );
//         res.json(user);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;

