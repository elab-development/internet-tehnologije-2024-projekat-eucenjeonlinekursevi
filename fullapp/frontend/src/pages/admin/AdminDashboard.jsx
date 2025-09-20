import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Users, Layers, ListChecks, Award } from 'lucide-react';

const PIE_COLORS = ['#10B981', '#EF4444'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const json = await api.admin.stats();
        setData(json);
      } catch (e) {
        setErr(e.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totals = data?.totals || {};
  const line = data?.certificatesByDay || [];
  const top = data?.topCourses || [];
  const pass = data?.passRate?.month || { passed: 0, failed: 0 };
  const pieData = [
    { name: 'Passed', value: pass.passed },
    { name: 'Failed', value: pass.failed },
  ];

  return (
    <div className='space-y-8'>
      <div className='mb-2'>
        <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
        <p className='text-gray-600'>Overview of platform activity</p>
      </div>

      {err && (
        <div className='rounded-md bg-red-50 px-4 py-3 text-red-700 shadow'>
          {err}
        </div>
      )}
      {loading && <div className='text-gray-600'>Loading…</div>}

      {/* KPI cards */}
      {!loading && data && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <KPI
            icon={<Users className='h-5 w-5 text-blue-600' />}
            label='Users'
            value={totals.users}
          />
          <KPI
            icon={<Layers className='h-5 w-5 text-blue-600' />}
            label='Courses'
            value={totals.courses}
          />
          <KPI
            icon={<ListChecks className='h-5 w-5 text-blue-600' />}
            label='Tests'
            value={totals.tests}
          />
          <KPI
            icon={<Award className='h-5 w-5 text-blue-600' />}
            label='Certificates'
            value={totals.certificates}
          />
        </div>
      )}

      {/* Charts */}
      {!loading && data && (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Line: Certificates per day */}
          <div className='rounded-xl bg-white p-4 shadow'>
            <h3 className='mb-3 font-semibold text-gray-900'>
              Certificates (last 30 days)
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={line}>
                  <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type='monotone' dataKey='count' />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar: Top courses */}
          <div className='rounded-xl bg-white p-4 shadow'>
            <h3 className='mb-3 font-semibold text-gray-900'>
              Top Courses (by certificates)
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={top}>
                  <XAxis dataKey='title' tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey='count' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie: Pass rate (this month) */}
          <div className='rounded-xl bg-white p-4 shadow'>
            <h3 className='mb-3 font-semibold text-gray-900'>
              Pass Rate (this month)
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey='value'
                    nameKey='name'
                    outerRadius={90}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ icon, label, value }) {
  return (
    <div className='rounded-xl bg-white p-4 shadow'>
      <div className='flex items-center gap-3'>
        {icon}
        <div>
          <p className='text-sm text-gray-600'>{label}</p>
          <p className='text-2xl font-semibold text-gray-900'>{value ?? 0}</p>
        </div>
      </div>
    </div>
  );
}