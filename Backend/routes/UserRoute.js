import express from 'express';
import { changeUserPassword, completeUserProfile, deleteUserAccount, follow, getAllUsers, getCurrentUser, getFollowersAndFollowing, getUserProfile, searchUser, unfollow, updateUserProfile, userLogin, userSignup } from '../Controllers/Usercontroller.js'
import { isLoggedIn } from '../Middelwares/Isloggeddin.js';

const userrouter = express.Router();

//Auth Routes
userrouter.post('/signup',userSignup);

userrouter.post('/login',userLogin);

//password Routes
userrouter.post('/change-password',isLoggedIn,changeUserPassword);

//profile Routes
userrouter.get('/getcurrentuser',isLoggedIn,getCurrentUser) //getting current user
userrouter.get('/getuser/:id',getUserProfile) //getting user profile by id
userrouter.put('/update-profile',isLoggedIn,updateUserProfile) //updating user profile
userrouter.delete('/delete-profile',isLoggedIn,deleteUserAccount) //deleting user account

//Social route
userrouter.post('/follow/:id',isLoggedIn,follow) //follow user
userrouter.post('/unfollow/:id',isLoggedIn,unfollow) //unfollow user
userrouter.get('/get-following-followers',isLoggedIn,getFollowersAndFollowing)

//search route
userrouter.get('/search/:key',isLoggedIn,searchUser) //search users by name or username
userrouter.get('/all',isLoggedIn,getAllUsers) //get all users

//completing the profile by adding
userrouter.put('/comeple-profile',isLoggedIn,completeUserProfile)
userrouter.put('/update-interests-categories',isLoggedIn,updateUserProfile)



export default userrouter;


