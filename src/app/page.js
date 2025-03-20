'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Rocket,
  Satellite,
  Radio,
  Wifi,
  Shield,
  BarChart3
} from 'lucide-react'

// Status Badge component with animations
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'operational':
        return {
          icon: <CheckCircle2 className='w-5 h-5' />,
          text: 'Operational',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
      case 'degraded':
        return {
          icon: <AlertTriangle className='w-5 h-5' />,
          text: 'Degraded',
          color: 'bg-amber-50 text-amber-700 border-amber-200'
        }
      case 'outage':
        return {
          icon: <XCircle className='w-5 h-5' />,
          text: 'Outage',
          color: 'bg-rose-50 text-rose-700 border-rose-200'
        }
      default:
        return {
          icon: <AlertTriangle className='w-5 h-5' />,
          text: 'Unknown',
          color: 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 border ${config.color}`}
    >
      <span className={`${status === 'operational' ? 'animate-pulse' : ''}`}>
        {config.icon}
      </span>
      <span className='text-sm font-medium'>{config.text}</span>
    </div>
  )
}

// Service icon selector
const ServiceIcon = ({ type }) => {
  const iconMap = {
    communications: <Radio className='w-6 h-6' />,
    navigation: <Satellite className='w-6 h-6' />,
    propulsion: <Rocket className='w-6 h-6' />,
    network: <Wifi className='w-6 h-6' />,
    security: <Shield className='w-6 h-6' />,
    analytics: <BarChart3 className='w-6 h-6' />
  }

  return iconMap[type] || <Satellite className='w-6 h-6' />
}

// Loading skeleton
const SkeletonLoader = () => (
  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
    {[...Array(6)].map((_, i) => (
      <div key={i} className='p-6 bg-white shadow-md rounded-xl animate-pulse'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
            <div className='w-32 h-6 bg-gray-200 rounded-md'></div>
          </div>
          <div className='w-24 h-8 bg-gray-200 rounded-full'></div>
        </div>
        <div className='space-y-4'>
          <div className='w-full h-4 bg-gray-200 rounded'></div>
          <div className='w-3/4 h-4 bg-gray-200 rounded'></div>
          <div className='grid grid-cols-2 gap-2'>
            <div className='w-full h-8 bg-gray-200 rounded-md'></div>
            <div className='w-full h-8 bg-gray-200 rounded-md'></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const StatusPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'timeline'

  // Function to determine service status based on component statuses
  const determineServiceStatus = service => {
    const components = []

    // Add database component if exists
    if (service.databaseStatus) {
      components.push({
        name: 'Database',
        status: service.databaseStatus === 'running' ? 'operational' : 'outage'
      })
    }

    // Add web component if exists
    if (service.webStatus) {
      components.push({
        name: 'Web Interface',
        status: service.webStatus === 'running' ? 'operational' : 'outage'
      })
    }

    // Add API component if exists
    if (service.apiStatus) {
      components.push({
        name: 'API Service',
        status: service.apiStatus === 'running' ? 'operational' : 'outage'
      })
    }

    // Add DB management component if exists
    if (service.dbmanagementStatus) {
      components.push({
        name: 'DB Management',
        status:
          service.dbmanagementStatus === 'running' ? 'operational' : 'outage'
      })
    }

    // Determine overall status
    let status = 'operational'
    if (components.some(c => c.status === 'outage')) {
      status = 'outage'
    } else if (components.some(c => c.status === 'degraded')) {
      status = 'degraded'
    }

    return { status, components }
  }

  // Function to fetch data from the API
  const fetchServices = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api')

      if (!response.ok) {
        throw new Error(`Error fetching status: ${response.statusText}`)
      }

      const data = await response.json()

      // Transform API data to match the format expected by our components
      const transformedServices = data.map((service, index) => {
        const { status, components } = determineServiceStatus(service)

        // Generate a service type based on the service name
        let type = 'analytics'
        if (
          service.name.includes('📝') ||
          service.name.includes('💡') ||
          service.name.includes('📋')
        ) {
          type = 'communications'
        } else if (
          service.name.includes('💼') ||
          service.name.includes('📮') ||
          service.name.includes('✅')
        ) {
          type = 'security'
        } else if (service.name.includes('💸') || service.name.includes('📦')) {
          type = 'analytics'
        } else if (service.name.includes('🏀') || service.name.includes('🚀')) {
          type = 'propulsion'
        } else if (service.name.includes('📄')) {
          type = 'navigation'
        }

        return {
          id: index + 1,
          name: service.name.replace(/^[^\w\s]+ /, ''), // Remove emoji prefix
          description: service.url ? `URL: ${service.url}` : 'Internal service',
          type,
          status,
          uptime:
            status === 'operational'
              ? '99.9%'
              : status === 'degraded'
              ? '95.0%'
              : '0.0%',
          components,
          lastIncident: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString()
        }
      })

      setServices(transformedServices)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchServices()

    // Refresh every 60 seconds
    const interval = setInterval(fetchServices, 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshStatus = () => {
    fetchServices()
  }

  // Overall system status
  const getSystemStatus = () => {
    if (services.some(s => s.status === 'outage')) return 'outage'
    if (services.some(s => s.status === 'degraded')) return 'degraded'
    return 'operational'
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Grid view for services

  const GridView = () => (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {services.map(service => (
        <Card
          key={service.id}
          className='overflow-hidden transition-all duration-300 border border-gray-100 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl rounded-xl'
        >
          <CardHeader className='flex flex-row items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white'>
            <div className='flex items-center gap-3'>
              <div
                className={`p-2 rounded-lg ${
                  service.status === 'operational'
                    ? 'bg-emerald-100 text-emerald-700'
                    : service.status === 'degraded'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                <ServiceIcon type={service.type} />
              </div>
              <div className='relative group'>
                <span className='block max-w-[180px] text-lg font-bold text-gray-800 truncate'>
                  {service.name}
                </span>
                <span className='absolute left-0 hidden px-2 py-1 text-sm text-white bg-gray-800 rounded-md shadow-md group-hover:block whitespace-nowrap'>
                  {service.name}
                </span>
                <p className='text-xs text-gray-500'>{service.description}</p>
              </div>
            </div>
            <StatusBadge status={service.status} />
          </CardHeader>

          <CardContent className='p-4'>
            <div className='flex items-center justify-between mb-3 text-sm text-gray-600'>
              <div>
                Uptime:{' '}
                <span className='font-semibold text-gray-800'>
                  {service.uptime}
                </span>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-2'>
              {service.components.map((component, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-2 rounded-lg bg-gray-50'
                >
                  <span className='text-sm font-medium text-gray-700'>
                    {component.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      component.status === 'operational'
                        ? 'bg-emerald-500'
                        : component.status === 'degraded'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  ></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Timeline view for services
  const TimelineView = () => (
    <div className='space-y-4'>
      {services.map(service => (
        <div
          key={service.id}
          className={`flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm border rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
            service.status === 'operational'
              ? 'border-emerald-200'
              : service.status === 'degraded'
              ? 'border-amber-200'
              : 'border-rose-200'
          }`}
        >
          <div
            className={`p-3 rounded-full flex-shrink-0 ${
              service.status === 'operational'
                ? 'bg-emerald-100 text-emerald-700'
                : service.status === 'degraded'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            <ServiceIcon type={service.type} />
          </div>

          <div className='flex-grow'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-800'>
                {service.name}
              </h3>
              <StatusBadge status={service.status} />
            </div>
            <p className='mt-1 text-sm text-gray-500'>{service.description}</p>

            <div className='flex gap-4 mt-2'>
              <div className='text-xs text-gray-500'>
                Uptime:{' '}
                <span className='font-semibold text-gray-700'>
                  {service.uptime}
                </span>
              </div>
              <div className='text-xs text-gray-500'>
                Last incident:{' '}
                <span className='font-semibold text-gray-700'>
                  {formatDate(service.lastIncident)}
                </span>
              </div>
            </div>

            <div className='flex gap-2 mt-3'>
              {service.components.map((component, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 text-xs rounded-full ${
                    component.status === 'operational'
                      ? 'bg-emerald-50 text-emerald-700'
                      : component.status === 'degraded'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {component.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className='min-h-screen pb-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50'>
      {/* Background decoration */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <div className='absolute rounded-full w-96 h-96 bg-blue-500/5 -top-20 -left-20'></div>
        <div className='absolute rounded-full w-96 h-96 bg-indigo-500/5 top-1/4 -right-20'></div>
        <div className='absolute rounded-full w-96 h-96 bg-cyan-500/5 bottom-1/4 -left-20'></div>
      </div>

      <div className='container relative z-10 px-4 py-12 mx-auto'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600'>
            BSO System Status
          </h1>
          <p className='max-w-2xl mx-auto text-lg text-gray-600'>
            Real-time monitoring of all critical BSO infrastructure components
          </p>

          {/* Status summary */}
          <div className='flex justify-center mt-6'>
            <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-sm bg-white/80 backdrop-blur-sm'>
              <div
                className={`w-3 h-3 rounded-full ${
                  getSystemStatus() === 'operational'
                    ? 'bg-emerald-500'
                    : getSystemStatus() === 'degraded'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              ></div>
              <span className='font-medium text-gray-700'>
                {getSystemStatus() === 'operational'
                  ? 'All Systems Operational'
                  : getSystemStatus() === 'degraded'
                  ? 'Some Systems Degraded'
                  : 'System Outages Detected'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center justify-center gap-4 mt-8'>
            <div className='flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-white/80 backdrop-blur-sm'>
              <RefreshCw
                className={`h-5 w-5 text-blue-600 cursor-pointer hover:rotate-180 transition-all duration-300 ${
                  loading ? 'animate-spin' : ''
                }`}
                onClick={refreshStatus}
              />
              <span className='text-sm text-gray-600'>
                {loading
                  ? 'Refreshing...'
                  : lastUpdated
                  ? `Updated: ${lastUpdated.toLocaleTimeString()}`
                  : 'Loading...'}
              </span>
            </div>

            <div className='flex p-1 rounded-full shadow-sm bg-white/80 backdrop-blur-sm'>
              <button
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('timeline')}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className='mt-8'>
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className='p-8 text-center shadow-md bg-white/90 backdrop-blur-sm rounded-xl'>
              <XCircle className='w-12 h-12 mx-auto mb-4 text-rose-500' />
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                Error Loading Data
              </h3>
              <p className='mb-4 text-gray-600'>{error}</p>
              <button
                className='px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600'
                onClick={refreshStatus}
              >
                Try Again
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <GridView />
          ) : (
            <TimelineView />
          )}
        </div>
      </div>
    </div>
  )
}

export default StatusPage
