const Footer = ({lastUpdated, allPages, sortText, sort, sortBy, search, retrieveProducts, setPage, page}) => {

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
        <div className="flex flex-col">
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
      </div>
    )
}

export default Footer