import { Dialog, DialogTitle, Fab, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BlockIcon from "@mui/icons-material/Block";
import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * This component contains the code for the main page legend, which has descriptive info for new users.
 * @param {props} open state that tells the component to display.
 * @param {props} onClose state handler triggering modal close.
 * @returns {JSX.Element} SimpleDialog component.
 */
function SimpleDialog({ open, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
        >
            <DialogTitle>Icon Button Legend</DialogTitle>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <IconButton>
                            <VisibilityIcon className={"eyeSee"} sx={{ fontSize: "1.7rem" }} />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        View the Ticket
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <IconButton color="primary">
                            <ModeEditIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        Edit the Ticket
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <IconButton color="primary">
                            <OpenInNewIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        Open in Azure DevOps
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <IconButton color="default">
                            <BlockIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        Not a Blocked Ticket (Click to Block)
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <IconButton color="error">
                            <BlockIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        A Blocked Ticket (Click to Unblock)
                    </ListItemText>
                </ListItem>
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * This component contains the code for opening/closing the legend modal.
 * @returns {JSX.Element} Legend component.
 */
function Legend() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Fab
                color={"primary"}
                sx={{
                    position: "fixed",
                    bottom: 30,
                    left: 30
                }}
                onClick={() => setOpen(true)}
            >
                <QuestionMarkIcon />
            </Fab>

            <SimpleDialog open={open} onClose={handleClose} />
        </>
    );
}

export default Legend;
