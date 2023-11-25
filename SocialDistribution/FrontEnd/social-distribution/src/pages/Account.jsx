import React, { Component } from 'react';
import './Account.css';
import { FaGear, IconName } from "react-icons/fa6";
import AddPost from './account/AddPost.jsx'
import photo from '../images/free_profile_picture.png'; //need to import local images, I wonder how this will work for django database
import Settings from './account/Settings';
import EditPost from './account/EditPost.jsx';
import DeletePost from './account/DeletePost.jsx';
import Comments from './account/Comments.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

function isNotEmptyObject(obj) {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
}


class Account extends Component {

    delayTime = 100;

    state = {
        user: null,
        error: null,
        userSettings: null,
        isAddPostOpen: false,
        isSettingsOpen: false,
        isEditPostOpen: false,
        isCommentsOpen: false,
        postToEdit: null,
        ownerID: null,
    };

    handleCommentsClick = () => {
        this.setState({ isCommentsOpen: true });
        console.log("Click registered")
    }

    handleCloseComments = () => {
        this.setState({ isCommentsOpen: false });
    }

    handleSettingsClick = () => {
        this.setState({ isSettingsOpen: true });
    };

    handleCloseSettings = () => {
        this.setState({ isSettingsOpen: false });
    };


    handleAddPost = () => {
        this.setState({ isAddPostOpen: true });
    }

    handleCloseAddPost = () => {
        this.setState({ isAddPostOpen: false, content: '', visibility: 'public' });
        this.retrievePostsWithDelay();
    }

    handleEditPost = (post) => {
        this.setState({ isEditPostOpen: true, postToEdit: post });
    }

    handleCloseEditPost = () => {
        this.setState({ isEditPostOpen: false, content: '', visibility: 'public', postToEdit: null });
        this.retrievePostsWithDelay();
    }

    /* Follow / Friend Request code */
    sendFollowRequest = (IDtoFollow, currentUserID) => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            // this is the ID of the user we WANT TO FOLLOW
            var actualID = Object.keys(IDtoFollow)[0];
            
