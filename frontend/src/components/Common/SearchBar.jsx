import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productSlice"

const SearchBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSearchToggle = () => {
        setIsOpen(!isOpen)
        if (isOpen) {
            setSearchTerm("")
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchTerm.trim()) return
        
        dispatch(setFilters({ search: searchTerm }))
        dispatch(fetchProductsByFilters({ search: searchTerm }))
        navigate(`/collections/all?search=${encodeURIComponent(searchTerm)}`)
        setIsOpen(false)
        setSearchTerm("")
    }

    return (
        <div className={`relative ${isOpen ? "w-full" : "w-auto"}`}>
            {/* Mobile/Compact Search Button */}
            {!isOpen && (
                <button 
                    onClick={handleSearchToggle}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    aria-label="Open search"
                >
                    <HiMagnifyingGlass className="h-5 w-5" />
                </button>
            )}

            {/* Expanded Search Form */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-4">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-5 pr-12 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                                    aria-label="Search"
                                >
                                    <HiMagnifyingGlass className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSearchToggle}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                    aria-label="Close search"
                                >
                                    <HiMiniXMark className="h-6 w-6" />
                                </button>
                            </div>
                            {searchTerm && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Press Enter to search for "{searchTerm}"
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar