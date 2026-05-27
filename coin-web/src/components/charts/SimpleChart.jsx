import { LineChart, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const SimpleChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#0ea5e9" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SimpleChart
