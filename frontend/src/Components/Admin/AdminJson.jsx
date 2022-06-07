import React, { useEffect, useState } from "react";

import { backendApi } from "../../index";

import JsonViewer from "./JsonViewer";

function AdminJson() {
    const [json, setJson] = useState("");

    useEffect(() => {
        run();
    }, []);

    function run() {
        backendApi.get("jsons")
            .then((res) => {
                const dbJson = res.data[0].body;
                document.getElementById("jsonText").value = dbJson;
                setJson(dbJson);
                console.log(dbJson);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="row">
                <div className="col-12 container">
                    <JsonViewer dbJson={json} />
                </div>
            </div>


        </>
    );

}

export default AdminJson;
