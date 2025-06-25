import { PublicWorkout, workoutHelpers, WorkoutWithDetails } from '@/utils/supabase-helpers'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

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
  description?: string
  emoji: string
  days: DayWorkout[]
  createdAt: Date
  username: string
  likes_count: number
}

interface SavedWorkout {
  id: string
  name: string
  description: string
  emoji: string
  createdAt: Date
  username: string
  likes_count: number
  days: DayWorkout[]
  is_liked: boolean
}

interface WorkoutContextType {
  workouts: Workout[]
  savedWorkouts: SavedWorkout[]
  publicWorkouts: SavedWorkout[]
  loading: boolean
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => Promise<void>
  updateWorkout: (id: string, workoutData: Omit<Workout, 'id' | 'createdAt'>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  getWorkout: (id: string) => Workout | undefined
  getSavedWorkout: (id: string) => SavedWorkout | undefined
  addWeightRecord: (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => Promise<void>
  addWeightRecordToSaved: (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => Promise<void>
  getExerciseWeightHistory: (workoutId: string, dayIndex: number, exerciseId: string) => WeightRecord[]
  getSavedExerciseWeightHistory: (workoutId: string, dayIndex: number, exerciseId: string) => WeightRecord[]
  saveWorkout: (workoutData: any) => Promise<void>
  unsaveWorkout: (id: string) => Promise<void>
  isWorkoutSaved: (id: string) => boolean
  likeWorkout: (id: string) => Promise<void>
  unlikeWorkout: (id: string) => Promise<void>
  isWorkoutLiked: (id: string) => boolean
  refreshWorkouts: () => Promise<void>
  refreshPublicWorkouts: () => Promise<void>
  refreshSavedWorkouts: () => Promise<void>
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
  const [publicWorkouts, setPublicWorkouts] = useState<SavedWorkout[]>([])
  const [loading, setLoading] = useState(true)

  // Converter WorkoutWithDetails para Workout (formato local)
  const convertWorkoutWithDetails = (workoutWithDetails: WorkoutWithDetails): Workout => {
    return {
      id: workoutWithDetails.id,
      name: workoutWithDetails.name,
      description: workoutWithDetails.description || undefined,
      emoji: workoutWithDetails.emoji,
      createdAt: new Date(workoutWithDetails.created_at),
      username: workoutWithDetails.profile?.username || 'Usuário',
      likes_count: workoutWithDetails.likes_count,
      days: workoutWithDetails.workout_days.map(day => ({
        day: day.day,
        division: day.division,
        isRestDay: day.is_rest_day,
        order_index: day.order_index,
        exercises: day.exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weightHistory: exercise.weight_records.map(record => ({
            id: record.id,
            weight: record.weight,
            date: new Date(record.created_at),
            notes: record.notes || undefined
          }))
        }))
      }))
    }
  }

