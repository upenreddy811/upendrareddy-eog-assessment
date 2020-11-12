import React from 'react';
import Card from '../Metrics/CardMetrics';
import {connect} from 'react-redux';

const Cards = ({metricValues, latestValue}) => {
    return <>
    {metricValues.map((metric, key) => (
        <Card key={key}
            currentValue={latestValue[metric]}
            title={metric}
        />
    ))}
    </>
}

const mapState = state => ({
    latestValue: state.metrics.latestValue,
})

export default connect(
    mapState,
    () => ({})
)(Cards)
