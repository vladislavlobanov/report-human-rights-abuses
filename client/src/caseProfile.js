import axios from "axios";
import { useEffect, useState } from "react";
import InfoCard from "./infocard";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

export default function CaseProfile({ match, history, standalone }) {
    const [isValid, setValid] = useState();
    const [inputData, setInputData] = useState();
    const [stories, setStories] = useState([]);
    const [publicOrNot, setPublicOrNot] = useState();
    const [caseId, setCaseId] = useState();
    const [userInfo, setUserInfo] = useState([]);

    const useStyles = makeStyles((theme) => ({
        input: {
            backgroundColor: "white",
            borderRadius: "inherit",
            // width: "300px",
        },
    }));
    const classes = useStyles();

    useEffect(async () => {
        try {
            const { data } = await axios.get("/checklink/", {
                params: { id: match.params.id },
            });

            if (data.success == true) {
                if (data.publicOrNot == true) {
                    setValid(true);
                    setPublicOrNot(true);
                    const { data: results } = await axios.get("/getreport/", {
                        params: { caseId: match.params.id },
                    });

                    const { data: userInfo } = await axios.get(
                        "/getuserinfo/",
                        {
                            params: { caseId: match.params.id },
                        }
                    );

                    setUserInfo(userInfo);
                    setStories(results);
                } else {
                    if (data.id == match.params.id) {
                        setValid(false);
                        history.replace("/");
                    } else {
                        setValid(true);
                        setPublicOrNot(false);
                        setCaseId(data.id);

                        const { data: userInfoReceived } = await axios.get(
                            "/getuserinfo/",
                            {
                                params: { caseId: data.id },
                            }
                        );
                        setUserInfo(userInfoReceived);
                    }
                }
            } else {
                setValid(false);
                history.replace("/");
            }
        } catch (err) {
            console.log("Err in axios either /checklink or /getreport", err);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/verify/", {
                code: inputData,
                caseId: caseId,
            });
            setStories(data);
        } catch (err) {
            console.log("Err in axios post /verify/");
        }
    };

    if (isValid == false) {
        return null;
    }

    return (
        <>
            {isValid && (
                <>
                    {!stories.length && !publicOrNot && (
                        <div className="mainCon">
                            <div className="mainConBack">
                                <div className="pageCode">
                                    <form className="codeForm">
                                        <h2 onClick={() => console.log()}>
                                            This case is only accessible with a
                                            code
                                        </h2>
                                        <label htmlFor="code">
                                            Please enter the code
                                        </label>
                                        {/* <input
                                    name="code"
                                    onChange={(e) =>
                                        setInputData(e.target.value)
                                    }
                                /> */}

                                        <TextField
                                            label="Code"
                                            variant="outlined"
                                            name="code"
                                            inputProps={{
                                                className: classes.input,
                                            }}
                                            onChange={(e) => {
                                                setInputData(e.target.value);
                                            }}
                                        />
                                        <button
                                            onClick={(e) => {
                                                handleSubmit(e);
                                            }}
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {stories.length > 0 && (
                        <InfoCard
                            drafts={stories}
                            showButton={false}
                            standalone={true}
                            userDetails={userInfo}
                        />
                    )}
                </>
            )}
        </>
    );
}
