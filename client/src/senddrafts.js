import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { socket } from "./socket.js";
import { receiveDrafts } from "./redux/draftreports/slice.js";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

export default function SendDrafts({ userId }) {
    const [headline, setHeadline] = useState();
    const [checked, setChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);
    const [options, setOptions] = useState();
    const [submitVisible, setSubmit] = useState(false);
    const [showSuccess, setSuccess] = useState(false);

    const useStyles = makeStyles((theme) => ({
        input: {
            backgroundColor: "white",
            borderRadius: "inherit",
        },
        inputRoot: {
            backgroundColor: "white",
        },
    }));
    const classes = useStyles();

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
            setSubmit(false);
            const { data } = await axios.post("/senddrafts/", {
                headline,
                checked,
                selectedOption,
            });

            if (selectedOption) {
                socket.emit("newHeadline", {
                    id: data.linkId,
                    user_id: data.userId,
                    headline: data.headline,
                    timestamp: data.timestamp,
                    first: data.first,
                    last: data.last,
                    email: data.email,
                });

                socket.emit("newCase", {
                    id: data.linkId,
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

    if (!drafts && !options) {
        return null;
    }

    const mainHtml = (
        <>
            {drafts != null && options != null && drafts.length > 0 && (
                <>
                    <div className="textAreaCont">
                        <div>
                            Please provide a short description of your case, i.e
                            like a Twitter post
                        </div>
                        <textarea
                            onChange={(e) => {
                                setHeadline(e.target.value);
                            }}
                        ></textarea>
                        <div>
                            Please select HR organizations to send your story.
                            It will only be available to those organizations via
                            a secret link to recipients.
                        </div>
                    </div>
                    <form className="sendDraftsForm">
                        {/* 
                        <Select
                            value={selectedOption}
                            onChange={(selectedOption) => {
                                handleSelect(selectedOption);
                            }}
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti
                        /> */}
                        <div className="autoCompleteWrapper">
                            <Autocomplete
                                multiple
                                options={options}
                                getOptionLabel={(option) => option.label}
                                filterSelectedOptions
                                classes={classes}
                                onChange={(event, value) => handleSelect(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Choose organizations"
                                    />
                                )}
                            />
                        </div>
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
            {drafts != null && drafts.length == 0 && (
                <p>You have no cases to submit</p>
            )}
        </>
    );

    return (
        <div className="sendDrafts">
            <h2 className="h2Padding">Send drafts</h2>

            {!showSuccess && mainHtml}
            {showSuccess && <p>You report has been successfully submitted!</p>}
        </div>
    );
}
