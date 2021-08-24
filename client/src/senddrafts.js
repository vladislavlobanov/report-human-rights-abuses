import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function SendDrafts({ userId }) {
    const [headline, setHeadline] = useState();
    const [checked, setChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/senddrafts/", {
                headline,
                checked,
                selectedOption,
            });
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

    return (
        <>
            <h3 onClick={() => console.log(headline)}>Send drafts</h3>
            <p>Write a short description</p>
            <textarea
                onChange={(e) => {
                    setHeadline(e.target.value);
                }}
            ></textarea>
            <p>
                Please select HR organizations to send your story. It will only
                be available via a secret link to recipients.
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
                        I would like to send my story, make it public and appear
                        in the feed
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
                <button onClick={(e) => handleSubmit(e)}>Submit</button>
            </form>
        </>
    );
}
