import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../../../mongoose/schemas/user.mjs";
import { Post } from "../../../mongoose/schemas/post.mjs";
import { Comment } from "../../../mongoose/schemas/comment.mjs";
import { authenticateToken } from "../../../utils/middleware.mjs";
import { getFollowingIds, getTimeDifference } from "../../../utils/helpers.mjs";
import { SavedPost } from "../../../mongoose/schemas/savedPost.mjs";

const router = Router();

// fetch all posts in home page
router.get("/api/fetchAllPosts", authenticateToken, async (req, res) => {
  const { page, limit } = req.query;

  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).send({ msg: "No user found, ERROR!!!" });
    }

    const followingIds = await getFollowingIds(req.userId);

    // filter all the posts where the post has
    // a userId contained in the followingIds array
    let matchStage = {
      userId: {
        $in: followingIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    };

    const posts = await Post.aggregate([
      { $match: matchStage },
      { $sort: { createDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        // from the Like collection,
        $lookup: {
          from: "likes",
          // define a postId variable, where value = _id field.
          // Dollar sign means the _id field is in the current doc.
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                // allows the use of aggregation expressions
                $expr: {
                  $and: [
                    // double dollar sign used for access variables
                    // defined in the let clause (i.e. postId = "$_id")

                    // compare $postId in Like and $$postId in Post
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: [
                        "$userId",
                        new mongoose.Types.ObjectId(`${req.userId}`),
                      ],
                    },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: "likeDocs",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$likeDocs" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          // field in Post
          localField: "userId",
          // field in User
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
              },
            },
            {
              $count: "total",
            },
          ],
          as: "commentCount",
        },
      },
      {
        $addFields: {
          commentCount: {
            $ifNull: [{ $arrayElemAt: ["$commentCount.total", 0] }, 0],
          },
        },
      },
      {
        $lookup: {
          from: "savedposts",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: ["$userId", new mongoose.Types.ObjectId(req.userId)],
                    },
                  ],
                },
              },
            },
          ],
          as: "savedDocs",
        },
      },
      {
        $addFields: {
          isSaved: { $gt: [{ $size: "$savedDocs" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          userId: {
            _id: "$user._id",
            displayName: "$user.displayName",
            icon: "$user.icon",
          },
          imageUri: 1,
          width: 1,
          height: 1,
          title: 1,
          description: 1,
          hashtag: 1,
          createDate: 1,
          likes: 1, // Keep the original likes field
          hasLiked: 1,
          commentCount: 1,
          isSaved: 1,
          timeAgo: { $literal: "" }, // Placeholder for timeAgo, to be calculated in application code
        },
      },
    ]);

    const hasMore = posts.length > limit;
    const postData = posts.slice(0, limit).map((post) => {
      post.timeAgo = getTimeDifference(post.createDate);
      return post;
    });

    return res.status(200).send({ postData, hasMore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send({ msg: "Error when fetching posts" });
  }
});

// fetch user posts in user profile page
router.get("/api/fetchUserPosts", authenticateToken, async (req, res) => {
  const { page, limit, targetId } = req.query;

  try {
    const user = await User.findById(targetId).lean();
    if (!user) {
      return res.status(404).send({ msg: "No user found, ERROR!!!" });
    }

    const posts = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(targetId) } },
      { $sort: { createDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        // from the Like collection,
        $lookup: {
          from: "likes",
          // define a postId variable, where value = _id field.
          // Dollar sign means the _id field is in the current doc.
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                // allows the use of aggregation expressions
                $expr: {
                  $and: [
                    // double dollar sign used for access variables
                    // defined in the let clause (i.e. postId = "$_id")

                    // compare $postId in Like and $$postId in Post
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: ["$userId", new mongoose.Types.ObjectId(targetId)],
                    },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: "likeDocs",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$likeDocs" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          // field in Post
          localField: "userId",
          // field in User
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
              },
            },
            {
              $count: "total",
            },
          ],
          as: "commentCount",
        },
      },
      {
        $addFields: {
          commentCount: {
            $ifNull: [{ $arrayElemAt: ["$commentCount.total", 0] }, 0],
          },
        },
      },
      {
        $lookup: {
          from: "savedposts",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: ["$userId", new mongoose.Types.ObjectId(req.userId)],
                    },
                  ],
                },
              },
            },
          ],
          as: "savedDocs",
        },
      },
      {
        $addFields: {
          isSaved: { $gt: [{ $size: "$savedDocs" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          userId: {
            _id: "$user._id",
            displayName: "$user.displayName",
            icon: "$user.icon",
          },
          imageUri: 1,
          width: 1,
          height: 1,
          title: 1,
          description: 1,
          hashtag: 1,
          createDate: 1,
          likes: 1, // Keep the original likes field
          hasLiked: 1,
          commentCount: 1,
          isSaved: 1,
          timeAgo: { $literal: "" }, // Placeholder for timeAgo, to be calculated in application code
        },
      },
    ]);

    const hasMore = posts.length > limit;
    const postData = posts.slice(0, limit).map((post) => {
      post.timeAgo = getTimeDifference(post.createDate);
      return post;
    });

    return res.status(200).send({ postData, hasMore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send({ msg: "Error when fetching posts" });
  }
});

