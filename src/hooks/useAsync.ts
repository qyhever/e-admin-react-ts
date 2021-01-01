import { useEffect, useReducer, useRef, useCallback } from 'react'
import { omit } from 'lodash'
// import { usePersistFn } from 'ahooks'
import useKeepFn from './useKeepFn'

type Service<R = any, P extends any[] = any[]> = (...args: P) => Promise<R>

type StateType = {
  result: any
  loading: boolean
  error: Error | null
}

type ActionType = {
  type: 'FETCH_INIT' | 'FETCH_SUCCESS' | 'FETCH_FAILURE' | 'MUTATE'
  payload?: any
}

function dataFetchReducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        result: action.payload
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case 'MUTATE':
      return {
        ...state,
        result: action.payload
      }
    default:
      throw new Error()
  }
}

type OptionsType = {
  manual?: boolean
  initialData?: any
  onSuccess?: () => void
  onError?: (e: unknown) => void
  [propName: string]: any
}

export default function <T = any>(fn: Service<T>, options: OptionsType = {}) {
  const {
    onSuccess = () => {}, // eslint-disable-line
    onError = console.log
  } = options
  const [state, dispatch] = useReducer(dataFetchReducer, {
    result: options.initialData || null,
    loading: false,
    error: null
  })
  const mounted = useRef(false)
  const service = useKeepFn(fn)
  const onSuccessPersist = useKeepFn(onSuccess)
  const onErrorPersist = useKeepFn(onError)
  // const service = usePersistFn(fn)
  // console.log('service', service)

  const run = useCallback(async (...args: any[]) => {
    dispatch({ type: 'FETCH_INIT' })
    try {
      const res = await service.apply(null, args)
      !mounted.current && dispatch({ type: 'FETCH_SUCCESS', payload: res })
      onSuccessPersist && onSuccessPersist()
    } catch (e) {
      !mounted.current && dispatch({ type: 'FETCH_FAILURE', payload: e })
      onErrorPersist && onErrorPersist(e)
    }
  }, [service, onSuccessPersist, onErrorPersist])

  useEffect(() => {
    return () => {
      mounted.current = true
    }
  }, [])

  useEffect(() => {
    !options.manual && run()
  }, [run]) // eslint-disable-line

  const mutate = useCallback((data) => {
    dispatch({ type: 'MUTATE', payload: data })
  }, [])
  return {
    ...omit(state, ['result']),
    data: state.result as T,
    run,
    mutate
  }
}
