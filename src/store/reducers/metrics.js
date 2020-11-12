import * as actions from '../Provider'

const initialState = {
    metrics: {},
    latestValue: {},
};

const consolidated = (state, action) => {
    const data = action.metrics;
    return {
        ...state,
        metrics: data,
    };
};

const metricsData = (state, action) => {
    const {metrics, latestValue} = action;
    return {
        ...state,
        metrics,
        latestValue
    };
};

const handlers = {
    [actions.METRICS_DATA]: metricsData,
    [actions.CONSOLIDATED_DATA]: consolidated,
};

export default (state = initialState, action) => {
    const handler = handlers[action.type];
    if (typeof handler === 'undefined') return state;
    return handler(state, action);
}
