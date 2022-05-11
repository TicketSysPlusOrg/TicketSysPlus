import React from "react";
import fetchData from "../APIActions/FetchData";
import "../TicketSysPlusPages/TSPApp.css";

const fetchDataPromise = fetchData("ticketInfo");

function AdminJson() {

    const dataDetails = fetchDataPromise.read();

    return (
        <>
            <div className="row align-items-center justify-content-center mt-5">
                <div className="col-7 d-flex mb-1">
                    {/*TODO: Change buttons to desirable color scheme*/}
                    <button className="btn btn-danger mx-3" id="savebtn" type="button">Save</button>
                    <button className="btn btn-danger mx-3" id="importbtn" type="button">Import</button>
                    <button className="btn btn-danger mx-3" id="exportbtn" type="button">Export</button>
                </div>


                <div className="col-7 text-center border border-3 border-info p-3 bg-white shadow-lg">
                    {/*TODO: Make height responsive to text area content (scrollHeight)*/}
                    <textarea style={{height: "400px"}} name="ticketData" className="text-wrap text-break w-100">
                        {JSON.stringify(dataDetails, null, 3)}
                    </textarea>
                </div>
            </div>

        </>
    );

}

export default AdminJson;