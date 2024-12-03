'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react'

// Enhanced StatusIndicator component
const StatusIndicator = ({ status, label }) => {
  const isRunning = status === 'running'

  return (
    <div className='flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5'>
      {isRunning ? (
        <CheckCircle2 className='text-green-500 w-4 h-4' />
      ) : (
        <XCircle className='text-red-500 w-4 h-4' />
      )}
      <span
        className={`text-xs font-medium ${
          isRunning ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

const StatusPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api')
        const data = await res.json()
        setServices(data)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to fetch service status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const getOverallStatus = service => {
    const statuses = [
      service.webStatus,
      service.databaseStatus,
      service.apiStatus,
      service.dbmanagementStatus
    ].filter(status => status !== null)

    return statuses.every(status => status === 'running')
      ? 'Operational'
      : statuses.length === 0
      ? 'Service Missing'
      : 'Partial Outage'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-4'>
      <div className='w-full max-w-4xl'>
        <div className='md:flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-extrabold text-gray-900'>
            BSO Space System Status
          </h1>
          <div className='flex items-center gap-2 text-gray-600'>
            {loading ? (
              <RefreshCw className='w-5 h-5 animate-spin' />
            ) : lastUpdated ? (
              <span className='text-sm mt-4'>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {services.length > 0 &&
            services.map((service, index) => (
              <Card
                key={index}
                className='shadow-xl border-gray-200 hover:shadow-2xl transition-shadow duration-300'
              >
                <CardHeader className='flex flex-row justify-between items-center'>
                  <CardTitle
                    onClick={() =>
                      service.url && window.open(service.url, '_blank')
                    }
                    className={`text-xl font-bold text-gray-800 flex items-center gap-2 ${
                      service.url ? 'hover:underline cursor-pointer' : ''
                    }`}
                  >
                    {service.name}
                    {service.url && (
                      <a
                        href={service.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-gray-600 hover:text-gray-800 transition-colors duration-200'
                      >
                        <ExternalLink className='w-5 h-5' />
                      </a>
                    )}
                  </CardTitle>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      getOverallStatus(service) === 'Operational'
                        ? 'bg-green-100 text-green-800'
                        : getOverallStatus(service) === 'Service Missing'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {getOverallStatus(service)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-3'>
                    {service.webStatus && (
                      <StatusIndicator
                        status={service.webStatus}
                        label='Website'
                      />
                    )}
                    {service.databaseStatus && (
                      <StatusIndicator
                        status={service.databaseStatus}
                        label='Database'
                      />
                    )}
                    {service.apiStatus && service.apiStatus !== null && (
                      <StatusIndicator status={service.apiStatus} label='API' />
                    )}
                    {service.dbmanagementStatus && (
                      <StatusIndicator
                        status={service.dbmanagementStatus}
                        label='DB Management'
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

export default StatusPage
