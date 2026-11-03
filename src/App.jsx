import { useState } from 'react'
import { flights } from './data/flights'
import './App.css'

const airports = [
  { code: 'BLR', label: 'Bengaluru (BLR)' },
  { code: 'DEL', label: 'Delhi (DEL)' },
  { code: 'BOM', label: 'Mumbai (BOM)' },
]
const money = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', currencyDisplay: 'code', maximumFractionDigits: 0,
}).format(amount)

function App() {
  const [search, setSearch] = useState({ origin: 'BLR', destination: 'DEL', date: '2026-11-20' })
  const [results, setResults] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [name, setName] = useState('Test Traveller')
  const [passengers, setPassengers] = useState('1')
  const [bookingError, setBookingError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const count = Number(passengers)
  const validCount = Number.isInteger(count) && count >= 1 && count <= 6
  const total = selectedFlight && validCount ? selectedFlight.priceInr * count : null

  function changeSearch(event) {
    setSearch({ ...search, [event.target.name]: event.target.value })
    setResults(null)
    setSelectedFlight(null)
    setConfirmation(null)
    setSearchError('')
    setBookingError('')
  }

  function findFlights(event) {
    event.preventDefault()
    setSelectedFlight(null)
    setConfirmation(null)
    setResults(null)
    setBookingError('')
    if (search.origin === search.destination) {
      setSearchError('Choose different origin and destination airports.')
      return
    }
    if (!search.date) {
      setSearchError('Choose a travel date before searching.')
      return
    }
    setSearchError('')
    setResults(flights.filter((flight) => flight.origin === search.origin
      && flight.destination === search.destination && flight.date === search.date))
  }

  function selectFlight(flight) {
    setSelectedFlight(flight)
    setBookingError('')
    setConfirmation(null)
  }

  function confirmBooking(event) {
    event.preventDefault()
    setConfirmation(null)
    if (!selectedFlight) {
      setBookingError('Select a flight before confirming.')
      return
    }
    if (!name.trim()) {
      setBookingError('Enter a nonblank test name, such as Test Traveller.')
      return
    }
    if (!validCount) {
      setBookingError('Enter a whole number of passengers from 1 to 6.')
      return
    }
    setBookingError('')
    setConfirmation({
      reference: `TRAIN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      flight: selectedFlight, name: name.trim(), passengers: count, total,
    })
  }

  return (
    <>
      <div className="training-notice">TRAINING ONLY — simulated booking, no ticket issued</div>
      <main>
        <header className="page-header">
          <p className="eyebrow">A little journey. A practice booking.</p>
          <h1>Training Flights</h1>
          <p>Explore fictional flights and try a booking with test details.</p>
        </header>

        <section className="panel" aria-labelledby="search-heading">
          <h2 id="search-heading"><span className="step">1</span> Find a flight</h2>
          <form onSubmit={findFlights} noValidate>
            <div className="search-fields">
              {['origin', 'destination'].map((field) => (
                <div className="field" key={field}>
                  <label htmlFor={field}>{field === 'origin' ? 'From' : 'To'}</label>
                  <select id={field} name={field} value={search[field]} onChange={changeSearch}
                    aria-describedby={searchError ? 'search-error' : undefined}>
                    {airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.label}</option>)}
                  </select>
                </div>
              ))}
              <div className="field">
                <label htmlFor="date">Travel date</label>
                <input id="date" name="date" type="date" required value={search.date}
                  onChange={changeSearch} aria-describedby={searchError ? 'search-error' : undefined} />
              </div>
              <button type="submit">Search flights</button>
            </div>
            {searchError && <p className="error" id="search-error" role="alert">{searchError}</p>}
          </form>
          <p className="hint">Try Bengaluru to Delhi on 20 November 2026. All departures are local IST times.</p>
        </section>

        <section className="panel" aria-labelledby="results-heading">
          <h2 id="results-heading"><span className="step">2</span> Choose your flight</h2>
          <p role="status">
            {results === null ? 'Search to see available practice flights.'
              : results.length === 0 ? 'No flights found for this route and date. Try BLR to DEL on 2026-11-20.'
                : `${results.length} flights found. Prices are per person.`}
          </p>
          {results?.length > 0 && (
            <fieldset className="flight-list">
              <legend className="sr-only">Select one flight</legend>
              {results.map((flight) => (
                <label className={`flight-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`} key={flight.id}>
                  <input type="radio" name="flight" value={flight.id}
                    checked={selectedFlight?.id === flight.id} onChange={() => selectFlight(flight)} />
                  <span><strong>{flight.airline}</strong><small>{flight.id} · {flight.date}</small></span>
                  <span><strong>{flight.origin} → {flight.destination}</strong><small>Departure {flight.departure} IST</small></span>
                  <span className="price"><strong>{money(flight.priceInr)}</strong><small>per person</small></span>
                </label>
              ))}
            </fieldset>
          )}
        </section>

        {selectedFlight && (
          <section className="panel" aria-labelledby="booking-heading">
            <h2 id="booking-heading"><span className="step">3</span> Try a simulated booking</h2>
            <p><strong>{selectedFlight.id} · {selectedFlight.airline}</strong> · {selectedFlight.origin} → {selectedFlight.destination}</p>
            <p>{selectedFlight.date} · {selectedFlight.departure} IST · {money(selectedFlight.priceInr)} per person</p>
            <p className="hint" id="test-guidance">Use Test Traveller or another fictional name. Do not enter real passenger information.</p>
            <form onSubmit={confirmBooking} noValidate>
              <div className="booking-fields">
                <div className="field">
                  <label htmlFor="test-name">Test name</label>
                  <input id="test-name" type="text" autoComplete="off" required value={name}
                    aria-describedby={`test-guidance${bookingError ? ' booking-error' : ''}`}
                    onChange={(event) => { setName(event.target.value); setConfirmation(null); setBookingError('') }} />
                </div>
                <div className="field">
                  <label htmlFor="passengers">Passengers (1–6)</label>
                  <input id="passengers" type="number" min="1" max="6" step="1" required value={passengers}
                    aria-describedby={bookingError ? 'booking-error' : undefined}
                    onChange={(event) => { setPassengers(event.target.value); setConfirmation(null); setBookingError('') }} />
                </div>
              </div>
              <p className="total">Total <strong>{total === null ? 'Enter a valid passenger count' : money(total)}</strong></p>
              {bookingError && <p className="error" id="booking-error" role="alert">{bookingError}</p>}
              <button type="submit">Confirm simulated booking</button>
            </form>
          </section>
        )}

        {confirmation && (
          <section className="panel confirmation" role="status" aria-labelledby="confirmation-heading">
            <p className="eyebrow">SIMULATED</p>
            <h2 id="confirmation-heading">Your practice booking is complete</h2>
            <dl>
              <div><dt>Display reference</dt><dd>{confirmation.reference}</dd></div>
              <div><dt>Test name</dt><dd>{confirmation.name}</dd></div>
              <div><dt>Flight</dt><dd>{confirmation.flight.id} · {confirmation.flight.airline}</dd></div>
              <div><dt>Route</dt><dd>{confirmation.flight.origin} → {confirmation.flight.destination}</dd></div>
              <div><dt>Departure</dt><dd>{confirmation.flight.date} · {confirmation.flight.departure} IST</dd></div>
              <div><dt>Passengers</dt><dd>{confirmation.passengers}</dd></div>
              <div><dt>Total</dt><dd>{money(confirmation.total)}</dd></div>
            </dl>
            <p>This reference is a display identifier only. No real reservation exists and no ticket is issued.</p>
          </section>
        )}
        <footer>Fictional flights. Fictional prices. Refreshing clears your selection and confirmation.</footer>
      </main>
    </>
  )
}

export default App
