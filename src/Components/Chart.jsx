import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Select } from '@shopify/polaris';
import { fetchContests } from '../api';
import { Spinner } from '@shopify/polaris';

const Chart = () => {
  const [contests, setContests] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedContests = await fetchContests();
        setContests(fetchedContests);
      } catch (err) {
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setChartLoading(true);
      setTimeout(() => setChartLoading(false), 500);
    }
  }, [loading]);

  const filterOptions = useMemo(() => {
    const types = Array.from(new Set(contests.map((contest) => contest.type)));
    return [{ label: 'All', value: 'ALL' }, ...types.map((type) => ({ label: type, value: type }))];
  }, [contests]);

  const phaseOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Finished', value: 'FINISHED' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending', value: 'PENDING' },
  ];

  const filteredData = contests.filter((contest) => {
    const matchesType = typeFilter === 'ALL' || contest.type === typeFilter;
    const matchesPhase = phaseFilter === 'ALL' || contest.phase === phaseFilter;
    return matchesType && matchesPhase;
  });

  const chartData = filteredData.map((contest) => ({
    name: contest.name,
    durationSeconds: contest.durationSeconds,
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData} width={500} height={250}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="durationSeconds" stroke="#8884d8" />
          </LineChart>
        );
      case 'composed':
        return (
          <ComposedChart data={chartData} width={500} height={250}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2424" />
                <stop offset="100%" stopColor="#4a569d" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="durationSeconds"
              fill="url(#chartGradient)"
              stroke="#4a569d"
            />
            <Line type="monotone" dataKey="durationSeconds" stroke="#dc2424" />
          </ComposedChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData} width={500} height={250}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2424" />
                <stop offset="100%" stopColor="#4a569d" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="durationSeconds" fill="url(#chartGradient)" />
          </BarChart>
        );
      default:
        return (
          <LineChart data={chartData} width={500} height={250}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="durationSeconds" stroke="#82ca9d" />
          </LineChart>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <Spinner size="large" />
      </div>
    );
  }

  if (chartLoading) {
    return (
      <div className="flex justify-center items-center h-72">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-8">
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          label="Filter by Type"
          options={filterOptions}
          value={typeFilter}
          onChange={(value) => setTypeFilter(value)}
        />
        <Select
          label="Filter by Phase"
          options={phaseOptions}
          value={phaseFilter}
          onChange={(value) => setPhaseFilter(value)}
        />
        <Select
          label="Chart Type"
          options={[
            { label: 'Line Chart', value: 'line' },
            { label: 'Bar Chart', value: 'bar' },
            { label: 'Composed Chart', value: 'composed' },
          ]}
          value={chartType}
          onChange={(value) => setChartType(value)}
        />
      </div>
      <div className="relative w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
