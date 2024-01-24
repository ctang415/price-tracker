import { useState } from "react"

const Input = ({retrieveProducts, page}) => {
    const [ link, setLink ] = useState('')

    const checkUrl = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch (`http://localhost:3000/products/${link.slice(-10)}`);
            if (!response.ok) {
                if(response.status === 400) {
                    throw await response.json();
                }
            }
            const data = await response.json();
            if (response.status === 200) {
                scrapeWebsite()
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function scrapeWebsite () {
        try {
            const response = await fetch (`http://localhost:3000/products`, {
                method: 'POST', headers: {'Content-type': 'application/json'}, 
                credentials: 'include', body: JSON.stringify({link: link})
            })
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            if (response.status === 200) {
                retrieveProducts(page)
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="p-4 flex flex-row gap-2" onSubmit={(e) => checkUrl(e)}>
            <input className="rounded-xl p-2" type='search' placeholder="Add the link to your product here"
            onChange={(e) => setLink(e.target.value)}>
            </input>
            <button className="bg-slate-500 text-white border-none border-0 hover:bg-slate-400" type='submit'>ADD</button>
        </form>
    )
}

export default Input