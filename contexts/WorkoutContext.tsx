import React, { createContext, ReactNode, useContext, useState } from 'react'

interface WeightRecord {
  id: string
  weight: number
  date: Date
  notes?: string
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weightHistory: WeightRecord[]
}

interface DayWorkout {
  day: string
  division: string
  exercises: Exercise[]
  isRestDay: boolean
}

interface Workout {
  id: string
  name: string
  days: DayWorkout[]
  createdAt: Date
  username: string
}

interface SavedWorkout {
  id: string
  name: string
  creator: string
  duration: string
  difficulty: string
  likes: number
  image: string
  description: string
  exercises: number
  days: number
  workoutDays: DayWorkout[]
  savedAt: Date
}

interface WorkoutContextType {
  workouts: Workout[]
  savedWorkouts: SavedWorkout[]
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => void
  updateWorkout: (id: string, workoutData: Omit<Workout, 'id' | 'createdAt'>) => void
  deleteWorkout: (id: string) => void
  getWorkout: (id: string) => Workout | undefined
  getSavedWorkout: (id: string) => SavedWorkout | undefined
  addWeightRecord: (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => void
  addWeightRecordToSaved: (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => void
  getExerciseWeightHistory: (workoutId: string, dayIndex: number, exerciseId: string) => WeightRecord[]
  getSavedExerciseWeightHistory: (workoutId: string, dayIndex: number, exerciseId: string) => WeightRecord[]
  saveWorkout: (workoutData: any) => void
  unsaveWorkout: (id: string) => void
  isWorkoutSaved: (id: string) => boolean
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export const useWorkout = () => {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider')
  }
  return context
}

interface WorkoutProviderProps {
  children: ReactNode
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([])

  const addWorkout = (workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setWorkouts(prev => [...prev, newWorkout])
  }

  const updateWorkout = (id: string, workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    setWorkouts(prev => prev.map(workout => {
      if (workout.id === id) {
        return {
          ...workout,
          name: workoutData.name,
          days: workoutData.days
        }
      }
      return workout
    }))
  }

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id))
  }

  const getWorkout = (id: string) => {
    return workouts.find(workout => workout.id === id)
  }

  const getSavedWorkout = (id: string) => {
    return savedWorkouts.find(workout => workout.id === id)
  }

  const saveWorkout = (workoutData: any) => {
    // Converter os dados do treino para o formato SavedWorkout com exercícios estruturados
    const convertedWorkoutDays: DayWorkout[] = workoutData.workoutDays.map((day: any) => ({
      day: day.day,
      division: day.division,
      isRestDay: day.isRestDay,
      exercises: day.exercises.map((exercise: any) => ({
        id: `${workoutData.id}_${day.day}_${exercise.name}`.replace(/\s+/g, '_'),
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weightHistory: []
      }))
    }));

    const newSavedWorkout: SavedWorkout = {
      ...workoutData,
      id: workoutData.id.toString(),
      workoutDays: convertedWorkoutDays,
      savedAt: new Date()
    }
    setSavedWorkouts(prev => [...prev, newSavedWorkout])
  }

  const unsaveWorkout = (id: string) => {
    setSavedWorkouts(prev => prev.filter(workout => workout.id !== id))
  }

  const isWorkoutSaved = (id: string) => {
    return savedWorkouts.some(workout => workout.id === id)
  }

  const addWeightRecord = (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => {
    setWorkouts(prev => prev.map(workout => {
      if (workout.id === workoutId) {
        const updatedDays = [...workout.days]
        const day = updatedDays[dayIndex]
        if (day) {
          const updatedExercises = day.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              const newRecord: WeightRecord = {
                id: Date.now().toString(),
                weight,
                date: new Date(),
                notes
              }
              const currentWeightHistory = exercise.weightHistory || []
              return {
                ...exercise,
                weightHistory: [...currentWeightHistory, newRecord]
              }
            }
            return exercise
          })
          updatedDays[dayIndex] = { ...day, exercises: updatedExercises }
        }
        return { ...workout, days: updatedDays }
      }
      return workout
    }))
  }

  const addWeightRecordToSaved = (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => {
    setSavedWorkouts(prev => prev.map(workout => {
      if (workout.id === workoutId) {
        const updatedDays = [...workout.workoutDays]
        const day = updatedDays[dayIndex]
        if (day) {
          const updatedExercises = day.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              const newRecord: WeightRecord = {
                id: Date.now().toString(),
                weight,
                date: new Date(),
                notes
              }
              const currentWeightHistory = exercise.weightHistory || []
              return {
                ...exercise,
                weightHistory: [...currentWeightHistory, newRecord]
              }
            }
            return exercise
          })
          updatedDays[dayIndex] = { ...day, exercises: updatedExercises }
        }
        return { ...workout, workoutDays: updatedDays }
      }
      return workout
    }))
  }

  const getExerciseWeightHistory = (workoutId: string, dayIndex: number, exerciseId: string): WeightRecord[] => {
    const workout = getWorkout(workoutId)
    if (!workout || !workout.days[dayIndex]) return []
    
    const exercise = workout.days[dayIndex].exercises.find(ex => ex.id === exerciseId)
    return exercise?.weightHistory || []
  }

  const getSavedExerciseWeightHistory = (workoutId: string, dayIndex: number, exerciseId: string): WeightRecord[] => {
    const workout = getSavedWorkout(workoutId)
    if (!workout || !workout.workoutDays[dayIndex]) return []
    
    const exercise = workout.workoutDays[dayIndex].exercises.find(ex => ex.id === exerciseId)
    return exercise?.weightHistory || []
  }

  const value: WorkoutContextType = {
    workouts,
    savedWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkout,
    getSavedWorkout,
    addWeightRecord,
    addWeightRecordToSaved,
    getExerciseWeightHistory,
    getSavedExerciseWeightHistory,
    saveWorkout,
    unsaveWorkout,
    isWorkoutSaved
  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
} 