            axios.get(`http://localhost:8000/api/profiles/${actualID}/`, {
                headers: {

                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',

                }
            }) 
            .then((res) => {

                var profileData = res.data;
                var profileID = profileData.id;
            
                // request payload
                const postData = {
                    "add_follow_request": currentUserID,
                    "delete_follow_request": "None",
                    "add_following": "None",
                    "delete_following": "None"
                };

               
                axios.put(`http://localhost:8000/api/profiles/${profileID}/`, postData, {
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    }
                })
                .then((res) => {
                    toast.success("Successfully Followed!")
                    this.isFollowing = true;
                    console.log(profileID)
                    console.log("followed")

                    // now we need to update the LOGGED IN user's "following field"
                    const newPostData = {
                        "add_follow_request": "None",
                        "delete_follow_request": "None",
                        "add_following": profileID,
                        "delete_following": "None"
                    };

                    axios.put(`http://localhost:8000/api/profiles/${currentUserID}/`, newPostData, {
                        headers: {
                            'Authorization': `Token ${authToken}`,
                        }
                    })
                    .then((res) => {
                    })

                    .catch((err) => {
                        console.log(err);
                    })
                    
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Error sending follow request");
                });

            })
           
            .catch((err) => {
                console.log(err);
                toast.error("Error sending follow request");
            });
        }

    }

    sendUnfollowRequest = (viewedProfileUserID, loggedInUsersID) => {
        const authToken = localStorage.getItem("authToken");
        viewedProfileUserID = Object.keys(viewedProfileUserID)[0];

        // We want to remove loggedInUsersID from the "follow_requests" field in /profiles/viewedProfileUserID
        // And we want to remove viewedProfileUserID from the "following" field in /profiles/loggedInUsersID

        // IMPRORTANT: profileID NEEDS to equal userID or else everything will break
        
        // works, but is very slow changing the buttons, w/e

        if(authToken) {
            const putData = {
                "add_follow_request": "None",
                "delete_follow_request": loggedInUsersID,
                "add_following": "None",
                "delete_following": "None"
            };

            axios.put(`http://localhost:8000/api/profiles/${viewedProfileUserID}/`, putData, {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
            })
            .then((res) => {
                const secondPutData = {
                    "add_follow_request": "None",
                    "delete_follow_request": "None",
                    "add_following": "None",
                    "delete_following": viewedProfileUserID
                };
                axios.put(`http://localhost:8000/api/profiles/${loggedInUsersID}/`, secondPutData, {
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    }
                })
                .then((res) => {
                    toast.success("You have successfully unfollowed");
                    this.isFollowing = false;
                })

                .catch((err) => {
                    toast.error("Error trying to unfollow (R2)")
                    console.log(err);
                })

            })

            .catch((err) => {
                toast.error("Error trying to unfollow (R1)");
                console.log(err);
            });
        }

    }

    handleDeletePost = (postId) => {
        const confirmation = window.confirm("Are you sure you want to delete this post?");

        if (confirmation){
            const deletePost = new DeletePost();
            deletePost.deletePost(postId)
            this.retrievePostsWithDelay();
        }
    }

    async retrievePostsWithDelay() {
        await new Promise((resolve) => {
          setTimeout(resolve, this.delayTime);
        });
    
        this.retrievePosts();
      }

    retrievePosts = () => {
        console.log("Fetching data");
        const authToken = localStorage.getItem("authToken");
    
        axios.get(`http://localhost:8000/api/posts/`, {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
        })
        .then((res) => {
            console.log(res.data);
            const user = { posts: res.data };
            this.setState({ user: user })
        })
        .catch((err) => {
            console.log(err);
            this.setState({ error: "Error loading user data" });
        });
    }
      

    componentDidMount() {
        this.retrievePosts();
        this.state.ownerID = localStorage.getItem("pk");

        this.interval = setInterval(() => {
            this.retrievePosts();
        }, 5000);
        
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    render() {
        const queryParams = new URLSearchParams(window.location.search);
        const passedData = Object.fromEntries(queryParams.entries());
        // 'passedData' is the ID we need to populate this page with

        // ID OF THE CURRENT USER THAT IS LOGGED IN
        var loggedInUsersID = localStorage.getItem("pk");
        const authToken = localStorage.getItem("authToken");

         // Check if we are currently following the viewed page
        // ID OF THE ACCOUNT WE WANT TO FOLLOW
        var actualID = Object.keys(passedData)[0];
        if (this.isFollowing !== true && this.isFollowing !== false) {
            if(authToken) {
                axios.get(`http://localhost:8000/api/profiles/${loggedInUsersID}/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
                })
                .then((res) => {
                    var following = res.data.following;
                    following.forEach(element => {
                        if (String(element) === String(actualID)) {
                            this.isFollowing = true;
                        
                        }
                    });
                    
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }
       
    
        const { user } = this.state;

        if (!user) {
            return (
                <div>Could Not Load User Data</div>
            );
        }

        return (
            <div className="grid">
                {/*Account Details*/}
                <div className="profile-picture">
                    <img  src="https://reactjs.org/logo-og.png" alt="Profile" /> {/*temporary image*/}
                </div>
                
                <p className='username'>{user.username}</p>
                
                <button className="settings-icon" onClick={this.handleSettingsClick}>
                    <FaGear/>
                </button>
                {this.state.isSettingsOpen && (
                    <Settings onClose={this.handleCloseSettings} />
                )}

                <button className="add-post-button" onClick={this.handleAddPost}>Add Post</button> 
                {/*button shoudln't show up if you are already following */}
                {isNotEmptyObject(passedData) && actualID !== loggedInUsersID && this.isFollowing === true && (
                    <button onClick={this.sendUnfollowRequest.bind(this, passedData, loggedInUsersID)} className='send-friend-request' > Unfollow</button>
                )}
                {isNotEmptyObject(passedData) && actualID !== loggedInUsersID && this.isFollowing !== true && (
                    <button onClick={this.sendFollowRequest.bind(this, passedData, loggedInUsersID)} className='send-friend-request'> Follow</button>
                )}
                
                {this.state.isAddPostOpen && (
                    <AddPost
                        onClose={this.handleCloseAddPost}
                        image={this.state.image}
                    />
                )}
                {/*Posts*/}
                {/*CODE FOR AFTER DEMO*/}
                {/* <div className="post-content">
                    {user.posts.map(post => (   //map method iterates over posts, current post is passed to arrow function
                        <div className="post-box" key={post.id}>
                            <p id="visibility">Visibility: {post.visibility}</p>
                            <p>{post.content}</p>
                            {post.post_image && <img className="post-image"src={post.post_image} alt="Post Image" />}
                            <p>Posted on: {this.formatDate(post.post_date_time)}</p>
                            <p className="likes">likes: {post.votes.length}</p>
                            <div>
                                <button className="comments-button" onClick={() => this.handleCommentsClick()}>Comments</button>
                                <button className="edit-post-button" onClick={() => this.handleEditPost(post)}>Edit</button>
                                <button className="delete-post-button" onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div> */}
                <div className="post-content">
                {user.posts
                    .filter(post => post.owner === Number(this.state.ownerID))
                    .sort((a, b) => new Date(b.post_date_time) - new Date(a.post_date_time))
                    .map(post => (
                    <div className="post-box" key={post.id}>
                        <p id="visibility">Visibility: {post.visibility}</p>
                        <p>{post.content}</p>
                        {post.post_image && <img className="post-image" src={post.post_image} alt="Post Image" />}
                        <p>Posted on: {this.formatDate(post.post_date_time)}</p>
                        <p className="likes">likes: {post.votes.length}</p>
                        <div>
                        <button className="comments-button" onClick={() => this.handleCommentsClick()}>Comments</button>
                        <button className="edit-post-button" onClick={() => this.handleEditPost(post)}>Edit</button>
                        <button className="delete-post-button" onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                        </div>
                    </div>
                    ))}
                </div>
                {this.state.isCommentsOpen && (
                    <Comments onClose={this.handleCloseComments} />
                )}
                {this.state.isEditPostOpen && (
                    <EditPost
                        onClose={this.handleCloseEditPost}
                        image={this.state.image}
                        postToEdit={this.state.postToEdit}
                    />
                )}

            </div>
        );
    }
}

export default Account;