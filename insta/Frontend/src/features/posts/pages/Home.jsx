import React, { useEffect } from 'react';
import PostCard from '../components/PostCard';
import { usePost } from '../hooks/usePost';
import { useSelector } from 'react-redux';


const mockData = {
    "posts": [
        {
            "_id": "69ca2588c933db9a7851dc63",
            "caption": "test caption",
            "author": {
                "profilePicture": "https://ik.imagekit.io/hnoglyswo0/avatar-photo-default-user-icon-600nw-2558759027.webp?updatedAt=1773986129958",
                "_id": "69c4e5a910515101f01efeb5",
                "username": "test_2"
            },
            "media": [
                {
                    "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/13103056_720_1280_30fps_U0V5X9jf2.mp4",
                    "media_type": "video",
                    "_id": "69ca2588c933db9a7851dc64"
                },
                {
                    "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/deadpool_uDzSZ_8-H.jpg",
                    "media_type": "image",
                    "_id": "69ca2588c933db9a7851dc65"
                },
                {
                    "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/doom_yYXq-DH18Q.jpg",
                    "media_type": "image",
                    "_id": "69ca2588c933db9a7851dc66"
                },
                {
                    "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/thor_Ty_feCF90.jpg",
                    "media_type": "image",
                    "_id": "69ca2588c933db9a7851dc67"
                }
            ],
            "createdAt": "2026-03-30T07:26:00.468Z"
        }
    ]
};

const Home = () => {

    const { handleGetPosts } = usePost()
    const posts = useSelector(state => state.posts.posts)

    useEffect(() => {
        handleGetPosts()
    }, [])

    return (
        <div className="w-full flex justify-center pb-20 md:pb-8 pt-4 md:pt-8">
            <div className="max-w-[470px] w-full px-4 sm:px-0 flex flex-col items-center">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Home;