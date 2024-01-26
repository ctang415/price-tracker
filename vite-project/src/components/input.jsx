import { useState } from "react"
import SubmitButton from "./submitbutton"

const Input = ({retrieveProducts, page}) => {
    const [ link, setLink ] = useState('')

    const checkUrl = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch (`http://localhost:3000/products/?url=${link}`);
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
        <form className="p-4 flex flex-row gap-4 w-2/5 justify-center" onSubmit={(e) => checkUrl(e)}>
            <input className="rounded-xl p-2 min-w-full" type='search' placeholder="Add the direct link to your product here"
            onChange={(e) => setLink(e.target.value)}>
            </input>
            <SubmitButton name={"Add"}/>
        </form>
    )
}

export default Input