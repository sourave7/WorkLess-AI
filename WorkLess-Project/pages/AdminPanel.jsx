import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/admin/StatCard';
import UserActivityTable from '@/components/admin/UserActivityTable';
import AnalyticsChart from '@/components/admin/AnalyticsChart';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
    activeToday: 0,
    proUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('users_metadata')
        .select('*', { count: 'exact', head: true });

      // Fetch total scans
      const { count: scanCount } = await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true });

      // Fetch pro users
      const { count: proCount } = await supabase
        .from('users_metadata')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_tier', 'pro');

      // Fetch today's active users
      const today = new Date().toISOString().split('T')[0];
      const { count: activeCount } = await supabase
        .from('users_metadata')
        .select('*', { count: 'exact', head: true })
        .eq('last_scan_date', today);

      // Fetch recent scans with user info
      const { data: recentScans } = await supabase
        .from('scans')
        .select(`
          *,
          users_metadata!inner(user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch daily scan data for chart
      const { data: dailyScans } = await supabase
        .from('scans')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      setStats({
        totalUsers: userCount || 0,
        totalScans: scanCount || 0,
        activeToday: activeCount || 0,
        proUsers: proCount || 0
      });

      setRecentActivity(recentScans || []);

      // Process chart data
      const scansByDay = {};
      dailyScans?.forEach(scan => {
        const day = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        scansByDay[day] = (scansByDay[day] || 0) + 1;
      });

      setChartData(
        Object.entries(scansByDay).map(([day, count]) => ({ day, scans: count }))
      );
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - WorkLess AI Hub</title>
        <meta name="description" content="Manage users and monitor system activity." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Navbar />

        <div className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-black text-white mb-2">Owner Dashboard</h1>
              <p className="text-slate-300">Monitor system performance and user activity</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                color="purple"
                delay={0}
              />
              <StatCard
                icon={FileText}
                title="Total Scans"
                value={stats.totalScans}
                color="pink"
                delay={0.1}
              />
              <StatCard
                icon={Activity}
                title="Active Today"
                value={stats.activeToday}
                color="green"
                delay={0.2}
              />
              <StatCard
                icon={TrendingUp}
                title="Pro Users"
                value={stats.proUsers}
                color="yellow"
                delay={0.3}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <AnalyticsChart data={chartData} />
              <UserActivityTable activity={recentActivity} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;