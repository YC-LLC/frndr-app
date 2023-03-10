/**
 * ************************************
 *
 * @module  WelcomPage.jsx
 * @author
 * @date
 * @description
 *
 * ************************************
 */

/*
|-- App
  |-- WelcomePage
      |-- Tile -> display the current user's tile
      |-- MapBox -> display a map on which we can put pins
          |-- MapPinx -> display the pins from other users with their status emojis
      |—- Footer
*/

import React, { Component, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import Tile from "./Tile";
import MapPin from './MapPin';
import Footer from "./Footer";
import getFromServer from "../utilities";
import { setUserMap, setHangoutMap, updateConnectionList, setThePage } from "../slices";
import BUTTON_TEXT from "../constants";

const WelcomePage = (props) => {
  const userMap = useSelector((state) => state.frndr.userMap);
  const hangoutMap = useSelector((state) => state.frndr.hangoutMap);
  const connectionList = useSelector((state) => state.frndr.connectionList);
  const dispatch = useDispatch();
  useEffect(() => {
    // on change of props
    // get feed to set hangoutMap
    console.log("updating... in useEffect");
    getFromServer(dispatch, setUserMap, `/api/users`); //get all user info
    getFromServer(dispatch, setHangoutMap, `/api/hangouts`); // get all hang outs
  }, [props]);
  
  const emojiIcon = "👨‍🍳"; // replace with state of emoji.
  // const emojiLabel = "chef"; // replace with state GROWTH

  // create and store all the map pins
  const pins = [];

  const handleClick = () => {
    dispatch(setThePage('feed'));
  };

  for (const _id in hangoutMap) {
    const hangout = hangoutMap[_id];
    const user = userMap[hangout.user_id];
    if (!user) continue;
    pins.push(
      <MapPin
        userID={user._id}
        hangID={_id}
        key={_id}
        phonenumber={user.phonenumber}
        email={user.email}
        profilepic={user.picture}
        location={hangout.location}
        statusname={hangout.statusname}
        emoji={hangout.picture}
        username={hangout.username}
        buttonText={
          //random text
          BUTTON_TEXT[Math.round(Math.random() * (BUTTON_TEXT.length - 1))]
        }
        // onClick={ handleClick('feed') }
        
        buttonAction={() =>
          handleClick()
        }
      />
    );
  }

  return (
    <>
      <Tile
        username="evan"
        className="headerBox"
        profilepic={require("../images/evan.png")}
        statusname="Looking to fight God in a Wendy's parking lot"
        emoji={emojiIcon}
        buttonAction={() => false}
        buttonText="Make a Hang?"
        btnDisabled={true}
      />
      <div className="map-box">
        <img
          className="map-image"
          src={require("../images/map-milford.png")}
          alt="image host"
        />
        <div className="pins">{pins}</div>
      </div>
      <Footer />

    </>
  );
};

export default WelcomePage;
