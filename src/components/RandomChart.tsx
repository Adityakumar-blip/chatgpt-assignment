import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Pie,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Generate random data for charts
const generateRandomData = (points = 7) => {
  const data = [];
  const categories = [
    "Product A",
    "Product B",
    "Product C",
    "Product D",
    "Product E",
    "Product F",
    "Product G",
  ];

  for (let i = 0; i < points; i++) {
    const dataPoint = {
      name: categories[i] || `Category ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      sales: Math.floor(Math.random() * 800),
      revenue: Math.floor(Math.random() * 1200),
      profit: Math.floor(Math.random() * 500),
    };
    data.push(dataPoint);
  }

  return data;
};

const chartTypes = ["line", "bar", "pie", "area"];
const chartColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
];

const ChartComponent = ({ type, title, dataPoints }: any) => {
  const [data, setData] = useState([]);
  const [chartType] = useState(
    type || chartTypes[Math.floor(Math.random() * chartTypes.length)]
  );
  const [chartTitle] = useState(title || "Random Chart Data");

  useEffect(() => {
    setData(generateRandomData(dataPoints || 7) as any);
  }, [dataPoints]);

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColors[0]}
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="sales" stroke={chartColors[1]} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={chartColors[0]} />
              <Bar dataKey="profit" fill={chartColors[1]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Pie
                    dataKey={dataPoints}
                    key={`cell-${index}`}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke={chartColors[0]}
                fill={chartColors[0]}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="1"
                stroke={chartColors[1]}
                fill={chartColors[1]}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="text-center p-4">Invalid chart type specified.</div>
        );
    }
  };

  return (
    <div className="chart-container p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{chartTitle}</h3>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
