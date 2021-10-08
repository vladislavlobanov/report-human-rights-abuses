## Description

Report Human Rights Abuses SPA aka "Unheard Voices" is a platform for people to report human rights abuses to relevant organizations via email with a secret link. Users can also make their story public and appear in the feed. Search functionality for cases is available only for public cases. This project is a combination of a questionnaire and public/private database.

Main technologies used: React/Redux, Node.js/Express, PostgreSQL, Socket.IO, Mapbox API, AWS, Materil UI

## Install

1. NPM INSTALL
2. Postgres tables structure is in setupt.sql
3. Add secrets.json to /server with the following structure (replace XXX):

    {
    // Add a long PWD for cookies
    "cookiePwd": "XXX",
    //Add MapBox token. More info: https://docs.mapbox.com
    "mapbox": "XXX",
    //Add AWS Key and AWS Secret
    "AWS_KEY": "XXX",
    "AWS_SECRET": "XXX",
    //Add an email (preferablly @gmail) to test AWS SES
    "email": "XXX"
    }
