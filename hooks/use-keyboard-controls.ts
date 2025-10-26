"use client"

import { useEffect, useState } from "react"

export function useKeyboardControls() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    shift: false,
    f: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === " " ||
        e.key === "Shift" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright"
      ) {
        e.preventDefault()
      }

      if (e.key === "Shift") {
        setKeys((k) => ({ ...k, shift: true }))
        return
      }

      switch (key) {
        case "w":
        case "arrowup":
          setKeys((k) => ({ ...k, forward: true }))
          break
        case "s":
        case "arrowdown":
          setKeys((k) => ({ ...k, backward: true }))
          break
        case "a":
        case "arrowleft":
          setKeys((k) => ({ ...k, left: true }))
          break
        case "d":
        case "arrowright":
          setKeys((k) => ({ ...k, right: true }))
          break
        case " ":
          setKeys((k) => ({ ...k, space: true }))
          break
        case "f":
          setKeys((k) => ({ ...k, f: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === " " ||
        key === "f" ||
        e.key === "Shift" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright"
      ) {
        e.preventDefault()
      }

      if (e.key === "Shift") {
        setKeys((k) => ({ ...k, shift: false }))
        return
      }

      switch (key) {
        case "w":
        case "arrowup":
          setKeys((k) => ({ ...k, forward: false }))
          break
        case "s":
        case "arrowdown":
          setKeys((k) => ({ ...k, backward: false }))
          break
        case "a":
        case "arrowleft":
          setKeys((k) => ({ ...k, left: false }))
          break
        case "d":
        case "arrowright":
          setKeys((k) => ({ ...k, right: false }))
          break
        case " ":
          setKeys((k) => ({ ...k, space: false }))
          break
        case "f":
          setKeys((k) => ({ ...k, f: false }))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return keys
}