  // Converter PublicWorkout para SavedWorkout (formato local)
  const convertPublicWorkout = (publicWorkout: PublicWorkout): SavedWorkout => {
    return {
      id: publicWorkout.id,
      name: publicWorkout.name,
      description: publicWorkout.description || '',
      emoji: publicWorkout.emoji,
      createdAt: new Date(publicWorkout.created_at),
      username: publicWorkout.profile.username || 'Usuário',
      likes_count: publicWorkout.likes_count,
      is_liked: publicWorkout.is_liked || false,
      days: publicWorkout?.workout_days?.map(day => ({
        day: day.day,
        division: day.division,
        isRestDay: day.is_rest_day,
        order_index: day.order_index,
        exercises: day?.exercises?.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weightHistory: exercise?.weight_records?.map(record => ({
            id: record.id,
            weight: record.weight,
            date: new Date(record.created_at),
            notes: record.notes || undefined
          }))
        }))
      }))
    }
  }

  // Carregar treinos do usuário
  const loadUserWorkouts = async () => {
    try {
      setLoading(true)
      const workoutDetails = await workoutHelpers.getUserWorkouts()
      console.log('workoutDetails', workoutDetails)
      const convertedWorkouts = workoutDetails.map(convertWorkoutWithDetails)
      setWorkouts(convertedWorkouts)
    } catch (error) {
      console.error('Erro ao carregar treinos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar treinos públicos
  const loadPublicWorkouts = async () => {
    try {
      const publicWorkoutsData = await workoutHelpers.getPublicWorkouts()
      const convertedWorkouts = publicWorkoutsData.map(convertPublicWorkout)
      setPublicWorkouts(convertedWorkouts)
    } catch (error) {
      console.error('Erro ao carregar treinos públicos:', error)
    }
  }

  // Carregar treinos salvos
  const loadSavedWorkouts = async () => {
    try {
      const savedWorkoutsData = await workoutHelpers.getSavedWorkouts()
      console.log('savedWorkoutsData', savedWorkoutsData)
      const convertedSavedWorkouts = savedWorkoutsData.map(convertPublicWorkout)
      setSavedWorkouts(convertedSavedWorkouts)
    } catch (error) {
      console.error('Erro ao carregar treinos salvos:', error)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadUserWorkouts()
    loadPublicWorkouts()
    loadSavedWorkouts()
  }, [])

  const addWorkout = async (workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    try {
      const workoutId = await workoutHelpers.createWorkout({
        name: workoutData.name,
        description: workoutData.description,
        emoji: workoutData.emoji,
        is_public: true,
        days: workoutData.days.map(day => ({
          day: day.day,
          division: day.division,
          is_rest_day: day.isRestDay,
          exercises: day.exercises.map(exercise => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps
          }))
        }))
      })

      if (workoutId) {
        // Buscar o treino criado com detalhes completos
        const workoutWithDetails = await workoutHelpers.getWorkoutWithDetails(workoutId)
        if (workoutWithDetails) {
          const convertedWorkout = convertWorkoutWithDetails(workoutWithDetails)
          setWorkouts(prev => [...prev, convertedWorkout])
        }
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error)
    }
  }

  const updateWorkout = async (id: string, workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    try {
      await workoutHelpers.updateWorkout(id, {
        name: workoutData.name,
        description: workoutData.description,
        emoji: workoutData.emoji
      })

      // Recarregar treinos para obter dados atualizados
      await loadUserWorkouts()
    } catch (error) {
      console.error('Erro ao atualizar treino:', error)
    }
  }

  const deleteWorkout = async (id: string) => {
    try {
      const success = await workoutHelpers.deleteWorkout(id)
      if (success) {
        setWorkouts(prev => prev.filter(workout => workout.id !== id))
      }
    } catch (error) {
      console.error('Erro ao deletar treino:', error)
    }
  }

  const getWorkout = (id: string) => {
    return workouts.find(workout => workout.id === id)
  }

  const getSavedWorkout = (id: string) => {
    return savedWorkouts.find(workout => workout.id === id)
  }

  const addWeightRecord = async (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => {
    try {
      await workoutHelpers.addWeightRecord(exerciseId, weight, notes)
      // Recarregar treinos para obter dados atualizados
      await loadUserWorkouts()
    } catch (error) {
      console.error('Erro ao adicionar registro de peso:', error)
    }
  }

  const addWeightRecordToSaved = async (workoutId: string, dayIndex: number, exerciseId: string, weight: number, notes?: string) => {
    try {
      await workoutHelpers.addWeightRecord(exerciseId, weight, notes)
      // Recarregar treinos salvos para obter dados atualizados
      await loadSavedWorkouts()
    } catch (error) {
      console.error('Erro ao adicionar registro de peso:', error)
    }
  }

  const getExerciseWeightHistory = (workoutId: string, dayIndex: number, exerciseId: string): WeightRecord[] => {
    const workout = getWorkout(workoutId)
    if (!workout || !workout.days[dayIndex]) return []
    
    const exercise = workout.days[dayIndex].exercises.find(ex => ex.id === exerciseId)
    return exercise?.weightHistory || []
  }

  const getSavedExerciseWeightHistory = (workoutId: string, dayIndex: number, exerciseId: string): WeightRecord[] => {
    const workout = getSavedWorkout(workoutId)
    if (!workout || !workout.days[dayIndex]) return []
    
    const exercise = workout.days[dayIndex].exercises.find(ex => ex.id === exerciseId)
    return exercise?.weightHistory || []
  }

  const saveWorkout = async (workoutData: any) => {
    try {
      await workoutHelpers.saveWorkout(workoutData.id)
      await loadSavedWorkouts()
    } catch (error) {
      console.error('Erro ao salvar treino:', error)
    }
  }

  const unsaveWorkout = async (id: string) => {
    try {
      await workoutHelpers.unsaveWorkout(id)
      setSavedWorkouts(prev => prev.filter(workout => workout.id !== id))
    } catch (error) {
      console.error('Erro ao remover treino salvo:', error)
    }
  }

  const isWorkoutSaved = (id: string) => {
    return savedWorkouts.some(workout => workout.id === id)
  }

  const likeWorkout = async (id: string) => {
    try {
      await workoutHelpers.likeWorkout(id)
      await loadPublicWorkouts()
    } catch (error) {
      console.error('Erro ao dar like no treino:', error)
    }
  }

  const unlikeWorkout = async (id: string) => {
    try {
      await workoutHelpers.unlikeWorkout(id)
      await loadPublicWorkouts()
    } catch (error) {
      console.error('Erro ao remover like do treino:', error)
    }
  }

  const isWorkoutLiked = (id: string) => {
    const publicWorkout = publicWorkouts.find(workout => workout.id === id)
    return publicWorkout?.is_liked || false
  }

  const refreshWorkouts = async () => {
    await loadUserWorkouts()
  }

  const refreshPublicWorkouts = async () => {
    await loadPublicWorkouts()
  }

  const refreshSavedWorkouts = async () => {
    await loadSavedWorkouts()
  }

  const value: WorkoutContextType = {
    workouts,
    savedWorkouts,
    publicWorkouts,
    loading,
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
    isWorkoutSaved,
    likeWorkout,
    unlikeWorkout,
    isWorkoutLiked,
    refreshWorkouts,
    refreshPublicWorkouts,
    refreshSavedWorkouts
  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
} 