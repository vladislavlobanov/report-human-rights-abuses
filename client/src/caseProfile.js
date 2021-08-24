import axios from "axios";
import { useEffect, useState } from "react";
import InfoCard from "./infocard";

export default function CaseProfile({ match, history }) {
    const [isValid, setValid] = useState();
    const [inputData, setInputData] = useState();
    const [stories, setStories] = useState([]);

    useEffect(async () => {
        const { data } = await axios.get("/checklink/", {
            params: { id: match.params.id },
        });

        if (data.success == true) {
            setValid(true);
        } else {
            setValid(false);
            history.replace("/");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/verify/", { code: inputData });
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
                    {!stories.length && (
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
