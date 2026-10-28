
import './App.css'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#080d17',
      color: '#f1f5ff',
      fontFamily: 'Arial, sans-serif',
      padding: '48px 24px',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: '42px',
        margin: '0 0 12px',
        color: '#f1f5ff'
      }}>
        ⚡ <span style={{ color: '#f1f5ff' }}>EV</span>
        <span style={{ color: '#718cff' }}>Charge</span>
      </h1>

      <p style={{ color: '#c5cee0', marginBottom: '32px' }}>
        Smart charging. Seamless journeys.
      </p>

      <section style={{
        maxWidth: '650px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        border: '1px solid #293952',
        borderRadius: '18px',
        background: '#111a2b',
        color: '#f1f5ff',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          color: '#f1f5ff',
          margin: '0 0 16px',
          fontSize: '26px'
        }}>
          Welcome to EVCharge
        </h2>

        <p style={{ color: '#c5cee0', margin: '12px 0' }}>
          Your intelligent EV charging dashboard is running.
        </p>

        <p style={{ color: '#c5cee0', margin: '10px 0' }}>
          Charging stations: <strong style={{ color: '#ffffff' }}>24</strong>
        </p>

        <p style={{ color: '#c5cee0', margin: '10px 0' }}>
          Available chargers: <strong style={{ color: '#40d9a0' }}>86</strong>
        </p>

        <button
          onClick={() => window.alert('EVCharge is working!')}
          style={{
            background: '#5578ff',
            color: '#ffffff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '9px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '8px'
          }}
        >
          Test EVCharge
        </button>
      </section>
    </div>
  )
}

export default App
