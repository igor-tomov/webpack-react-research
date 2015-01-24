module.exports = [
    {
        range: 0,
        payload: {
            alertClass: "alert-danger",
            message: "You are absolutely loser"
        }
    },
    {
        range: [0.1, 0.6],
        payload: {
            alertClass: "alert-warning",
            message: "No bad, but you can better"
        }
    },
    {
        range: [0.7, 0.9],
        payload: {
            alertClass: "alert-info",
            message: "Good, you're going in right direction"
        }
    },
    {
        range: 1,
        payload: {
            alertClass: "alert-success",
            message: "Excellent, you are genius"
        }
    }
];