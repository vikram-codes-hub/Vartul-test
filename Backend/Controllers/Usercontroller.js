import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import { generatetoken } from "../Utils/generatetokens.js";
import cloudinary from "../Config/cloudinary.js";
import redisclient from "../Config/redis.js";
import { clearUserCache } from "../Utils/redishelper.js";
//  Controller for user signup
export const userSignup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, bio } = req.body;

    
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      bio,
    });

    // Generate JWT token
    const token = generatetoken(newUser._id);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = newUser._doc;

    // Response
    res.status(201).json({
      success: true,
      UserData: userWithoutPassword,
      token,
      mssg: "Account created successfully",
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🟡 Controller for user login
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generatetoken(user._id);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    // Response
    res.status(200).json({
      success: true,
      UserData: userWithoutPassword,
      token,
      mssg: "Login successful",
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//controller to get user profile
export const getUserProfile=async(req,res)=>{
    try {
        const userId=req.params.id;

        //chache checking fiorst
        const cacheprofile=await redisclient.get(`userprofile:${userId}`);
        if(cacheprofile){
            return res.json({success:true,user:JSON.parse(cacheprofile)});
        }
        const user=await User.findById(userId).select("-password");
        if(!user){
        return res.status(404).json({message:"User not found"});
        }
         await redisclient.setEx(`user:${userId}`, 300, JSON.stringify(user));

        res.json({success:true,user});
    }catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//controller to update user profile
export const updateUserProfile=async(req,res)=>{
    try {
        const { username, bio, profilePic, interests,firstName,lastName } = req.body;
        const userId=req.user._id;
        let updateuser;

        if(!profilePic){
            updateuser=await User.findByIdAndUpdate(userId,{
                username,
                firstName,
                lastName,
                bio,
                interests
            },{new:true})
        }else{
            const uploadedImage=cloudinary.uploader.upload(profilePic)
            updateuser= await User.findByIdAndUpdate(userId,{
                username,
                firstName,
                lastName,
                bio,
                profilePic:(await uploadedImage).secure_url,
                interests
            },{new:true})

        }

        res.json({success:true,updateuser});
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//controller to delete user account
export const deleteUserAccount=async(req,res)=>{
    try {
        const userId=req.user._id;
        await User.findByIdAndDelete(userId);
        await clearUserCache(req.user._id);

        res.json({success:true,message:"User account deleted successfully"});

    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//contoller to change password
export const changeUserPassword=async(req,res)=>{
    try {
        const {currentPassword,newPassword}=req.body;
        const userId=await User.findById(req.user._id);
        const isMatcha=await bcrypt.compare(currentPassword,userId.password);
        if(!isMatcha){
            return res.status(400).json({message:"Current password is incorrect"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedNewPassword=await bcrypt.hash(newPassword,salt);
        userId.password=hashedNewPassword;
        await userId.save();
        res.json({success:true,message:"Password changed successfully"});


    } catch (error) {
        console.log("Error changing user password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//contoler to follow user 
export const follow=async(req,res)=>{
    try {
        const userIdToFollow=req.params.id;
        const currentUserId=req.user._id;

        if(userIdToFollow===currentUserId){
            return res.status(400).json({message:"You cannot follow yourself"});
        }
        const userToFollow=await User.findById(userIdToFollow);
        const currentUser=await User.findById(currentUserId);
         if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
        if(currentUser.following.includes(userIdToFollow)){
          return res.status(400).json({ message: "You already follow this user" });

        }
        userToFollow.followers.push(currentUserId);
        currentUser.following.push(userIdToFollow);
        await userToFollow.save();
        await currentUser.save();
        await clearUserCache(currentUserId);
await clearUserCache(userIdToFollow);

        res.json({success:true,message:"User followed successfully"});

    } catch (error) {
        console.log("Error in follow/unfollow user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//unfollow user controller
export const unfollow=async(req,res)=>{
    try {
        const userIdToUnfollow=req.params.id;
        const currentUserId=req.user._id;

        if(userIdToUnfollow===currentUserId){
            return res.status(400).json({message:"You cannot unfollow yourself"});
        }
         if (!userIdToUnfollow || !currentUserId) {
      return res.status(404).json({ message: "User not found" });
    }
      if (!userIdToUnfollow.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

       userIdToUnfollow.followers = userIdToUnfollow.followers.filter(
      (userId) => userId.toString() !== currentUserId
    );
    currentUserId.following = currentUserId.following.filter(
      (userId) => userId.toString() !== id
    );

        await userIdToUnfollow.save();
        await currentUserId.save();
        await clearUserCache(currentUserId);
await clearUserCache(userIdToUnfollow);


        res.status(200).json({
          success: true,
          message: "User unfollowed successfully",
        });
    } catch (error) {
        console.log("Error in unfollow user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
//get followers and follwing of the user
export const getFollowersAndFollowing=async(req,res)=>{
  try {
    const userId=req.params.id;
    if(!userId){
        return res.status(400).json({message:"User id is required"});
    }

    //checking cache fiorst
    const cachedata=await redisclient.get(`followers:${userId}`);
    if (cachedata) {
      return res.json({ success: true, ...JSON.parse(cachedata), fromCache: true });
    }
    
    const user=await User.findById(userId)
    .populate("followers","firstName lastName username profilePic")
    .populate("following","firstName lastName username profilePic")
    .select("followers following");
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

     const response = {
      followers: user.followers,
      following: user.following,
    };

    await redisclient.setEx(`followers:${userId}`, 300, JSON.stringify(response));

    res.json({success:true,followers:user.followers,following:user.following});


  } catch (error) {
    console.log("Error fetching followers and following:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
//to search the user bu his username or name
export const searchUser=async(req,res)=>{
  try {
    const {query}=req.query;
     if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

  const cacheduser=await redisclient.get(`searchuser:${query}`);
  if(cacheduser){
    return res.json({success:true,users:JSON.parse(cacheduser)});
  }

    const user=await User.find({
      $or:[
        {username:{$regex:query,$options:"i"}},
        {firstName:{$regex:query,$options:"i"}},
        {lastName:{$regex:query,$options:"i"}
      }
      ],
    }).select("firstName lastName username profilePic bio");
    if(user.length===0){
        return res.status(404).json({message:"No users found"});
    }

    const response = {
      success: true,
      count: user.length,
      user,
    }
    await redisclient.setEx(`search:${query}`, 300, JSON.stringify(response));
    res.status(200).json({
      success: true,
      count: user.length,
      user,
    });

  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//controller to get current user details
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//contolerr for getting all users for admin panel
export const getAllUsers = async (req, res) => {
  try {
    const cachedUsers = await redisclient.get("allUsers");
    if (cachedUsers) {
      return res.json({ success: true, ...JSON.parse(cachedUsers), fromCache: true });
    }

    const users = await User.find().select("username firstName lastName profilePic bio");
    const response = { count: users.length, users };

    await redisclient.setEx("allUsers", 600, JSON.stringify(response)); 

    res.json({ success: true, ...response });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Controleer for the completeuserprofile
export const completeUserProfile=async(req,res)=>{
  try {
    const {fullName,username,bio,profilePic,interests}=req.body;
    const userId=req.user._id;
     const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ");
     const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        gender,
        ageGroup,
        hobbies,
        interests,
        profilePic,
      },
      { new: true }
    ).select("-password");
    await clearUserCache(req.user._id);

   
    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//user filling the interests and content categories during signup
export const updateUserInterests = async (req, res) => {
  try {
    const { interests, contentCategories } = req.body;
    const userId = req.user._id;

    if (!interests || interests.length < 3) {
      return res.status(400).json({ message: "Select at least 3 interests" });
    }

    if (!contentCategories || contentCategories.length < 3) {
      return res.status(400).json({ message: "Select at least 3 content categories" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { interests, contentCategories },
      { new: true }
    ).select("-password");
    await clearUserCache(req.user._id);


    res.status(200).json({
      success: true,
      message: "Interests and content preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating interests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check auth
export const checkauth = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.log("Problem in checking auth", error);
    res.json({ success: false });
  }
};

//controller to forget password 
