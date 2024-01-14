import { useState } from "react"

const Input = () => {
    const [ link, setLink ] = useState('')

    return (
        <form className="p-4 flex flex-row gap-2">
            <input className="rounded-xl p-2" type='search' placeholder="Add the link to your product here"
            onChange={(e) => setLink(e.target.value)}>
            </input>
            <button className="bg-slate-500 text-white border-none border-0 hover:bg-slate-400" type='submit'>ADD</button>
        </form>
    )
}

export default Input