// fetch comments in post page
router.get("/api/fetchComments", authenticateToken, async (req, res) => {
  const { postId, parentCommentId, page, limit } = req.query;

  try {
    const matchStage = parentCommentId
      ? { parentCommentId: new mongoose.Types.ObjectId(parentCommentId) }
      : { postId: new mongoose.Types.ObjectId(postId), parentCommentId: null };

    const comments = await Comment.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "commentlikes",
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$commentId", "$$commentId"] },
                    {
                      $eq: ["$userId", new mongoose.Types.ObjectId(req.userId)],
                    },
                  ],
                },
              },
            },
          ],
          as: "userLike",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$userLike" }, 0] },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "parentCommentId",
          as: "subComments",
        },
      },
      {
        $addFields: {
          hasSubComment: { $gt: [{ $size: "$subComments" }, 0] },
        },
      },
      { $project: { subComments: 0 } },
      { $sort: { createDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          userId: 1,
          content: 1,
          createDate: 1,
          likes: 1,
          hasLiked: 1,
          hasSubComment: 1,
          timeAgo: { $literal: "" },
          "user.displayName": 1,
          "user.icon": 1,
        },
      },
    ]);

    const hasMore = comments.length > limit;
    const commentData = comments.slice(0, limit).map((comment) => {
      comment.timeAgo = getTimeDifference(comment.createDate);
      return comment;
    });

    res.status(200).send({ commentData, hasMore });
  } catch (error) {
    res.status(400).send({ msg: "Error fetching comments" });
  }
});

router.get("/api/fetchSavedPosts", authenticateToken, async (req, res) => {
  const { page, limit } = req.query;

  try {
    const savedPosts = await SavedPost.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      { $sort: { savedAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) + 1 },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $lookup: {
          from: "users",
          localField: "post.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$post._id" }, // Adjust this based on your saved posts structure
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    {
                      $eq: ["$userId", new mongoose.Types.ObjectId(req.userId)],
                    },
                  ],
                },
              },
            },
          ],
          as: "likeDocs",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$likeDocs" }, 0] },
        },
      },
      {
        $project: {
          _id: "$post._id",
          userId: {
            _id: "$user._id",
            displayName: "$user.displayName",
            icon: "$user.icon",
          },
          imageUri: "$post.imageUri",
          width: "$post.width",
          height: "$post.height",
          title: "$post.title",
          description: "$post.description",
          hashtag: "$post.hashtag",
          createDate: "$post.createDate",
          hasLiked: 1,
          likes: "$post.likes",
          isSaved: { $literal: true },
          timeAgo: { $literal: "" },
        },
      },
    ]);

    const hasMore = savedPosts.length > limit;
    const postData = savedPosts.slice(0, limit).map((post) => {
      post.timeAgo = getTimeDifference(post.createDate);
      return post;
    });

    return res.status(200).send({ postData, hasMore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send({ msg: "Error when fetching saved posts" });
  }
});

export default router;
