import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the Post type
interface Post {
    id: number;
    title: string;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]); // Use the Post type for state

    useEffect(() => {
        axios.get<Post[]>('http://your-yii2-api-url/api/post')
            .then(response => setPosts(response.data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;


