import React from "react";
import PropTypes from "prop-types";


export const ErrorComponent = ({error}) => {
    return <p>An Error Occurred: {error.errorCode}</p>;
};

ErrorComponent.propTypes = {
    error: PropTypes.object
};
