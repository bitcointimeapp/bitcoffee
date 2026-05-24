import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type Tab = 'home' | 'menu' | 'reservation' | 'bitictionary'

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Reservierung
  const [reservation, setReservation] = useState({ date: '', time: '', people: '2', name: '', phone: '' })
  const [reservationStep, setReservationStep] = useState<'form' | 'choice' | 'sent'>('form')

  // Menu Accordion
  const [openCategory, setOpenCategory] = useState<'drinks' | 'food' | null>('drinks')

  // Bitictionary
  const bitictionary = [ /* ... deine 30 Einträge bleiben gleich ... */ ]

  const filteredTerms = bitictionary
    .filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[language].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  // Live Daten + t + calculateSats + menuDrinks + menuFood + Handler bleiben gleich

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      paddingBottom: '80px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '620px',
        margin: '0 auto',
        padding: '0 1rem' 
      }}>
        
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>

          {/* Hero Bild */}
          <img src="/bitcoffee-hero.png" alt="BitCoffee" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '0 0 16px 16px' }} />

          {/* Sprachen, Logo, Tabs ... bleiben gleich */}

          {/* Bitictionary */}
          {activeTab === 'bitictionary' && (
            <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>{t.bitictionary}</h3>
              
              {/* Suchfeld – jetzt perfekt ausgerichtet */}
              <input
                type="text"
                placeholder={language === 'de' ? "Suchen..." : language === 'en' ? "Search..." : "Tìm kiếm..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  borderRadius: '12px', 
                  background: '#222', 
                  color: 'white', 
                  border: 'none',
                  marginBottom: '1.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />

              {filteredTerms.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '3rem 1rem' }}>Kein Begriff gefunden.</p>
              ) : (
                filteredTerms.map((item, i) => (
                  <div key={i} style={{ 
                    background: '#222', 
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    marginBottom: '1rem' 
                  }}>
                    <h4 style={{ color: '#f59e0b', margin: '0 0 0.8rem 0' }}>{item.term}</h4>
                    <p style={{ color: '#ddd', lineHeight: '1.55', whiteSpace: 'pre-line' }}>{item[language]}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Rest der App (Menu, Reservation, Home, Live Daten) */}
          {/* ... bleibt gleich wie in der letzten Version ... */}

        </div>
      </div>
    </div>
  )
}

export default App