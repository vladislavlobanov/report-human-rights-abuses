/* eslint-disable indent */
import GeocoderService from "@mapbox/mapbox-sdk/services/geocoding";
const secrets = require("../../server/secrets.json");
import Map from "./map";
import InfoCard from "./infocard";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveDrafts } from "./redux/draftreports/slice.js";
import { socket } from "./socket.js";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";

const options = ["Option 1", "Option 2"];

export default function Report({ match, history }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [center, setCenter] = useState([]);
    const [pin, setPin] = useState();
    const [fields, setFields] = useState({});
    const [location, setLocation] = useState(false);
    const [receivedPin, setReceivedPin] = useState({});
    const [draftId, setDraftId] = useState();
    const [currentDateString, setCurrentDate] = useState();
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState("");

    const geocoder = GeocoderService({
        accessToken: secrets.mapbox,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveDrafts());
    }, []);

    const drafts = useSelector((state) => state.draftReports);

    const handlePinChange = (longitude, latitude) => {
        setPin({ longitude: longitude, latitude: latitude });
    };

    const who = useRef();
    const what = useRef();
    const when = useRef();
    const where = useRef();
    const why = useRef();

    const handleMore = async (e) => {
        e.preventDefault();
        if (!draftId) {
            console.log(fields);
            socket.emit("newDraft", fields);
            who.current.value = "";
            what.current.value = "";
            // when.current.value = "";

            why.current.value = "";
            setSearchTerm("");
            setLocation(!location);
            setFields({});
        } else {
            socket.emit("editDraft", fields);
            who.current.value = "";
            what.current.value = "";
            // when.current.value = "";

            why.current.value = "";
            setSearchTerm("");
            setLocation(!location);
            setFields({});
            setDraftId("");
        }
    };

    const searchHtml = (
        <>
            {searchTerm && (
                <>
                    {searchTerm && searchData.length > 0 ? (
                        <>
                            <div className="dropDown">
                                {searchData.map((searchData, index) => (
                                    <div
                                        key={index}
                                        tabIndex={0}
                                        className="dropDownElement"
                                        onInput={onInput}
                                        onClick={() => {
                                            setSearchTerm(
                                                searchData.place_name
                                            );
                                            setFields({
                                                ...fields,
                                                where: searchData.place_name,
                                                ...pin,
                                            });

                                            setCenter(searchData.center);
                                            setSearchData([]);
                                        }}
                                    >
                                        {searchData.place_name}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}
                </>
            )}
        </>
    );

    const handleInputs = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value,
            ...pin,
        });
    };

    useEffect(() => {
        setFields({
            ...fields,
            ...pin,
        });
    }, [pin]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        who.current.value = data.who;
        what.current.value = data.what;
        setCurrentDate(data.when);
        why.current.value = data.why;
        setSearchTerm(data.wherehappened);
        setCenter([Number(data.longitude), Number(data.latitude)]);
        setReceivedPin({
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
        });

        setFields({
            who: data.who,
            what: data.what,
            when: data.when,
            where: data.wherehappened,
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
            why: data.why,
            draftId: data.id,
        });
        setDraftId(data.id);
        socket.emit("deleteDraft", data.id, true);
    };

    useEffect(() => {
        setCurrentDate(
            moment().format("YYYY-MM-DD") + `T` + moment().format("HH:mm")
        );
        setFields({
            ...fields,
            when: currentDateString,
        });
    }, [currentDateString]);

    async function onInput(value) {
        if (value) {
            let abort;
            (async () => {
                const query = value;
                const response = await geocoder
                    .forwardGeocode({ query, limit: 5 })
                    .send();
                if (!abort) {
                    setSearchData(response.body.features);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }

    if (!drafts) {
        return null;
    }

    return (
        <div className="reportContainer">
            <h1 onClick={() => console.log(fields)}>Report component</h1>
            <form>
                <label htmlFor="who">Who:</label>
                <input
                    name="who"
                    ref={who}
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />
                <label htmlFor="what">What:</label>
                <input
                    name="what"
                    ref={what}
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />
                <TextField
                    name="when"
                    ref={when}
                    id="datetime-local"
                    label="When"
                    type="datetime-local"
                    defaultValue={currentDateString}
                    onChange={(e) => handleInputs(e)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {/* <label htmlFor="when">When:</label>
                <input
                    name="when"
                    ref={when}
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                /> */}
                <label htmlFor="where">Where:</label>
                <div>{`Select: ${value !== null ? `'${value}'` : "null"}`}</div>
                <div>{`Searchterm: '${searchTerm}'`}</div>
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    // options={options}
                    options={searchData.map(
                        (searchData) => searchData.place_name
                    )}
                    inputValue={searchTerm}
                    onInputChange={(e, value) => {
                        setSearchTerm(value);
                        onInput(searchTerm);
                        setFields({
                            ...fields,
                            where: value,
                            ...pin,
                        });
                    }}
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        if (
                            event.target.getAttribute("data-option-index") !=
                            null
                        ) {
                            setCenter(
                                searchData[
                                    event.target.getAttribute(
                                        "data-option-index"
                                    )
                                ].center
                            );
                            setFields({
                                ...fields,
                                where: searchData[
                                    event.target.getAttribute(
                                        "data-option-index"
                                    )
                                ].place_name,
                                ...pin,
                            });
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="freeSolo"
                            margin="normal"
                            variant="outlined"
                        />
                    )}
                />

                {/* <div className="whereContainer">
                    <input
                        autoComplete="off"
                        ref={where}
                        // onClick={onInput}
                        name="where"
                        value={searchTerm}
                        // onInput={() => {
                        //     onInput;
                        // }}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            // handleInputs(e);
                        }}
                    />
                    {searchHtml}
                </div> */}
                <label htmlFor="why">Why:</label>
                <input
                    ref={why}
                    name="why"
                    onChange={(e) => {
                        handleInputs(e);
                    }}
                />
                {fields.who &&
                fields.what &&
                fields.where &&
                fields.longitude &&
                fields.latitude &&
                fields.why ? (
                    <>
                        <button onClick={(e) => handleMore(e)}>Save</button>
                    </>
                ) : (
                    <button disabled>Save</button>
                )}

                {drafts.length > 0 ? (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            history.push("/finalize");
                        }}
                    >
                        Procced to submission
                    </button>
                ) : (
                    <button disabled>Procced to submission</button>
                )}
            </form>
            <div className="map">
                <Map
                    center={center}
                    mapboxApiAccessToken={secrets.mapbox}
                    handlePinChange={handlePinChange}
                    deleteLocation={location}
                    receivedPin={receivedPin}
                />
            </div>
            {drafts.length > 0 && (
                <InfoCard
                    drafts={drafts}
                    showButton={true}
                    handleEdit={handleEdit}
                />
            )}
        </div>
    );
}
