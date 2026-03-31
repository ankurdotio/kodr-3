import { useDispatch } from "react-redux";
import { setPosts } from "../posts.slice";
import { getPosts } from "../service/posts.api";


export const usePost = () => {

    const dispatch = useDispatch()

    async function handleGetPosts() {
        const data = await getPosts()
        dispatch(setPosts(data.posts))
    }

    return {
        handleGetPosts
    }

}