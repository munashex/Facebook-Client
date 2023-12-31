import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import Post from '../components/Post';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiFillLike, AiOutlineSend } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa'; 


function Home() {
  const token = localStorage.getItem('token'); 
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openComment, setOpenComment] = useState(false);  
  const [comment, setComment] = useState('')
 

  setTimeout(() => {
    if (!token) {
      navigate('/signin');
    }
  }, 1000);

  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://facebook-kt2g.onrender.com/post/allposts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPosts(response.data.posts.reverse());
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const likePost = async (postId) => {
    try {
      const response = await axios.post(`https://facebook-kt2g.onrender.com/post/like/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id === postId) {
          return { ...user, likes: response.data.post.likes };
        }
        return user;
      })
    );
    } catch (err) {
      console.log(err);
    }
  };

  const DislikePost = async (postId) => {
    try {
      const response = await axios.post(`https://facebook-kt2g.onrender.com/post/dislike/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id === postId) {
          return { ...user, likes: response.data.post.likes };
        }
        return user;
      })
    );
    } catch (err) {
      console.log(err);
    }
  };


  const handleComments = async (commentId) => {
  try {
  const response = await axios.post(`https://facebook-kt2g.onrender.com/post/comment/${commentId}`, {comment: comment}, {
    headers: {
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`
    }
  })
  
  // Update the posts state to reflect the new comment
  setPosts((prevPosts) =>
  prevPosts.map((post) => {
    if (post._id === commentId) {
      return {
        ...post,
        comments: [...post.comments, response.data.comment],
      };
    }
    return post;
  })
);

// Clear the comment input field
setComment(''); 
setOpenComment(false)
  }catch(err) { 
   console.log(err)
  }
  }

 

  return (
    <div>
      <Post />

      {loading ? (
        <div className="space-y-7 mt-9">
          {[1, 2, 3].map((item) => (
            <div
              className="max-w-sm bg-gray-200 animate-pulse md:max-w-lg border p-2 mx-auto h-80"
              key={item}
            ></div>
          ))}
        </div>
      ) : (
        <div className="max-w-lg mt-9 mx-auto">
          {posts.map((post) => (
            <div key={post._id} className="border-y  md:border md:shadow rounded-md my-11">
              <div className=" p-2">

              
               <Link to={`${post.user === userId ? '/profile' : `/user/${post.user}`}`}  className="text-lg font-bold text-blue-600">{post?.name}</Link> 
                <h1>{post?.caption}</h1>
              </div>

              <img src={post.image} className="w-[100%]" />

              <div className="flex justify-around font-bold">
                <h1>{post?.likes?.length <= 1 ? 'like' : 'likes'} {post?.likes?.length}</h1>

                <Link to={`/post/${post._id}`} className={`${post?.comments?.length === 0 ? 'invisible' : 'underline text-blue-600'}`}>
                 view  {post?.comments?.length <= 1 ? 'comment' : 'comments'} 
                 </Link>

              </div>

              <div className="flex justify-around my-1">
              {post?.likes.includes(userId) ? 

              <button className="border-none outline-none" onClick={() => DislikePost(post?._id)}>
                <AiFillLike size={22} color="blue"/> 
                </button> 
              : 
              <button className="border-none outline-none" onClick={() => likePost(post?._id)}>
                <AiFillLike size={22}/> 
                </button>}

                <button onClick={() => setOpenComment(!openComment)}>
                  <FaComment size={22} />
                </button>
              </div>

              <div className={`${openComment ? 'relative bg-gray-200 p-2 max-w-sm mx-auto my-4 rounded-xl' : 'hidden'}`}>
                <textarea
                  className="w-full border-none outline-none bg-gray-200 placeholder:text-black"
                  placeholder="Write a comment" 
                  onChange={(e) => setComment(e.target.value)} 
                  
                />

                <button disabled={comment.length <= 1} onClick={() => handleComments(post?._id)} className="absolute bottom-2 right-2"><AiOutlineSend size={20} /></button>
              </div> 

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;



