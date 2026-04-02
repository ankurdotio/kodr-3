import { searchUser } from "../service/user.api";

export const useUser = () => {

    async function handleSearchUser({ query }) {
        const data = await searchUser({ query })
        return data.users
    }


    return {
        handleSearchUser
    }

}