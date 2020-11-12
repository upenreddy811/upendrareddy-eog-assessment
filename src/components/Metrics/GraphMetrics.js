import React from 'react';
import * as actions from '../../store/Provider';
import { Grid, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import SelectMetrics from '../Metrics/SelectMetrics.js';
import Chart from '../Charts/Charts';
import Cards from '../Charts/Cards';


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        background: 'white',
    },
    chartContainer: {
        width: '100vw',
        height: '100vh',
    },
}));

const GraphMetrics = ({ fetchLiveData, historicData, latest, metrics, ...props }) => {
    const classes = useStyles(props);
    const [axes, setVisible] = React.useState({
        pressure: false,
        temp: false,
        percentage: false,
    });
    const [metricValues, setSelectedMetrics] = React.useState([]);
    React.useEffect(() => {
        fetchLiveData();
    }, [fetchLiveData]);
    const YAxis = metric => {
        if (metric.toLowerCase().endsWith('pressure')) {
            return 1;
        } else if (metric.toLowerCase().endsWith('temp')) {
            return 2;
        } else {
            return 0;
        }
    };
    const selection = selected => {
        const metricSelected = selected();
        if (metricValues.length < metricSelected.length) {
            historicData(metricSelected[metricSelected.length - 1]);
        }
        setVisible({
            pressure: metricSelected.some(m => YAxis(m) === 1),
            temp: metricSelected.some(m => YAxis(m) === 2),
            percentage: metricSelected.some(m => YAxis(m) === 0),
        });
        setSelectedMetrics(selected);
    };
    return (
        <main className={classes.root}>
            <Grid container>
                <Grid container item xs={12} spacing={4}>
                    <Grid item container spacing={2} className={classes.valueGrid}>
                        <Grid item lg={7} md={6} xs={12}>
                            <Grid container spacing={2}>
                                <Cards metricValues={metricValues} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5}>
                            <SelectMetrics setSelected={selection} metricValues={metricValues} />
                        </Grid>
                    </Grid>

                    <Grid className={classes.chartContainer} item container xs={12} justify="center" alignItems="center">
                        <Chart metrics={metricValues} yAxisValue={YAxis} XYvalues={axes} />
                    </Grid>
                </Grid>
            </Grid>
        </main>
    );
}

const mapDispatch = dispatch => ({
    fetchLiveData: () => {
        dispatch({
            type: actions.START_POLLING,
        });
    },
    historicData: metricName => {
        dispatch({
            type: actions.FETCH_RECENT,
            metricName,
        });
    },
});

export default connect(
    () => ({}),
    mapDispatch,
)(GraphMetrics);
