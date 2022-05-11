function wrapPromise(promise) {
    // console.log(promise);
    let status = "DATA PENDING";
    let response;

    const suspender = promise.then(
        (res) => {
            status = "DATA SUCCESS";
            response = res;
        },
        (err) => {
            status = "ERROR";
            response = err;
        },
    );
    const read = () => {
        switch (status) {
        case "DATA PENDING":
            throw suspender;
        case "ERROR":
            throw response;
        default:
            return response;
        }
    };

    return { read };
}

export default wrapPromise;
