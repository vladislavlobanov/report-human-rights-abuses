const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "us-east-1",
});

exports.sendEmail = function (recipient, link, code) {
    return ses
        .sendEmail({
            Source: "Unheard Voices" + "<" + secrets.email + ">",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: code
                            ? `Link to the case ${link} and your code to access the page ${code}`
                            : `Link to the case ${link}`,
                    },
                },
                Subject: {
                    Data: "New case for your to review from Unheard Voices",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};

exports.sendReset = function (recipient, code) {
    return ses
        .sendEmail({
            Source: "Unheard Voices " + "<" + secrets.email + ">",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data:
                            "Please use this code: " +
                            code +
                            " to reset your password",
                    },
                },
                Subject: {
                    Data: "Password Reset",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
