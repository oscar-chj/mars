"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useMockStore } from "@/store/useMockStore"

export type Phase = 1 | 2 | 3
export type Iteration = 1 | 2 | 3

export interface PhaseContextType {
  activePhase: Phase
  activeIteration: Iteration
  isReady: boolean
  setPhase: (phase: Phase) => void
  setIteration: (iteration: Iteration) => void
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined)

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [activeIteration, setActiveIterationState] = useState<Iteration>(1)
  const [activePhase, setActivePhaseState] = useState<Phase>(3)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (activePhase === 2) {
      useMockStore.getState().resetStore()
    }
  }, [activePhase])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIteration = localStorage.getItem("mars_iteration")
      const savedPhase = localStorage.getItem("mars_phase")

      let loadedIteration: Iteration = 1
      let loadedPhase: Phase = 3

      if (savedIteration === "1" || savedIteration === "2" || savedIteration === "3") {
        loadedIteration = Number(savedIteration) as Iteration
      }
      if (savedPhase === "1" || savedPhase === "2" || savedPhase === "3") {
        loadedPhase = Number(savedPhase) as Phase
      }

      if (loadedPhase === 2) {
        useMockStore.getState().resetStore()
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIterationState(loadedIteration)
      setActivePhaseState(loadedPhase)
      useMockStore.getState().setIteration(loadedIteration)
      setIsReady(true)
    }
  }, [])

  const setPhase = (phase: Phase) => {
    setActivePhaseState(phase)
    if (typeof window !== "undefined") {
      localStorage.setItem("mars_phase", String(phase))
    }
  }

  const setIteration = (iteration: Iteration) => {
    setActiveIterationState(iteration)
    if (typeof window !== "undefined") {
      localStorage.setItem("mars_iteration", String(iteration))
    }
    useMockStore.getState().setIteration(iteration)
    if (iteration === 2 || iteration === 3) {
      setPhase(1)
    }
  }

  return (
    <PhaseContext.Provider
      value={{
        activePhase,
        activeIteration,
        isReady,
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
