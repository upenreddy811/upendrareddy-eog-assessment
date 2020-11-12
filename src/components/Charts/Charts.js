import React from 'react';
import { LineChart, Legend, CartesianGrid, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { red, grey, green, indigo, purple, teal } from '@material-ui/core/colors';
import { connect } from 'react-redux';

const colors = [red[500], grey[900], purple[500], teal[900], green[500], indigo[400]];

const Chart = ({ data, metrics, yAxisValue, XYvalues }) => (
  <ResponsiveContainer>
    <LineChart width={800} height={500} data={data}>
    <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5',
     border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
    <CartesianGrid stroke="#ccc" />
      {metrics.map((metric, index) => (
        <Line  type='natural'
          key={index}
          dot={false}
          activeDot={true}
          yAxisId={yAxisValue(metric)}
          dataKey={metric}
          stroke={colors[index]}
        />
      ))}
      {metrics.length > 0 && <XAxis dataKey="at" interval={175} strokeWidth={1} />}
      {XYvalues.percentage && (
        <YAxis
          label={{ value: '%', position: 'insideTopLeft', offset: 0, fill: '#908e8e', dy: 10, dx: 10, angle: -90 }}
          yAxisId={0}
          orientation="left"
          stroke={'#908e8e'}
          domain={[0, 100]}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          tick={{ fontSize: 12 }}
        />
      )}
      {XYvalues.pressure && (
        <YAxis
          label={{
            value: 'PSI',
            position: 'insideTopLeft',
            offset: 0,
            fill: '#908e8e',
            fontSize: 12,
            dy: 15,
            dx: 10,
            angle: -90,
          }}
          yAxisId={1}
          orientation="left"
          stroke={'#908e8e'}
          tick={{ fontSize: 12 }}
          tickFormatter={formatter}
        />
      )}
      {XYvalues.temp && (
        <YAxis
          label={{
            value: 'F',
            position: 'insideTopLeft',
            offset: 0,
            fill: '#908e8e',
            fontSize: 12,
            dy: 10,
            dx: 10,
            angle: -90,
          }}
          yAxisId={2}
          orientation="left"
          stroke={'#908e8e'}
          tick={{ fontSize: 12 }}
          tickFormatter={formatter}
        />
      )}

      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
);


const formatter = value => {
  if (value > 1000000000) {
    return (value / 1000000000).toString() + 'B';
  } else if (value > 1000000) {
    return (value / 1000000).toString() + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toString() + 'K';
  } else {
    return value.toString();
  }
};

const mapState = state => {
  const { metrics } = state.metrics;
  const plot = Object.keys(metrics).map(key => metrics[key]);
  return {
    data: plot,
  };
};

export default connect(
  mapState,
  () => ({}),
)(Chart);
