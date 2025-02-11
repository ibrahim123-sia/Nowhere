import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';


const SearchBar = () => {

    const [SearchTerm,setSearchTerm]=useState("");
    const [isOpen,setisOpen]=useState(false);    

    const HandleSearchToggle =()=>{
        setisOpen(!isOpen)
    };
    const HandleSearch=(e)=>{
        e.preventDefault();
        console.log("search term ",SearchTerm)
        setisOpen(false);
    }

  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300
    ${isOpen?"absolute top-0 left-0 w-full bg-white h-24 z-50":"w-auto"}`}>
      {isOpen ? (
        <form onSubmit={HandleSearch} className='relative flex items-center justify-center w-full'>
            <div className='relative w-1/2'>
                <input type="text"  placeholder='Search' value={SearchTerm} onChange={(e)=>setSearchTerm(e.target.value)}

                 className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full
                 placeholder:text-gray-700"

                />
                <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2
                text-gray-600 hover:text-gray-800'>
                    <HiMagnifyingGlass className='h-6 w-6'/>
                </button>
            </div>
            <button type='button' className='absolute right-4 top-1/2 transform -translate-y-1/2
             text-gray-600 hover:text-gray-800' onClick={HandleSearchToggle}>
                <HiMiniXMark className='h-6 w-6'/>
            </button>
        </form>
    ) : (
        <button onClick={HandleSearchToggle}>
            <HiMagnifyingGlass className='h-6 w-6'/>
        </button>
      )}
    </div>
  );
};

export default SearchBar
