import axios from "axios";
import { useEffect, useState } from "react";
import InfoCard from "./infocard";

export default function CaseProfile({ match, history }) {
    const [isValid, setValid] = useState();
    const [inputData, setInputData] = useState();
    const [stories, setStories] = useState([]);
    const [publicOrNot, setPublicOrNot] = useState();
    const [caseId, setCaseId] = useState();

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
                    setStories(results);
                } else {
                    if (data.id == match.params.id) {
                        setValid(false);
                        history.replace("/");
                    } else {
                        setValid(true);
                        setPublicOrNot(false);
                        setCaseId(data.id);
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
                        <>
                            <h3 onClick={() => console.log()}>
                                This is a secret page
                            </h3>
                            <form>
                                <label htmlFor="code">Enter code</label>
                                <input
                                    name="code"
                                    onChange={(e) =>
                                        setInputData(e.target.value)
                                    }
                                />
                                <button
                                    onClick={(e) => {
                                        handleSubmit(e);
                                    }}
                                >
                                    Submit
                                </button>
                            </form>
                        </>
                    )}

                    {stories.length > 0 && <InfoCard drafts={stories} />}
                </>
            )}
        </>
    );
}
