import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.js";

import axios from "axios";

const MyCases = () => {
    let myCases = useSelector((state) => state.cases);

    useEffect(async () => {
        try {
            const { data } = await axios.get(`/getmyheadlines/`);
            socket.emit("myCases", data);
        } catch (err) {
            console.log("Err in getting feed", err);
        }
    }, []);

    if (!myCases) {
        return null;
    }

    return <h2>My submitted cases</h2>;
};

export default MyCases;
