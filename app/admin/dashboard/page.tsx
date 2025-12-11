'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, DollarSign, CheckCircle, Loader2 } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ActivityItem from '@/components/ActivityItem'
import { Badge } from '@/components/ui/badge'
import type { Lead } from '@/types'
import type { Metrics, Activity } from '@/lib/modules/crm/analytics'

interface KanbanColumn {
  id: string
  title: string
  color: string
  leads: Lead[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [leadsChartData, setLeadsChartData] = useState<any[]>([])
  const [revenueChartData, setRevenueChartData] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch metrics
      const metricsRes = await fetch('/api/admin/metrics')
      const metricsData = await metricsRes.json()

      // Fetch leads grouped by status
      const leadsRes = await fetch('/api/leads')
      const leadsData = await leadsRes.json()

      // Fetch activity
      const activityRes = await fetch('/api/admin/activity')
      const activityData = await activityRes.json()

      // Fetch chart data
      const leadsChartRes = await fetch('/api/admin/charts/leads?days=30')
      const leadsChartJson = await leadsChartRes.json()

      const revenueChartRes = await fetch('/api/admin/charts/revenue?months=6')
      const revenueChartJson = await revenueChartRes.json()

      setMetrics(metricsData.metrics)
      setActivities(activityData.activities || [])
      setLeadsChartData(leadsChartJson.data || [])
      setRevenueChartData(revenueChartJson.data || [])

      // Group leads by status for Kanban
      const allLeads = leadsData.leads || []
      const kanbanColumns: KanbanColumn[] = [
        {
          id: 'pending',
          title: 'Pending',
          color: 'bg-gray-100',
          leads: allLeads.filter((l: Lead) => l.status === 'pending'),
        },
        {
          id: 'contacted',
          title: 'Contacted',
          color: 'bg-blue-100',
          leads: allLeads.filter((l: Lead) => l.status === 'contacted'),
        },
        {
          id: 'opened',
          title: 'Opened',
          color: 'bg-purple-100',
          leads: allLeads.filter((l: Lead) => l.status === 'opened'),
        },
        {
          id: 'clicked',
          title: 'Clicked',
          color: 'bg-cyan-100',
          leads: allLeads.filter((l: Lead) => l.status === 'clicked'),
        },
        {
          id: 'subscribed',
          title: 'Subscribed',
          color: 'bg-green-100',
          leads: allLeads.filter((l: Lead) => l.status === 'subscribed'),
        },
        {
          id: 'delivered',
          title: 'Delivered',
          color: 'bg-emerald-100',
          leads: allLeads.filter((l: Lead) => l.status === 'delivered'),
        },
        {
          id: 'canceled',
          title: 'Canceled',
          color: 'bg-red-100',
          leads: allLeads.filter((l: Lead) => l.status === 'canceled'),
        },
      ]

      setColumns(kanbanColumns)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result

    // Dropped outside a droppable
    if (!destination) return

    // Dropped in same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Find the lead
    const sourceColumn = columns.find((c) => c.id === source.droppableId)
    const lead = sourceColumn?.leads.find((l) => l.id === draggableId)

    if (!lead) return

    // Update lead status
    try {
      const response = await fetch(`/api/leads/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: destination.droppableId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update lead status')
      }

      // Refresh data
      await fetchData()
    } catch (error) {
      console.error('Error updating lead status:', error)
      alert('Failed to update lead status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage leads and track performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Leads"
          value={metrics?.totalLeads || 0}
          icon={Users}
          color="text-blue-600"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          color="text-purple-600"
        />
        <MetricCard
          title="MRR"
          value={`$${metrics?.mrr.toFixed(2)}`}
          icon={DollarSign}
          color="text-green-600"
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics?.activeSubscriptions || 0}
          icon={CheckCircle}
          color="text-emerald-600"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban Board */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pipeline</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                  <div key={column.id} className="flex-shrink-0 w-64">
                    <div className={`rounded-lg p-3 ${column.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{column.title}</h3>
                        <span className="text-sm text-gray-600">
                          {column.leads.length}
                        </span>
                      </div>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`mt-2 space-y-2 min-h-[200px] rounded-lg p-2 ${
                            snapshot.isDraggingOver ? 'bg-gray-100' : ''
                          }`}
                        >
                          {column.leads.map((lead, index) => (
                            <Draggable
                              key={lead.id}
                              draggableId={lead.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                                >
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {lead.business_name}
                                  </h4>
                                  {lead.email && (
                                    <p className="text-xs text-gray-600 mt-1 truncate">
                                      {lead.email}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {lead.industry}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {new Date(lead.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Leads Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Leads" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
