import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },

    //  Interests (user must select at least 3)
    interests: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length >= 3;
        },
        message: "Please select at least 3 interests.",
      },
      default: [],
    },

    // Preferred content categories (user must select at least 3)
    contentCategories: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length >= 3;
        },
        message: "Please select at least 3 preferred content categories.",
      },
      default: [],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "",
    },
    ageGroup: {
      type: String,
      default: "",
    },
    hobbies: {
      type: String,
      default: "",
    },
    walletAddress: {
      type: String,
      default: "",
    },
    tokensStaked: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    //  Social system
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    //  Posts
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    //  Liked posts
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    //  Comments
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
