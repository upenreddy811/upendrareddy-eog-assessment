import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const GET_VALUES = gql`
    query {
        getMetrics
    }
`;

const animatedComponents = makeAnimated();

const SelectMetric = props => {
    const { setSelected } = props;
    const onChange = (metrics) => {
        setSelected(() => metrics ?
            metrics.map(op => op.value)
            :
            []
        );
    };
    return (
        <Query query={GET_VALUES}>
            {({ loading, error, data }) => {
                if (loading) return "Please wait...";
                if (error) return `Error! ${error.message}`;
                const options = data.getMetrics.map(metric => ({
                    value: metric,
                    label: metric
                }));
                return (
                    <Select
                        options={options}
                        components={animatedComponents}
                        isMulti
                        onChange={onChange}
                        closeMenuOnSelect={false}
                    />
                );
            }}
        </Query>
    )
}

export default SelectMetric;
