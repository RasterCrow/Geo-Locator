import React, { useEffect, useState } from "react";

export default function MapRoundRecap(props) {
    const [googleMap, setGoogleMap] = useState(null)
    const [markers, setMarkers] = useState(null)

    useEffect(() => {
        //console.log(props.data)
        //create map
        var mapOptions = {
            center: new window.google.maps.LatLng(parseFloat(props.data.lat), parseFloat(props.data.lon), true),
            zoom: 5,
            mapTypeControl: false,
            streetViewControl: false,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        };
        var mMap = new window.google.maps.Map(
            document.getElementById("resultsMap"),
            mapOptions
        );
        setGoogleMap(mMap);

        //set true result
        let correctMarker = new window.google.maps.Marker({
            position: new window.google.maps.LatLng(parseFloat(props.data.lat), parseFloat(props.data.lon), mMap),
            mMap,

            title: "Correct Location",
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }
        });
        correctMarker.setMap(mMap);
        let allMarkers = []
        //retrieve results from json
        let results = []

        for (var x in props.data.results) {

            let data = {
                lat: props.data.results[x].lat,
                lon: props.data.results[x].lon,
                username: props.data.results[x].username,
            }
            results.push(data);
        }
        results.forEach(element => {

            let marker = new window.google.maps.Marker({
                position: { lat: parseFloat(element.lat), lng: parseFloat(element.lon) },
                mMap,
                label: { color: 'black', fontWeight: 'bold', fontSize: '14px', text: element.username },
                title: element.username + " guessed here.",
            });
            marker.setMap(mMap)
            allMarkers.push(marker)
        });
        //set all current markers, so leter i can remove them
        setMarkers(allMarkers)

    }, [props.roundToView]);

    //when props change it means there's a new result, so reset all markers and set them again
    useEffect(() => {

        if (googleMap != null) {
            //clear current markers
            let allMarkers = []
            allMarkers.forEach(element => {
                element.setMap(null)
            });
            //add new markers

            let results = []
            for (var x in props.data.results) {

                let data = {
                    lat: props.data.results[x].lat,
                    lon: props.data.results[x].lon,
                    username: props.data.results[x].username,
                }
                results.push(data);
            }
            results.forEach(element => {

                if (element.lat != undefined) {
                    let marker = new window.google.maps.Marker({
                        position: { lat: parseFloat(element.lat), lng: parseFloat(element.lon) },
                        googleMap,
                        label: { color: 'black', fontWeight: 'bold', fontSize: '14px', text: element.username },
                        title: element.username + " guessed here.",
                    });
                    marker.setMap(googleMap)
                    allMarkers.push(marker)
                } else {
                    //console.log("player not yet finished")
                }
            });
            setMarkers(allMarkers)
        } else {
            //console.log("map is null")
        }
    }, [props.data.results]);

    return (


        <div style={{ width: "100%", height: "100%" }} id="resultsMap" />

    );
}
