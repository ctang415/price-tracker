import SubmitButton from "./submitbutton";

function Search ({page, setAllPages, setAllProducts, setSearch, sortText, setSortText }) {

    async function getSearch (e) {
        e.preventDefault();
        try {
            const response = await fetch (`http://localhost:3000/products/?search=${sortText}&page=${page}`);
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            if (response.status === 200) {
                console.log(data);
                setAllProducts(data[0]);
                setAllPages(Math.floor(data[1][0].COUNT/7) + 1);
                setSearch(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="p-4 flex flex-row gap-4 w-2/5 justify-center" onSubmit={(e) => getSearch(e)}>
            <input className="rounded-xl p-2 min-w-full"
            type="search" placeholder="Search product by name" onChange={(e) => setSortText(e.target.value)}>
            </input>
            <SubmitButton name={"Search"}/>
        </form>
    )
}

export default Search