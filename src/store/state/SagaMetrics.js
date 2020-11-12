import { takeEvery, take, call, put, fork, select } from 'redux-saga/effects'
import * as actions from '../Provider'
import api from '../fetcher';
import { eventChannel } from 'redux-saga';


const getData = state => state.metrics.metrics;

function* aggregateSaga(list) {
    let data = yield select(getData);
    list.map(item => {
        const { metric, at, value } = item;
        const hours = new Date(at).getHours() % 12 || 12;
        const minutes = new Date(at).getMinutes();
        const timeAt = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;
        data = {
            ...data,
            [at]: {
                ...data[at],
                [metric]: value,
                at: timeAt,
            },
        }
        return null;
    })
    yield put({ type: actions.CONSOLIDATED_DATA, metrics: data })
}

function* dataProcessor(newData) {
    const { metric, at, value } = newData;
    let data = yield select(getData);
    const prevState = yield select(state => state.metrics.latestValue)
    const hours = new Date(at).getHours() % 12 || 12;
    const minutes = new Date(at).getMinutes()
    const timeAt = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`
    data = {
        ...data,
        [at]: {
            ...data[at],
            [metric]: value,
            at: timeAt,
        },
    };
    const latestValue = {
        ...prevState,
        [metric]: value
    }
    yield put({ type: actions.METRICS_DATA, metrics: data, latestValue })
}

const stream = sub => eventChannel((emit) => {
    const handler = (data) => {
        emit(data);
    };
    sub.subscribe(handler);
    return () => {
        sub.unsubscribe()
    };
});

function* liveFeed(action) {
    const sub = yield call(api.subscribeLive);
    const subscription = yield call(stream, sub);
    while(true) {
        const {data} = yield take(subscription);
        console.log(data)
        yield fork(dataProcessor, data.newMeasurement)
    }
}

function* fetch30MinutesData(action) {
    const { data } = yield call(api.getLatest, action.metricName);
    const newData = data.getMeasurements;
    yield fork(aggregateSaga, newData);
}

function* watchFetch() {
    yield takeEvery(actions.FETCH_RECENT, fetch30MinutesData);
}

function* watchStartliveFeed() {
    yield takeEvery(actions.START_POLLING, liveFeed)
}

export default [watchFetch, watchStartliveFeed];





