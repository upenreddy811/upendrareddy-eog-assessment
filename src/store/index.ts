import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux-starter-kit';
import sagas from './state';
import metricsReducer from './reducers/metrics';

export default () => {
  const rootReducer = combineReducers({
    metrics: metricsReducer,
  })

  const composeEnhancers = composeWithDevTools({})
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = applyMiddleware(sagaMiddleware)
  const store = createStore(rootReducer, composeEnhancers(middlewares))

  sagas.forEach(sagaMiddleware.run);

  return store;
}
