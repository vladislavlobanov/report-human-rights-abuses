/* eslint-disable indent */
import GeocoderService from "@mapbox/mapbox-sdk/services/geocoding";
const secrets = require("../../server/secrets.json");

import Map from "./map";
import InfoCard from "./infocard";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveDrafts } from "./redux/draftreports/slice.js";
import { socket } from "./socket.js";

import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import moment from "moment";

export default function Report({ match, history }) {
    const useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: "white",
            borderRadius: "inherit",
        },
    }));

    const classes = useStyles();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [center, setCenter] = useState([]);
    const [pin, setPin] = useState("");
    const [fields, setFields] = useState({});
    const [location, setLocation] = useState(false);
    const [receivedPin, setReceivedPin] = useState({});
    const [draftId, setDraftId] = useState();
    const [value, setValue] = useState("");
    const [valueDate, setValueDate] = useState(new Date());

    const geocoder = GeocoderService({
        accessToken: secrets.mapbox,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveDrafts());
    }, []);

    useEffect(() => {
        setFields({
            ...fields,
            ...pin,
        });
    }, [pin]);

    const drafts = useSelector((state) => state.draftReports);

    const handlePinChange = (longitude, latitude) => {
        setPin({ longitude: longitude, latitude: latitude });
    };

    const handleMore = async (e) => {
        e.preventDefault();
        if (!draftId) {
            socket.emit("newDraft", fields);
            setSearchTerm("");
            setLocation(!location);

            setValue("");
            setPin("");
            setFields({
                when:
                    moment().format("YYYY-MM-DD") +
                    `T` +
                    moment().format("HH:mm"),
                longitude: "",
                latitude: "",
            });
        } else {
            socket.emit("editDraft", fields);
            setSearchTerm("");
            setLocation(!location);

            setValue("");
            setPin("");
            setFields({
                when:
                    moment().format("YYYY-MM-DD") +
                    `T` +
                    moment().format("HH:mm"),
                longitude: "",
                latitude: "",
            });
            setDraftId("");
        }
    };

    const handleInputs = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value,
            ...pin,
        });
    };

    const handleEdit = (e, data) => {
        e.preventDefault();

        setValueDate(
            moment(data.when).format("YYYY-MM-DD") +
                `T` +
                moment(data.when).format("HH:mm")
        );

        setSearchTerm(data.wherehappened);
        setCenter([Number(data.longitude), Number(data.latitude)]);
        setReceivedPin({
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
        });

        setFields({
            who: data.who,
            what: data.what,
            // when: data.when,
            when:
                moment(data.when).format("YYYY-MM-DD") +
                `T` +
                moment(data.when).format("HH:mm"),
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
        setFields({
            ...fields,
            when:
                moment().format("YYYY-MM-DD") + `T` + moment().format("HH:mm"),
        });
    }, []);

    const onInput = async (value) => {
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
    };

    if (!drafts) {
        return null;
    }

    return (
        <div className="reportContainer">
            <div className="leftSide">
                <h2>Report Your Incident</h2>
                <form className="insideForm">
                    <div className="inputs">
                        <TextField
                            label="Who"
                            variant="outlined"
                            name="who"
                            value={fields.who || ""}
                            classes={classes}
                            onChange={(e) => {
                                handleInputs(e);
                            }}
                        />

                        <TextField
                            label="What"
                            variant="outlined"
                            name="what"
                            value={fields.what || ""}
                            classes={classes}
                            onChange={(e) => {
                                handleInputs(e);
                            }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => (
                                    <TextField {...props} classes={classes} />
                                )}
                                label="When"
                                value={fields.when || valueDate}
                                mask={"__.__.____ __:__"}
                                inputFormat="dd.MM.yyyy HH:mm"
                                PopperProps={{
                                    placement: "bottom-end",
                                    modifiers: [
                                        {
                                            name: "offset",
                                            enabled: true,
                                            options: {
                                                offset: [50, 0],
                                            },
                                        },
                                    ],
                                }}
                                ampm={false}
                                onChange={(newValue) => {
                                    setValueDate(newValue);

                                    handleInputs({
                                        target: {
                                            name: "when",
                                            value: newValue,
                                        },
                                    });
                                }}
                            />
                        </LocalizationProvider>

                        <TextField
                            label="Why"
                            variant="outlined"
                            name="why"
                            value={fields.why || ""}
                            classes={classes}
                            onChange={(e) => {
                                handleInputs(e);
                            }}
                        />
                    </div>

                    <div className="map">
                        <Autocomplete
                            freeSolo
                            options={searchData.map(
                                (searchData) => searchData.place_name
                            )}
                            inputValue={searchTerm}
                            classes={classes}
                            onInputChange={(e, value) => {
                                setSearchTerm(value);
                                onInput(searchTerm);
                                setFields({
                                    ...fields,
                                    where: value,
                                    ...pin,
                                });
                            }}
                            value={value || searchTerm}
                            onChange={(event, newValue) => {
                                setValue(newValue);

                                if (
                                    event.target.getAttribute(
                                        "data-option-index"
                                    ) != null
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
                                    label="Search/enter address & pin exact location below on the map"
                                    variant="outlined"
                                />
                            )}
                        />
                        <div className="mapWrapper">
                            <Map
                                center={center}
                                mapboxApiAccessToken={secrets.mapbox}
                                handlePinChange={handlePinChange}
                                deleteLocation={location}
                                receivedPin={receivedPin}
                            />
                        </div>

                        <div className="buttons">
                            {fields.who &&
                            fields.what &&
                            fields.when &&
                            fields.where &&
                            fields.longitude &&
                            fields.latitude &&
                            fields.why ? (
                                <>
                                    <button onClick={(e) => handleMore(e)}>
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button disabled>Save</button>
                            )}

                            {drafts.length > 0 && !draftId ? (
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
                        </div>
                    </div>
                </form>
            </div>
            <div className="rightSide">
                <div className="wrapper">
                    <InfoCard
                        drafts={drafts}
                        showButton={true}
                        handleEdit={handleEdit}
                        standalone={false}
                        inEdit={draftId}
                    />
                </div>
            </div>
        </div>
    );
}
