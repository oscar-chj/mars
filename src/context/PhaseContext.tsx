"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useMockStore } from "@/store/useMockStore"

export type Phase = 1 | 2 | 3
export type Iteration = 1

export interface PhaseContextType {
  activePhase: Phase
  activeIteration: Iteration
  setPhase: (phase: Phase) => void
  setIteration: (iteration: Iteration) => void
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined)

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhaseState] = useState<Phase>(3)
  const activeIteration: Iteration = 1

  useEffect(() => {
    if (activePhase === 2) {
      useMockStore.getState().resetStore()
    }
  }, [activePhase])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPhase = localStorage.getItem("mars_phase")
      if (savedPhase === "1" || savedPhase === "2" || savedPhase === "3") {
        setActivePhaseState(Number(savedPhase) as Phase)
      }
    }
  }, [])

  const setPhase = (phase: Phase) => {
    setActivePhaseState(phase)
    if (typeof window !== "undefined") {
      localStorage.setItem("mars_phase", String(phase))
    }
  }

  const setIteration = (iteration: Iteration) => {
    // No-op for Iteration 1 lock
  }

  return (
    <PhaseContext.Provider
      value={{
        activePhase,
        activeIteration,
        setPhase,
        setIteration,
      }}
    >
      {children}
    </PhaseContext.Provider>
  )
}

export function usePhase() {
  const context = useContext(PhaseContext)
  if (context === undefined) {
    throw new Error("usePhase must be used within a PhaseProvider")
  }
  return context
}
