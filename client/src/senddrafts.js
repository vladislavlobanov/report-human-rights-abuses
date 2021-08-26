import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { socket } from "./socket.js";
import { receiveDrafts } from "./redux/draftreports/slice.js";
import { useDispatch, useSelector } from "react-redux";

export default function SendDrafts({ userId }) {
    const [headline, setHeadline] = useState();
    const [checked, setChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);
    const [options, setOptions] = useState();
    const [submitVisible, setSubmit] = useState(false);
    const [showSuccess, setSuccess] = useState(false);

    useEffect(async () => {
        try {
            const { data } = await axios.get("/getorganizations/");
            setOptions(
                data.map((element) => {
                    return { value: element.email, label: element.name };
                })
            );
        } catch (err) {
            console.log("Err in axios post /updatebio: ", err);
        }
    }, []);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveDrafts());
    }, []);

    useEffect(() => {
        if (headline && selectedOption.length) {
            setSubmit(true);
        } else {
            setSubmit(false);
        }
    }, [headline, selectedOption]);

    const drafts = useSelector((state) => state.draftReports);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("/senddrafts/", {
                headline,
                checked,
                selectedOption,
            });

            if (selectedOption) {
                console.log({
                    id: data.linkId,
                    user_id: data.userId,
                    headline: data.headline,
                    timestamp: data.timestamp,
                    first: data.first,
                    last: data.last,
                    email: data.email,
                });
                socket.emit("newHeadline", {
                    id: data.linkId,
                    user_id: data.userId,
                    headline: data.headline,
                    timestamp: data.timestamp,
                    first: data.first,
                    last: data.last,
                    email: data.email,
                });
            }
            setSuccess(true);
        } catch (err) {
            console.log("Err in axios post /senddrafts/");
        }
    };

    const toggleCheckBox = () => {
        setChecked(checked === "on" || checked === true ? false : true);
    };

    const handleSelect = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    if (!drafts) {
        return null;
    }

    const mainHtml = (
        <>
            {drafts.length > 0 && (
                <>
                    <p>Write a short description</p>
                    <textarea
                        onChange={(e) => {
                            setHeadline(e.target.value);
                        }}
                    ></textarea>
                    <p>
                        Please select HR organizations to send your story. It
                        will only be available via a secret link to recipients.
                    </p>
                    <form>
                        <div>
                            <input
                                type="checkbox"
                                id="makePublic"
                                name="makePublic"
                                onChange={() => {
                                    toggleCheckBox();
                                }}
                                checked={checked}
                            />
                            <label htmlFor="makePublic">
                                I would like to send my story, make it public
                                and appear in the feed
                            </label>
                        </div>
                        <div>Select organizations</div>
                        <Select
                            value={selectedOption}
                            onChange={(selectedOption) => {
                                handleSelect(selectedOption);
                            }}
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti
                        />
                        {submitVisible ? (
                            <button onClick={(e) => handleSubmit(e)}>
                                Submit
                            </button>
                        ) : (
                            <button onClick={(e) => handleSubmit(e)} disabled>
                                Submit
                            </button>
                        )}
                    </form>
                </>
            )}
            {drafts.length == 0 && <p>You have no cases to submit</p>}
        </>
    );

    return (
        <>
            <h3>Send drafts</h3>
            {!showSuccess && mainHtml}
            {showSuccess && <p>You report has been successfully submitted</p>}
        </>
    );
}

//instead of drafts.length add FALSE statement
