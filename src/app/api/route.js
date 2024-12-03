import services from '@/data/services'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET (req) {
  try {
    if (req.method === 'GET') {
      const portainerApiUrl = process.env.PORTAINER_API_URL
      const portainerApiToken = process.env.PORTAINER_API_TOKEN

      if (!portainerApiUrl || !portainerApiToken) {
        throw new Error('Environment variables not configured properly')
      }

      const response = await fetch(portainerApiUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': `${portainerApiToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from Portainer API')
      }

      const containersData = await response.json()

      // Fetch container data from Portainer API
      const containerStatuses = containersData.map(container => {
        // replace container name has / to ''
        const containerName = container.Names[0].replace('/', '')
        // get container id and state
        const containerId = container.Id
        // get container state
        const containerState = container.State

        return {
          containerName,
          containerId,
          containerState
        }
      })

      //  check container status
      const servicesWithStatus = services.map(service => {
        // databaseStatus, webStatus, apiStatus, dbmanagementStatus
        const dbStatus = service.database
          ? checkContainerStatus(service.database, containerStatuses)
          : null

        const webStatus = service.web
          ? checkContainerStatus(service.web, containerStatuses)
          : null

        const apiStatus = service.api
          ? checkContainerStatus(service.api, containerStatuses)
          : null

        const dbmanagementStatus = service.dbmanagement
          ? checkContainerStatus(service.dbmanagement, containerStatuses)
          : null

        return {
          ...service,
          databaseStatus: dbStatus,
          webStatus: webStatus,
          apiStatus: apiStatus,
          dbmanagementStatus: dbmanagementStatus
        }
      })

      return NextResponse.json(servicesWithStatus)
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Function to check the status of a container
function checkContainerStatus (containerName, containerStatuses) {
  const container = containerStatuses.find(
    status => status.containerName === containerName
  )

  if (!container) return 'Container not found'

  return container.containerState === 'running' ? 'running' : 'down'
}
