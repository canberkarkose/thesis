/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip
} from 'recharts';

import { dataTestIds } from '../../../../dataTest/dataTestIds';

import { CalorieBreakdownText } from '../RecipeInformationModal.styles';

interface CaloricBreakdownChartProps {
  pieChartData: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const CaloricBreakdownChart: React.FC<CaloricBreakdownChartProps> = ({
  pieChartData,
}) => (
  <div data-testid={dataTestIds.components.caloricBreakdownChart.container}>
    <CalorieBreakdownText>Caloric Breakdown</CalorieBreakdownText>
    <PieChart width={200} height={200}>
      <Pie
        data={pieChartData}
        dataKey='value'
        nameKey='name'
        cx='50%'
        cy='50%'
        outerRadius={70}
        fill='#8884d8'
      >
        {pieChartData.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <RechartsTooltip />
      <Legend iconSize={10} />
    </PieChart>
  </div>
);
