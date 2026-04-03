import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, XCircle } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import debounce from 'lodash/debounce';
import SearchUserTile from '../components/SearchUserTile';

const Search = () => {
    const [ query, setQuery ] = useState('');
    const [ results, setResults ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const { handleSearchUser } = useUser()


    async function fetchSearchUserData(query) {
        const users = await handleSearchUser({ query })
        setResults(users)
    }

    const debouncedSearch = useMemo(
        () => debounce((query) => {
            return fetchSearchUserData(query)
        }, 500),
        []
    );

    useEffect(() => {
        if (!query) {
            return
        }
        debouncedSearch(query)
    }, [ query ])

    return (
        <div className="min-h-dvh bg-[#f9f9f9] w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-2xl mx-auto pt-8 px-4 md:px-6 lg:px-8 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-[#2d3435] tracking-tight mb-6">Search</h1>

                    {/* Search Bar */}
                    <div className="relative flex items-center w-full h-12 rounded-xl bg-[#ebeeef] px-4 transition-all focus-within:bg-[#e4e9ea] focus-within:ring-2 focus-within:ring-[#dde4e5] border border-transparent hover:border-[#dde4e5]">
                        <SearchIcon size={20} className="text-[#5a6061]" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users..."
                            className="bg-transparent border-none outline-none w-full ml-3 text-[#2d3435] placeholder-[#9c9d9d] text-[15px]"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="ml-2 text-[#9c9d9d] hover:text-[#5a6061] transition-colors">
                                <XCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results List */}
                <div className="flex flex-col gap-2 mt-6">
                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5e5e5e]"></div>
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="text-center py-10 text-[#5a6061]">
                            No results found for "{query}"
                        </div>
                    )}

                    {!loading && results.map((user) => <SearchUserTile user={user} />)}

                    {!query && !loading && (
                        <div className="text-center py-12 flex flex-col items-center justify-center opacity-70">
                            <SearchIcon size={48} className="text-[#9c9d9d] mb-4 stroke-1" />
                            <p className="text-[#5a6061] text-[15px]">Search for curators, artists, and friends</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
