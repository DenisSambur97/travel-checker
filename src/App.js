import React, {useEffect, useState} from "react";
import {CssBaseline, Grid} from "@material-ui/core";

import Header from "./componets/Header/Header";
import List from "./componets/List/List";
import Map from "./componets/Map/Map";

import {getPlacesData} from "./api";

const App = () => {
    const [places, setPlaces] = useState([])

    const [coordinates, setCoordinates] = useState({})
    const [bounds, setBounds] = useState({})
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [type, setType] = useState('restaurants')
    const [rating, setRating] = useState('')
    const [filteredPlaces, setFilteredPlaces] = useState([])

    // Получаем текущее местоположение
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({coords:{latitude, longitude}}) => {
            setCoordinates({lat: latitude, lng: longitude})
        })
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating)
        setFilteredPlaces(filteredPlaces)
    }, [rating])

    // Получаем данные про местные заведения
    useEffect(() => {
        setIsLoading(true)

        getPlacesData(type, bounds.sw, bounds.ne)
            .then((data) => {
                setPlaces(data.filter((place) => place.name && place.num_reviews > 0))
                setFilteredPlaces([])
                setIsLoading(false)
            })
    }, [type, coordinates, bounds])

    return (
        <>
            <CssBaseline/>
            <Header setCoordinates={setCoordinates}/>
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs={12} md={4}>
                    <List
                        places={filteredPlaces?.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        bounds={bounds}
                        places={filteredPlaces?.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default App