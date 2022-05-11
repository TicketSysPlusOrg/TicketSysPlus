import {
    addNewPlayer,
    deletePlayer,
    getPlayers,
    getPlayerWithID,
    updatePlayer,
} from "../controllers/playerControllers";

const routes = (app) => {
    app
        .route("/players")
    //get endpoint
        .get(getPlayers)
    //this is the POST endpoint
        .post(addNewPlayer);

    app
        .route("/players/:PlayerId")
    //get specific player
        .get(getPlayerWithID)
    //update specific player
        .put(updatePlayer)
    //delete specific player
        .delete(deletePlayer);
};

export default routes;
