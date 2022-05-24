import wrapPromise from "./WrapPromise";

function FetchData (fetchPage) {
    const apiDataPromise =
            fetch("https://backend.granny.dev/" + fetchPage)
                .then((res) => res.json());

    return wrapPromise(apiDataPromise);
}

export default FetchData;
