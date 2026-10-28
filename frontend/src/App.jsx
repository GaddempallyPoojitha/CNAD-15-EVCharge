
import { useEffect, useCallback, useState } from 'react'
import './App.css'

const API = '/api'

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }

  return response.json()
}

function App() {
  const [stations, setStations] = useState([])
  const [reservations, setReservations] = useState([])
  const [waitTimes, setWaitTimes] = useState({})
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [stationId, setStationId] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [stationData, reservationData] = await Promise.all([
        apiRequest('/stations'),
        apiRequest('/reservations')
      ])

      setStations(stationData)
      setReservations(reservationData)

      const waitResults = await Promise.all(
        stationData.map(async station => {
          try {
            const result = await apiRequest(
              `/stations/${station.id}/wait-time`
            )
            return [station.id, result.estimatedWaitMinutes]
          } catch {
            return [station.id, null]
          }
        })
      )

      setWaitTimes(Object.fromEntries(waitResults))
      setStationId(current => current || String(stationData[0]?.id ?? ''))
    } catch (err) {
      setError(`Could not load backend data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function createReservation(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    try {
      await apiRequest('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          customerName: customerName.trim(),
          vehicleNumber: vehicleNumber.trim(),
          stationId: Number(stationId)
        })
      })

      setNotice('Reservation created successfully.')
      setCustomerName('')
      setVehicleNumber('')
      setShowForm(false)
      await loadData()
    } catch (err) {
      setError(`Reservation failed: ${err.message}`)
    }
  }

  async function cancelReservation(id) {
    if (!window.confirm('Cancel this reservation?')) return

    setError('')
    setNotice('')

    try {
      await apiRequest(`/reservations/${id}/cancel`, {
        method: 'PUT'
      })
      setNotice('Reservation cancelled successfully.')
      await loadData()
    } catch (err) {
      setError(`Cancellation failed: ${err.message}`)
    }
  }

  const filteredStations = stations.filter(station =>
    `${station.name} ${station.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const available = stations.reduce(
    (sum, station) => sum + (station.availableChargers || 0), 0
  )

  const total = stations.reduce(
    (sum, station) => sum + (station.totalChargers || 0), 0
  )

  const confirmed = reservations.filter(
    reservation => reservation.status === 'CONFIRMED'
  ).length

  const money = value =>
    value == null ? '—' : `₹${Number(value).toFixed(2)}`

  return (
    <main className="dashboard">
      <header className="topbar">
        <a className="brand" href="#" onClick={event => event.preventDefault()}>
          <span className="brand-icon">⚡</span>
          <span>EV<span className="brand-accent">Charge</span></span>
        </a>
        <div className="topbar-right">
          <span className="live-dot" />
          <span>Charging network</span>
          <button className="refresh-button" onClick={loadData}>
            ↻ Refresh
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {[
          ['overview', 'Overview'],
          ['stations', 'Stations'],
          ['reservations', 'Reservations'],
          ['guardian', 'Wait-Time Guardian']
        ].map(([key, label]) => (
          <button
            key={key}
            className={`nav-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="welcome">
        <div>
          <div className="eyebrow">EV CHARGING NETWORK</div>
          <h1>Smart charging. <span>Seamless journeys.</span></h1>
          <p>Find a station, reserve your charger, and stay ahead of the wait.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>
          + New reservation
        </button>
      </section>

      {error && <div className="error-notice">{error}</div>}
      {notice && <div className="success-notice">{notice}</div>}
      {loading && <div className="loading-line">Syncing with EVCharge services…</div>}

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-label">Charging stations</div>
          <div className="stat-value">{stations.length}</div>
          <div className="stat-foot">Connected to the network</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Available chargers</div>
          <div className="stat-value green">{available}</div>
          <div className="stat-foot">Out of {total} total chargers</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Confirmed reservations</div>
          <div className="stat-value">{confirmed}</div>
          <div className="stat-foot">Active bookings</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Average estimated wait</div>
          <div className="stat-value">
            {stations.length
              ? `${Math.round(
                  stations.reduce(
                    (sum, station) => sum + (waitTimes[station.id] ?? 0), 0
                  ) / stations.length
                )} min`
              : '—'}
          </div>
          <div className="stat-foot">Based on current reservations</div>
        </article>
      </section>

      {activeTab === 'overview' && (
        <section className="content-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <h2>Charging stations</h2>
                <p>Explore availability across your network</p>
              </div>
              <button className="text-button" onClick={() => setActiveTab('stations')}>
                View all →
              </button>
            </div>
            <input
              className="search-input"
              placeholder="Search station or location…"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            <StationList
              stations={filteredStations.slice(0, 5)}
              waitTimes={waitTimes}
              money={money}
              onReserve={id => {
                setStationId(String(id))
                setShowForm(true)
              }}
            />
            {!loading && stations.length === 0 && !error && (
              <p className="empty-state">No stations found in the database.</p>
            )}
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <h2>Recent reservations</h2>
                <p>Latest booking activity</p>
              </div>
              <button className="text-button" onClick={() => setActiveTab('reservations')}>
                View all →
              </button>
            </div>
            <ReservationList
              reservations={reservations.slice(0, 6)}
              onCancel={cancelReservation}
            />
          </div>
        </section>
      )}

      {activeTab === 'stations' && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>All charging stations</h2>
              <p>Live information from the station service</p>
            </div>
          </div>
          <input
            className="search-input"
            placeholder="Search station or location…"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <StationList
            stations={filteredStations}
            waitTimes={waitTimes}
            money={money}
            onReserve={id => {
              setStationId(String(id))
              setShowForm(true)
            }}
          />
        </section>
      )}

      {activeTab === 'reservations' && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Reservations</h2>
              <p>Bookings and cancellation management</p>
            </div>
            <button className="primary-button" onClick={() => setShowForm(true)}>
              + New reservation
            </button>
          </div>
          <ReservationList reservations={reservations} onCancel={cancelReservation} />
        </section>
      )}

      {activeTab === 'guardian' && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Wait-Time Guardian</h2>
              <p>Estimated waiting time by charging station</p>
            </div>
          </div>
          <div className="guardian-grid">
            {stations.map(station => (
              <article className="guardian-card" key={station.id}>
                <div className="station-icon">⚡</div>
                <h3>{station.name}</h3>
                <p>{station.location}</p>
                <div className="wait-number">
                  {waitTimes[station.id] == null
                    ? '—'
                    : `${waitTimes[station.id]} min`}
                </div>
                <span className="muted">Estimated wait</span>
                <div className="availability-bar">
                  <span
                    style={{
                      width: `${station.totalChargers
                        ? (station.availableChargers / station.totalChargers) * 100
                        : 0}%`
                    }}
                  />
                </div>
                <p className="muted">
                  {station.availableChargers} of {station.totalChargers} chargers available
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <span>⚡ EVCharge <span className="muted">· Cloud-native charging reservations</span></span>
        <span className="service-status"><span className="live-dot" /> Dashboard connected</span>
      </footer>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section
            className="reservation-modal"
            onClick={event => event.stopPropagation()}
          >
            <div className="panel-heading">
              <div>
                <h2>Reserve a charger</h2>
                <p>Enter your details to create a booking</p>
              </div>
              <button className="close-button" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={createReservation} className="reservation-form">
              <label>
                Customer name
                <input
                  required
                  minLength={2}
                  value={customerName}
                  onChange={event => setCustomerName(event.target.value)}
                  placeholder="Enter your name"
                />
              </label>
              <label>
                Vehicle number
                <input
                  required
                  value={vehicleNumber}
                  onChange={event => setVehicleNumber(event.target.value)}
                  placeholder="e.g. TS09AB1234"
                />
              </label>
              <label>
                Charging station
                <select
                  required
                  value={stationId}
                  onChange={event => setStationId(event.target.value)}
                >
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} — {station.location}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={!stations.length}>
                  Confirm reservation
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

function StationList({ stations, waitTimes, money, onReserve }) {
  if (!stations.length) {
    return <p className="empty-state">No matching stations.</p>
  }

  return (
    <div className="station-list">
      {stations.map(station => (
        <article className="station-row" key={station.id}>
          <div className="station-icon">⚡</div>
          <div className="station-info">
            <h3>{station.name}</h3>
            <p>{station.location}</p>
            <div className="station-meta">
              <span>{money(station.pricePerKwh)}/kWh</span>
              <span>Wait: {waitTimes[station.id] == null
                ? '—'
                : `${waitTimes[station.id]} min`}</span>
            </div>
          </div>
          <div className="station-availability">
            <strong>{station.availableChargers}</strong>
            <span>of {station.totalChargers} free</span>
            <button
              className="small-button"
              disabled={station.availableChargers <= 0}
              onClick={() => onReserve(station.id)}
            >
              Reserve
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function ReservationList({ reservations, onCancel }) {
  if (!reservations.length) {
    return <p className="empty-state">No reservations yet. Create your first booking.</p>
  }

  return (
    <div className="reservation-list">
      {reservations.map(reservation => (
        <article className="reservation-row" key={reservation.id}>
          <div className="reservation-icon">↗</div>
          <div className="reservation-info">
            <h3>{reservation.customerName}</h3>
            <p>{reservation.vehicleNumber}</p>
            <p className="muted">
              {reservation.station?.name || `Station #${reservation.station?.id ?? ''}`}
              {' · '}
              {reservation.reservationTime
                ? new Date(reservation.reservationTime).toLocaleString()
                : 'Time unavailable'}
            </p>
          </div>
          <div className="reservation-actions">
            <span className={`status-pill ${
              reservation.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'
            }`}>
              {reservation.status}
            </span>
            {reservation.status === 'CONFIRMED' && (
              <button
                className="cancel-button"
                onClick={() => onCancel(reservation.id)}
              >
                Cancel
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

export default App
