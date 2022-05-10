import React, { useState } from 'react';
import fetchData from "../APIActions/FetchData";
import NavBarHeader from "../NavBarHeader";

const fetchDataPromise = fetchData("ticketInfo");

function TSPApp() {
    const dataDetails = fetchDataPromise.read()

    //onclick event to show or hide shopping choices
    const [showDiv, setShowDiv] = useState(false);
    let onClickCheck = () => showDiv ? setShowDiv(false) : setShowDiv(true);

    //onclick event to show/hide json
    const [showJSON, setShowJSON] = useState(false);
    let onClickJSON = () => showJSON ? setShowJSON(false) : setShowJSON(true);

    //onselect event to show/hide related lists
    const [showVeg, setShowVeg] = useState(false);
    const [showFruit, setShowFruit] = useState(false);

    //read what's selected from list, set states because of it
    let onSelectList = () =>
    {
        let thisStateList = document.getElementById('selectLists').value;
        console.log(thisStateList);
        console.log(typeof thisStateList)
        setShowVeg(false);
        setShowFruit(false);

        if(thisStateList === '1') {
            setShowVeg(true);
        }
        else if (thisStateList === '2') {
            setShowFruit(true);
        }
    }

    return(
        <>
            <NavBarHeader />
            <div className="">
                <h1 className="text-center">Order Form</h1>
            </div>
            <div className="container mt-5">
                <div className="row align-items-center justify-content-center">
                    <div className="col-6 text-center">
                        <input className="form-check-input mt-3" type="checkbox" value="" id="flexCheckChecked" onClick={onClickCheck}/>
                        <label className="form-check-label ms-2 fs-3" htmlFor="flexCheckChecked">
                            See Grocery Stock
                        </label>
                    </div>
                    {showDiv ?
                        <div className="text-center mt-4 ">
                            <label className="px-2 d-block mb-2">{dataDetails.properties.grocery_info.properties.items.description}</label>
                            <select className="px-2 py-1" id="selectLists" onChange={onSelectList}>

                                <option className="text-secondary" value="0"> Select a List </option>

                                <option value="1" >
                                    {dataDetails.properties.grocery_info.properties.items.items.anyOf[0].title}
                                </option>

                                <option  value="2">
                                    {dataDetails.properties.grocery_info.properties.items.items.anyOf[1].title}
                                </option>

                            </select>

                            {showVeg ?
                                <ul className="list-unstyled list-group align-items-center list-group-flush ">
                                    {dataDetails.properties.grocery_info.properties.items.items.anyOf[0].veggies.map((thisVeggie) => (
                                        <li key={thisVeggie} className="list-group-item w-25 ">
                                            <input className="form-check-input ms-5 float-start" type="checkbox"  id={thisVeggie}/>
                                            <label className="" htmlFor={thisVeggie}>
                                                {thisVeggie}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                                : null}
                            {showFruit ?
                                <ul className="list-unstyled list-group align-items-center list-group-flush ">
                                    {dataDetails.properties.grocery_info.properties.items.items.anyOf[1].fruits.map((thisFruit) => (
                                        <li key={thisFruit} className="list-group-item w-25 ">
                                            <input className="form-check-input ms-5 float-start" type="checkbox"  id={thisFruit}/>
                                            <label className="" htmlFor={thisFruit}>
                                                {thisFruit}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                                : null}

                        </div>
                        : null}

                </div>

                <div className="row align-items-center justify-content-center mt-5">
                    <div className="col-7 text-center">
                        <input className="form-check-input mt-3" type="checkbox" value="" id="flexCheckChecked2" onClick={onClickJSON}/>
                        <label className="form-check-label ms-2 fs-3" htmlFor="flexCheckChecked2">
                            View JSON
                        </label>
                    </div>

                    {showJSON ?
                        <div className="col-7 text-center border border-3 border-info p-3 bg-white shadow-lg">
                            <article className="text-wrap text-break">
                                {JSON.stringify(dataDetails)}
                            </article>
                        </div>
                        : null}

                </div>
            </div>
        </>
    );
};


export default TSPApp;