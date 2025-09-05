'use client'

import { useState, useEffect, useRef } from 'react'

interface RouteDestination {
  id: string
  address: string
  notes: string
  time: string
  lastVisit: string
  latitude: number
  longitude: number
}

interface RouteData {
  status: string
  timestamp: string
  office_location: {
    latitude: number
    longitude: number
  }
  destinations_count: number
  destinations: RouteDestination[]
  route: {
    waypoint_order: number[]
    overview: {
      total_distance_meters: number
      total_duration_seconds: number
    }
    polyline: string
    legs: any[]
  }
}

interface PlanMyDayModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PlanMyDayModal({ isOpen, onClose }: PlanMyDayModalProps) {
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const directionsRendererRef = useRef<any>(null)

  // Set default date to 9/29 (where we have sample visit data)
  useEffect(() => {
    setSelectedDate('2025-09-29')
  }, [])

  // Initialize map when route data is available
  useEffect(() => {
    if (routeData && mapRef.current && typeof window !== 'undefined' && (window as any).google) {
      initializeMap()
    }
  }, [routeData])

  const initializeMap = () => {
    if (!mapRef.current || !routeData) return

    const { google } = window as any

    // Initialize map centered on office location
    const map = new google.maps.Map(mapRef.current, {
      center: {
        lat: routeData.office_location.latitude,
        lng: routeData.office_location.longitude
      },
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    mapInstanceRef.current = map

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add office marker
    const officeMarker = new google.maps.Marker({
      position: {
        lat: routeData.office_location.latitude,
        lng: routeData.office_location.longitude
      },
      map: map,
      title: 'Office',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#1976d2" stroke="white" stroke-width="3"/>
            <path d="M12 28h16V14H12v14zm2-12h12v10H14V16zm2 2v2h2v-2h-2zm4 0v2h2v-2h-2zm-4 4v2h2v-2h-2zm4 0v2h2v-2h-2zm-4 4v2h2v-2h-2zm4 0v2h2v-2h-2z" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    })

    markersRef.current.push(officeMarker)

    // Add destination markers in optimized order
    routeData.route.waypoint_order.forEach((originalIndex, optimizedIndex) => {
      const destination = routeData.destinations[originalIndex]
      
      const marker = new google.maps.Marker({
        position: {
          lat: destination.latitude,
          lng: destination.longitude
        },
        map: map,
        title: `Case #${destination.id}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#4caf50" stroke="white" stroke-width="3"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${optimizedIndex + 1}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        }
      })

      // Add click listener to highlight destination in list
      marker.addListener('click', () => {
        setSelectedDestination(optimizedIndex)
      })

      markersRef.current.push(marker)
    })

    // Display route polyline if available
    if (routeData.route.polyline) {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
      }

      // Decode polyline and create a simple polyline
      const decodedPath = google.maps.geometry.encoding.decodePath(routeData.route.polyline)
      
      const routePolyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#1976d2',
        strokeOpacity: 0.8,
        strokeWeight: 4
      })

      routePolyline.setMap(map)
      directionsRendererRef.current = routePolyline
    }

    // Fit map to show all markers
    const bounds = new google.maps.LatLngBounds()
    markersRef.current.forEach(marker => {
      bounds.extend(marker.getPosition())
    })
    map.fitBounds(bounds)
  }

  const fetchRouteData = async (date: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the deployed Cloud Function URL
      const cloudFunctionUrl = 'https://cw-vision-mapping-807576987550.us-central1.run.app'
      const url = new URL(cloudFunctionUrl)
      if (date) {
        url.searchParams.append('date', date)
      }

      console.log('Fetching route data from:', url.toString())
      
      const response = await fetch(url.toString())
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText}`)
        }
      }
      
      const data = await response.json()
      console.log('Received data:', data)
      setRouteData(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch route data')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRoute = () => {
    if (!selectedDate) {
      setError('Please select a date')
      return
    }
    
    // Ensure date is in YYYY-MM-DD format for BigQuery
    let formattedDate = selectedDate
    if (selectedDate) {
      const date = new Date(selectedDate)
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD format
      }
    }
    
    console.log('Original date:', selectedDate)
    console.log('Formatted date for API:', formattedDate)
    
    fetchRouteData(formattedDate)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDistance = (meters: number) => {
    const miles = Math.round(meters * 0.000621371 * 10) / 10
    return `${miles} miles`
  }

  const handleDestinationClick = (index: number) => {
    setSelectedDestination(index)
    // TODO: Highlight marker on map and show case details
  }

  const handleClose = () => {
    // Clear route data when modal is closed
    setRouteData(null)
    setSelectedDestination(null)
    setError(null)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const exportToGoogleMaps = () => {
    if (!routeData) return

    // Create Google Maps URL with proper waypoint structure
    const origin = `${routeData.office_location.latitude},${routeData.office_location.longitude}`
    const destination = origin // Return to office
    
    // Build waypoints array for the URL path
    const waypointCoords = routeData.route.waypoint_order.map(originalIndex => {
      const dest = routeData.destinations[originalIndex]
      return `${dest.latitude},${dest.longitude}`
    })
    
    // For Google Maps web URL, we need to structure it as: /origin/waypoint1/waypoint2/.../destination
    const urlParts = [origin, ...waypointCoords, destination]
    const googleMapsUrl = `https://www.google.com/maps/dir/${urlParts.join('/')}`
    
    // For mobile app, use the waypoints parameter format
    const waypointsParam = waypointCoords.join('|')
    
    // Open in new tab for desktop or try to open in Google Maps app on mobile
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      // Try to open in Google Maps app first, fallback to web
      const appUrl = `comgooglemaps://?directionsmode=driving&origin=${origin}&waypoints=${waypointsParam}&destination=${destination}`
      window.location.href = appUrl
      
      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open(googleMapsUrl, '_blank')
      }, 1000)
    } else {
      // Desktop - open in new tab
      window.open(googleMapsUrl, '_blank')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay plan-my-day-overlay" onClick={handleOverlayClick}>
      <div className="modal-container plan-my-day-modal">
        {/* Header */}
        <div className="modal-header plan-my-day-header">
          <div className="header-content">
            <div className="header-info">
              <div className="header-icon">
                <span className="icon">map</span>
              </div>
              <div>
                <h2>Plan My Day</h2>
                <p>Optimize your daily route and view case summaries</p>
              </div>
            </div>
            <div className="header-controls">
              <div className="date-picker">
                <span className="icon">event</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
                <button
                  onClick={handleGenerateRoute}
                  disabled={loading}
                  className="action-btn primary"
                >
                  <span className="icon">{loading ? 'hourglass_empty' : 'route'}</span>
                  {loading ? 'Generating...' : 'Generate Route'}
                </button>
              </div>
              <button onClick={handleClose} className="modal-close">
                <span className="icon">close</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="modal-body plan-my-day-body">
          {error && (
            <div className="error-message">
              <span className="icon">error</span>
              {error}
            </div>
          )}

          {!routeData && !loading && !error && (
            <div className="empty-state">
              <span className="icon">map</span>
              <h3>Ready to Plan Your Day</h3>
              <p>Select a date and click "Generate Route" to see your optimized daily schedule with case locations.</p>
            </div>
          )}

          {routeData && (
            <div className="route-content">
              {/* Map Section */}
              <div className="map-section">
                <div 
                  ref={mapRef}
                  className="map-container" 
                  id="planMyDayMap"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Route Details Panel */}
              <div className="route-panel">
                <div className="panel-header">
                  <h3>Today's Route</h3>
                  <span className="route-count">{routeData.destinations_count} stops</span>
                </div>

                {/* Route Metrics */}
                <div className="route-metrics">
                  <div className="metrics-info">
                    <div className="metric">
                      <span className="icon">schedule</span>
                      <span>Total Time: {formatDuration(routeData.route.overview.total_duration_seconds)}</span>
                    </div>
                    <div className="metric">
                      <span className="icon">route</span>
                      <span>Total Distance: {formatDistance(routeData.route.overview.total_distance_meters)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={exportToGoogleMaps}
                    className="export-btn"
                    title="Export route to Google Maps"
                  >
                    <span className="icon">open_in_new</span>
                    Export to Maps
                  </button>
                </div>

                {/* Destinations List */}
                <div className="destinations-list">
                  {routeData.route.waypoint_order.map((originalIndex, optimizedIndex) => {
                    const destination = routeData.destinations[originalIndex]
                    const isSelected = selectedDestination === optimizedIndex
                    
                    return (
                      <div
                        key={destination.id}
                        className={`destination-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDestinationClick(optimizedIndex)}
                      >
                        <div className="destination-number">
                          {optimizedIndex + 1}
                        </div>
                        <div className="destination-info">
                          <div className="destination-header">
                            <h4>Case #{destination.id}</h4>
                          </div>
                          <p className="destination-address">{destination.address}</p>
                          <div className="destination-meta">
                            <span className="visit-time">{destination.time}</span>
                            <span className="visit-notes">{destination.notes}</span>
                          </div>
                        </div>
                        <div className="destination-actions">
                          <span className="icon">chevron_right</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .plan-my-day-overlay {
          z-index: 1000;
        }

        .plan-my-day-modal {
          width: 95vw;
          height: 90vh;
          max-width: none;
          max-height: none;
          margin: 2.5vh auto;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .plan-my-day-header {
          flex-shrink: 0;
          padding: var(--unit-5) var(--unit-6);
          border-bottom: none;
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
          position: relative;
          overflow: hidden;
        }

        .plan-my-day-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--unit-4);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: var(--unit-3);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--on-primary);
        }

        .header-icon .icon {
          font-size: 24px;
        }

        .header-info h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }

        .header-info p {
          margin: 4px 0 0 0;
          font-size: 0.875rem;
          color: white;
          opacity: 0.9;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: var(--unit-3);
        }

        .date-picker {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          background-color: var(--surface);
          padding: var(--unit-2);
          border-radius: var(--unit-2);
          border: 1px solid var(--outline-variant);
        }

        .date-picker .icon {
          color: var(--on-surface-variant);
        }

        .date-input {
          border: none;
          background: transparent;
          color: var(--on-surface);
          font-size: 0.875rem;
          padding: var(--unit-1);
        }

        .date-input:focus {
          outline: none;
        }

        .plan-my-day-body {
          flex: 1;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .route-content {
          display: flex;
          height: 100%;
          flex: 1;
        }

        .map-section {
          flex: 2;
          background-color: var(--surface-container-low);
          border-right: 1px solid var(--outline-variant);
        }

        .map-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .map-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--on-surface-variant);
          text-align: center;
          gap: var(--unit-2);
        }

        .map-placeholder .icon {
          font-size: 4rem;
          opacity: 0.5;
        }

        .map-info {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--primary);
        }

        .route-panel {
          flex: 1;
          background-color: var(--surface);
          display: flex;
          flex-direction: column;
          min-width: 400px;
        }

        .panel-header {
          padding: var(--unit-4);
          border-bottom: 1px solid var(--outline-variant);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .route-count {
          font-size: 0.875rem;
          color: var(--on-surface-variant);
          background-color: var(--surface-container);
          padding: var(--unit-1) var(--unit-2);
          border-radius: var(--unit-1);
        }

        .route-metrics {
          padding: var(--unit-3) var(--unit-4);
          background-color: var(--surface-container-low);
          border-bottom: 1px solid var(--outline-variant);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--unit-4);
        }

        .metrics-info {
          display: flex;
          gap: var(--unit-4);
        }

        .metric {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }

        .metric .icon {
          font-size: 18px;
          color: var(--primary);
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          padding: var(--unit-2) var(--unit-3);
          background-color: var(--primary);
          color: var(--on-primary);
          border: none;
          border-radius: var(--unit-2);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .export-btn:hover {
          background-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .export-btn:active {
          transform: translateY(0);
        }

        .export-btn .icon {
          font-size: 16px;
        }

        .destinations-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--unit-2);
        }

        .destination-item {
          display: flex;
          align-items: center;
          gap: var(--unit-3);
          padding: var(--unit-3);
          margin-bottom: var(--unit-2);
          background-color: var(--surface-container-low);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-2);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .destination-item:hover {
          background-color: var(--surface-container);
          border-color: var(--primary);
        }

        .destination-item.selected {
          background-color: var(--primary-container);
          border-color: var(--primary);
        }

        .destination-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary);
          color: var(--on-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .destination-info {
          flex: 1;
          min-width: 0;
        }

        .destination-header {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          margin-bottom: var(--unit-1);
        }

        .destination-header h4 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--on-surface);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .priority-badge {
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .priority-normal {
          background-color: var(--surface-container);
          color: var(--on-surface-variant);
        }

        .priority-high {
          background-color: var(--error-container);
          color: var(--on-error-container);
        }

        .destination-address {
          margin: 0 0 var(--unit-1) 0;
          font-size: 0.75rem;
          color: var(--on-surface-variant);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .destination-meta {
          display: flex;
          gap: var(--unit-2);
          font-size: 0.75rem;
        }

        .case-id {
          color: var(--primary);
          font-weight: 500;
        }

        .visit-status {
          color: var(--on-surface-variant);
        }

        .destination-actions {
          color: var(--on-surface-variant);
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--unit-3);
          padding: var(--unit-8);
          color: var(--on-surface-variant);
          text-align: center;
        }

        .empty-state .icon {
          font-size: 4rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
          max-width: 400px;
        }

        @media (max-width: 768px) {
          .plan-my-day-modal {
            width: 100vw;
            height: 100vh;
            margin: 0;
            border-radius: 0;
          }

          .header-content {
            flex-direction: column;
            gap: var(--unit-3);
          }

          .route-content {
            flex-direction: column;
          }

          .map-section {
            flex: 1;
            border-right: none;
            border-bottom: 1px solid var(--outline-variant);
          }

          .route-panel {
            flex: 1;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}
