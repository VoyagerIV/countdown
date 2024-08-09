import React, { useState, useEffect } from "react";
import { TextField, Box, Alert } from "@mui/material";
import TimerItem from "./TimerItem";
import ProgressBar from "./ProgressBar";
import BackgroundImg from "./background.png";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const padNumber = (number: number) => String(number).padStart(2, "0");

const getDateString = (date: Date) =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate()
  )}`;

const getTimeString = (date: Date) =>
  `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(
    date.getSeconds()
  )}`;

export default function BasicDatePicker() {
  const { width, height } = useWindowSize();

  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [intervalID, setIntervalID] = useState(-1);
  const [intervalProgress, setIntervalProgress] = useState(0);

  const [showError, setShowError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let now = new Date();

    setDateString(getDateString(now));
    setTimeString(getTimeString(now));
  }, []);

  useEffect(() => {
    if (dateString === "" || timeString === "") return;
    
    setShowConfetti(false)

    if (intervalID !== -1) {
      clearInterval(intervalID);
      setIntervalProgress(0);
    }

    const intervalDuration =
      Date.parse(`${dateString}T${timeString}`) - Date.now();

    if (intervalDuration < 0) {
      setShowError(true);
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }

    setShowError(false);

    const newInterval = window.setInterval(() => {
      const remainingMilliseconds =
        Date.parse(`${dateString}T${timeString}`) - Date.now();
      let remainingSeconds = Math.floor(remainingMilliseconds / 1000);

      const days = Math.floor(remainingSeconds / 60 / 60 / 24);
      remainingSeconds -= days * 60 * 60 * 24;

      const hours = Math.floor(remainingSeconds / 60 / 60);
      remainingSeconds -= hours * 60 * 60;

      const minutes = Math.floor(remainingSeconds / 60);
      remainingSeconds -= minutes * 60;

      const seconds = Math.floor(remainingSeconds);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      setIntervalProgress(
        ((intervalDuration - remainingMilliseconds) / intervalDuration) * 100
      );

      if (remainingSeconds <= 0) {
        setIntervalProgress(100);
        setShowConfetti(true);
        clearInterval(newInterval);
        return;
      }
    }, 1000);

    setIntervalID(newInterval);
  }, [dateString, timeString]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      style={{
        backgroundImage: `url(${BackgroundImg})`,
        backgroundRepeat: "repeat",
        backgroundSize: "400px",
      }}
    >
      <Box sx={{ marginBottom: "50px" }}>
        {showError && (
          <Alert
            severity="info"
            sx={{ border: "1px solid #039be5", marginBottom: "10px" }}
          >
            Please select a future date.
          </Alert>
        )}
        <Box>
          <TextField
            type="date"
            value={dateString}
            onChange={(e) => {
              setDateString(e.target.value);
            }}
            sx={{ backgroundColor: "white", width: 150, marginRight: "20px" }}
          />
          <TextField
            type="time"
            inputProps={{ step: 1 }}
            value={timeString}
            onChange={(e) => {
              setTimeString(e.target.value);
            }}
            sx={{ backgroundColor: "white", width: 160 }}
          />
        </Box>
      </Box>

      <div>
        <Box sx={{ display: "flex", marginBottom: "40px" }}>
          <TimerItem label={days === 1 ? "day" : "days"} value={days} />
          <TimerItem label={hours === 1 ? "hour" : "hours"} value={hours} />
          <TimerItem
            label={minutes === 1 ? "minute" : "minutes"}
            value={minutes}
          />
          <TimerItem
            label={seconds === 1 ? "second" : "seconds"}
            value={seconds}
          />
        </Box>

        <ProgressBar value={intervalProgress} />
      </div>

      {showConfetti && <Confetti width={width} height={height} />}
    </Box>
  );
}
