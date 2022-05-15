import React, {useState} from "react";
import fetchData from "../APIActions/FetchData";
import "../TicketSysPlusPages/TSPApp.css";

const fetchDataPromise = fetchData("ticketInfo");

function AdminJson() {

    const dataDetails = fetchDataPromise.read();
    const json = JSON.stringify(dataDetails, null, 3);
    const [change, setChange] = useState(true);

    function verify() {
        const jsonText = document.getElementById("jsonText").value;
        if (jsonText !== json){
            setChange(false);
        }
        else{
            setChange(true);
        }
    }

    return (
        <>
            <div className="row align-items-center justify-content-center mt-5">
                <div className="col-7 d-flex mb-1">
                    {/*TODO: Change buttons to desirable color scheme*/}
                    <button className="btn btn-danger mx-3" id="savebtn" type="button" disabled={change}>Save</button>
                    <button className="btn btn-danger mx-3" id="importbtn" type="button">Import</button>
                    <button className="btn btn-danger mx-3" id="exportbtn" type="button">Export</button>
                </div>


                <div className="col-7 text-center border border-3 border-info p-3 bg-white shadow-lg">
                    {/*TODO: Make height responsive to text area content (scrollHeight). also set this JSONstringify to defaultvalue or value of textarea*/}
                    <textarea onChange={() => verify()} style={{height: "400px"}} name="ticketData" id={"jsonText"} className="text-wrap text-break w-100">
                        {json}
                    </textarea>
                </div>
            </div>

        </>
    );

}

export default AdminJson;
