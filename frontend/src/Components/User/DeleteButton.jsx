//delete button for single ticket view and edit ticket view
import React, { useCallback, useState } from "react";
import { Button } from "react-bootstrap";

/*further development: this could be exported and used in modal display changes, button color toggling, etc. if it appears handy*/
export const UseToggle = (initialState = false) => {
    const [state, setState] = useState(initialState);

    const toggle = useCallback(() => setState(state => !state), []);

    return [state, toggle];
};

function deleteButton ({ setDeleteTicket }) {
    const [showOrHideBtns, setBtnsState] = UseToggle();
    
    return (
        <>
            <Button onClick={setBtnsState} onSelect={setBtnsState} type={"button"} className={!showOrHideBtns ? "" : "d-none "} variant={"outline-primary"}>
                Delete?
            </Button>
            <Button onClick={() => setDeleteTicket(true)} onBlur={setBtnsState} onMouseLeave={setBtnsState} type={"submit"} className={showOrHideBtns ? "" : "d-none"} variant={"danger"}>
                Confirm
            </Button>
        </>
    );
}

export default deleteButton;
