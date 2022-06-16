import React, { useState, useEffect } from "react"

export const Slider = ({ onChange, percentage }) => {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    setPosition(percentage)
  }, [percentage])

  return (
    <div className="slider-container grid-400">
      <div
        className="progress-bar-cover"
        style={{
          width: `${position}%`,
        }}
      ></div>
      <input
        type="range"
        className="range"
        onChange={(e) => {
          onChange(e.target.value)
        }}
        value={percentage}
      />
    </div>
  )
}
