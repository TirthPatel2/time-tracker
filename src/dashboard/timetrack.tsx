"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./timetrack.module.css";
import Button from "@mui/material/Button";
import { TimeDifferenceType } from "./timetrack.types";

const zeroTimeDifference: TimeDifferenceType = {
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const Timetrack = () => {
  const [startTime, setStartTime] = useState<Date>(new Date(0));
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [breakStartTime, setBreakStartTime] = useState<Date>(new Date(0));
  const [storedWorkTime, setStoredWorkTime] = useState<Date>(new Date(0));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const timeDiff = useMemo(() => {
    if (startTime.getTime()) {
      const trackingTime =
        currentTime.getTime() - startTime.getTime() + storedWorkTime.getTime();

      return {
        hours: Math.floor(trackingTime / (1000 * 60 * 60)),
        minutes: Math.floor((trackingTime % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((trackingTime % (1000 * 60)) / 1000),
      };
    } else {
      const trackingTime = storedWorkTime.getTime();
      return {
        hours: Math.floor(trackingTime / (1000 * 60 * 60)),
        minutes: Math.floor((trackingTime % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((trackingTime % (1000 * 60)) / 1000),
      };
    }
  }, [startTime, currentTime, storedWorkTime]);

  const breakTimeDiff = useMemo(() => {
    if (breakStartTime.getTime()) {
      const breakTrackingTime =
        currentTime.getTime() - breakStartTime.getTime();
      return {
        hours: Math.floor(breakTrackingTime / (1000 * 60 * 60)),
        minutes: Math.floor(
          (breakTrackingTime % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor((breakTrackingTime % (1000 * 60)) / 1000),
      };
    } else {
      return zeroTimeDifference;
    }
  }, [breakStartTime, currentTime]);

  const formatTime = (value: number) => {
    //value should be positive
    if (value < 0) return `00`;

    // Ensure two-digit formatting
    return value < 10 ? `0${value}` : value.toString();
  };

  const clockInClick = () => {
    setStartTime(new Date());

    setBreakStartTime(new Date(0));
  };

  const breakClick = () => {
    setStoredWorkTime(
      (prev) =>
        new Date(currentTime.getTime() - startTime.getTime() + prev.getTime())
    );

    setBreakStartTime(new Date());

    setStartTime(new Date(0));
  };

  const clockOutClick = () => {
    if (startTime.getTime() !== 0)
      setStoredWorkTime(
        (prev) =>
          new Date(currentTime.getTime() - startTime.getTime() + prev.getTime())
      );

    setStartTime(new Date(0));

    setBreakStartTime(new Date(0));
  };

  return (
    <div className={styles.time_container}>
      <h1>Timetrack</h1>
      <div className={styles.timer}>
        <div className={styles.time_tracked}>
          <p>Working Time</p>
          {formatTime(timeDiff.hours)}:{formatTime(timeDiff.minutes)}:
          {formatTime(timeDiff.seconds)}
        </div>
        <div className={styles.break_tracked}>
          <p>Break Time</p>
          {formatTime(breakTimeDiff.hours)}:{formatTime(breakTimeDiff.minutes)}:
          {formatTime(breakTimeDiff.seconds)}
        </div>
      </div>
      <div className={styles.time_btn_container}>
        <Button
          variant="contained"
          className={styles.time_btn_clockin}
          onClick={clockInClick}
          disabled={startTime.getTime() ? true : false}
        >
          Clock In
        </Button>
        <Button
          variant="contained"
          className={styles.time_btn_break}
          onClick={breakClick}
          disabled={!startTime.getTime() ? true : false}
        >
          Break
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={clockOutClick}
          className={styles.time_btn_clockout}
        >
          Clock Out
        </Button>
      </div>
    </div>
  );
};

export default Timetrack;
