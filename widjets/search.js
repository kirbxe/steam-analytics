export const Search = ({func}) => {

    return <div className="flex justify-center w-full my-6 items-center">
        <input  placeholder="Введите название игры" className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={func}/>
    </div>

}