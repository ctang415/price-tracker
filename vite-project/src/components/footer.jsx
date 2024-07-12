import { useEffect } from "react";
import { useState } from "react";
import SubmitButton from "./submitbutton";

const Footer = ({lastUpdated, allPages, sortText, sort, sortBy, search, retrieveProducts, setPage, page, email, setEmail, isEmail, setIsEmail}) => {
    const [buttonState, setButtonState] = useState('');
    let ignore = false;

    function submitButton(e) {
        e.preventDefault();
        if (e.nativeEvent.submitter.name == "Update") {
            optIn();
        } else {
            optOut(e);
        }
    }
    
    async function optIn() {
        try {
            const response = await fetch (`http://localhost:3000/`, {
                method: 'POST', headers: {'Content-type': 'application/json'}, 
                credentials: 'include', body: JSON.stringify({email: email})
            });
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            if (response.status === 200) {
                setIsEmail(true);
            }
        } catch (err) {
            console.log(err.msg);
        }
    }

    async function optOut(e) {
        try {
            const response = await fetch (`http://localhost:3000/`, {
                method: 'POST', headers: {'Content-type': 'application/json'}, 
                credentials: 'include', body: JSON.stringify({email: ""})
            });
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            if (response.status === 200) {
                setIsEmail(false);
                e.target.reset();
                setEmail("");
            }
        } catch (err) {
            console.log(err.msg);
        }
    }
    
    function setBold(y) {
        const pageNums = document.querySelectorAll("li[class^='text-xxs cursor-pointer hover:scale-125 hover:font-bold']");
        for (let x = 0; x < pageNums.length; x++) {
            if (pageNums[x].textContent == y) {
                pageNums[x].style.fontWeight = '900';
            } else {
                pageNums[x].style.fontWeight = '500';
            }
        }
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className='flex gap-2 self-center text-lg'>{(() => {
                const arr = [];
                for (let i = 1; i < allPages+1; i++) {
                    arr.push(
                        <ul key={i}>
                            <li onClick={sort || search ? () => { sortBy(sortText, i); setBold(i) } : () => { retrieveProducts(i); setPage(i); setBold(i) }} className={ i == 1 ? 'text-xxs cursor-pointer hover:scale-125 hover:font-bold font-bold': 'text-xxs cursor-pointer hover:scale-125 hover:font-bold'}>{i}</li>
                        </ul>
                    );
                }
                return arr;
            })()}
            </div>
            <footer className='text-center'>Prices last updated at: <b>{lastUpdated}</b></footer>
                <h3 className="text-center font-bold">Email Notifications Settings</h3>
                <form className="xs:p-2 s:p-2 flex flex-row gap-4 justify-center" onSubmit={(e) => submitButton(e)}>
                    <input className="rounded-xl p-2 min-w-full" type="email" placeholder="Get Email Updates on Lowered Prices!" 
                    value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <div><SubmitButton onClick={() => setButtonState("Update")} name={"Update"}/></div>
                    <div className={isEmail ? "flex" : "hidden"}>
                        <SubmitButton onClick={() => setButtonState("Remove")} name={"Remove"}/>
                    </div>
                </form>
       
      </div>
    )
}

export default Footer