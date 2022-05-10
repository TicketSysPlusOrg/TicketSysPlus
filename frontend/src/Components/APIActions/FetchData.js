import wrapPromise from "./WrapPromise";

function FetchData (fetchPage) {
    const apiDataPromise =
            fetch("http://localhost:4001/" +fetchPage)
                .then((res) => res.json())

    return wrapPromise(apiDataPromise);
}

export default FetchData;