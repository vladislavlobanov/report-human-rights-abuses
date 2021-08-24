import axios from "axios";
import { useState } from "react";

export default function SendDrafts({ userId }) {
    const [fields, setFields] = useState({});
    const [checked, setChecked] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/senddrafts/", {
                fields,
                checked,
            });
        } catch (err) {
            console.log("Err in axios post /senddrafts/");
        }
    };

    const handleInputs = (e) => {
        setFields({
            ...fields,
        });
    };

    const toggleCheckBox = () => {
        setChecked(checked === "on" || checked === true ? false : true);
    };

    return (
        <>
            <h3 onClick={() => console.log(fields)}>Send drafts</h3>
            <p>Write a short description</p>
            <textarea></textarea>
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
                <div>SELECTOR PLACEHOLDER</div>
                <button onClick={(e) => handleSubmit(e)}>Submit</button>
            </form>
        </>
    );
}
