import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type Tab = 'home' | 'menu' | 'reservation' | 'events'

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)

  // Reservierung
  const [reservation, setReservation] = useState({ date: '', time: '', people: '2', name: '', phone: '' })
  const [reservationStep, setReservationStep] = useState<'form' | 'choice' | 'sent'>('form')

  // Lightning Payment (aktuell deaktiviert)
  const [showPayment, setShowPayment] = useState(false)

  // Menu Accordion
  const [openCategory, setOpenCategory] = useState<'drinks' | 'food' | null>('drinks')

  // Events
  const eventsData = [
    {
      de: { title: "Bitcoin Pizza Day", desc: "Große Pizza-Party mit Lightning-Raffles & Community" },
      en: { title: "Bitcoin Pizza Day", desc: "Big Pizza Party with Lightning Raffles & Community" },
      vi: { title: "Bitcoin Pizza Day", desc: "Tiệc Pizza lớn với rút thăm Lightning & Cộng đồng" },
      date: "18. Juni 2026",
      time: "18:00 Uhr",
      emoji: "🍕"
    },
    {
      de: { title: "Lightning Talk Abend", desc: "Kurze Talks über Bitcoin, Lightning & DeFi" },
      en: { title: "Lightning Talk Night", desc: "Short talks about Bitcoin, Lightning & DeFi" },
      vi: { title: "Buổi Lightning Talk", desc: "Các bài nói ngắn về Bitcoin, Lightning & DeFi" },
      date: "Jeden Mittwoch",
      time: "19:30 Uhr",
      emoji: "⚡"
    }
  ]

  // Live Daten
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockRes = await fetch('https://mempool.space/api/blocks/tip/height')
        setBlockHeight(parseInt(await blockRes.text()))

        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,vnd')
        const data = await priceRes.json()
        setBtcPrice(data.bitcoin)
      } catch (e) {}
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const t = {
    de: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", home: "Start", menu: "Menü", reservation: "Tisch reservieren", events: "Events", send: "Reservierung absenden", pay: "Mit Lightning bezahlen", howToReceive: "Wie möchtest du die Reservierung erhalten?", whatsapp: "Per WhatsApp senden", email: "Per E-Mail senden", newReservation: "Neue Reservierung", success: "✅ Reservierung erhalten! Wir melden uns bald bei dir.", drinks: "Getränke", food: "Essen" },
    en: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", home: "Home", menu: "Menu", reservation: "Reserve Table", events: "Events", send: "Send Reservation", pay: "Pay with Lightning", howToReceive: "How would you like to receive the reservation?", whatsapp: "Send via WhatsApp", email: "Send via Email", newReservation: "New Reservation", success: "✅ Reservation received! We'll contact you soon.", drinks: "Drinks", food: "Food" },
    vi: { title: "₿itCoffee", subtitle: "Đà Nẵng • Việt Nam", home: "Trang chủ", menu: "Thực đơn", reservation: "Đặt bàn", events: "Sự kiện", send: "Gửi đặt bàn", pay: "Thanh toán bằng Lightning", howToReceive: "Bạn muốn nhận đặt bàn qua?", whatsapp: "Gửi qua WhatsApp", email: "Gửi qua Email", newReservation: "Đặt bàn mới", success: "✅ Đã nhận đặt bàn! Chúng tôi sẽ liên hệ sớm.", drinks: "Đồ uống", food: "Đồ ăn" }
  }[language]

  const calculateSats = (vndPrice: number) => {
    if (!btcPrice?.vnd) return '0';
    const sats = Math.round((vndPrice / btcPrice.vnd) * 100000000);
    return sats.toLocaleString();
  }

  const menuDrinks = [
    { name: "BitCoffee", priceVnd: 30000, emoji: "☕" },
    { name: "Cappuccino", priceVnd: 35000, emoji: "☕" },
    { name: "Espresso", priceVnd: 28000, emoji: "☕" },
    { name: "Café Latte", priceVnd: 40000, emoji: "☕" },
  ]

  const menuFood = [
    { name: "Avocado Toast", priceVnd: 95000, emoji: "🥐" },
    { name: "Pho Bo Mini", priceVnd: 85000, emoji: "🍜" },
    { name: "Banh Mi", priceVnd: 65000, emoji: "🥖" },
    { name: "Spring Rolls", priceVnd: 75000, emoji: "🌯" },
  ]

  const handleReservationSubmit = (e: any) => {
    e.preventDefault()
    setReservationStep('choice')
  }

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Neue Reservierung ₿itCoffee\n\n` +
      `Name: ${reservation.name}\n` +
      `Datum: ${reservation.date}\n` +
      `Uhrzeit: ${reservation.time}\n` +
      `Personen: ${reservation.people}\n` +
      `Telefon: ${reservation.phone}`
    );
    window.open(`https://wa.me/849XXXXXXXXX?text=${text}`, '_blank');
    setReservationStep('sent');
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Neue Reservierung ₿itCoffee');
    const body = encodeURIComponent(
      `Name: ${reservation.name}\n` +
      `Datum: ${reservation.date}\n` +
      `Uhrzeit: ${reservation.time}\n` +
      `Personen: ${reservation.people}\n` +
      `Telefon: ${reservation.phone}\n\nBitte bestätigen.`
    );
    window.open(`mailto:DEINE_EMAIL_HIER@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setReservationStep('sent');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', paddingBottom: '80px' }}>
      <img src="/bitcoffee-hero.png" alt="BitCoffee" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />

      <div style={{ maxWidth: '460px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Sprachen */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1.5rem 0' }}>
          {(['de','en','vi'] as const).map(l => (
            <button key={l} onClick={() => setLanguage(l)} 
              style={{ padding: '6px 14px', borderRadius: '9999px', background: language === l ? '#f59e0b' : '#333', color: language === l ? '#111' : 'white' }}>
              {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.4rem', marginBottom: '0.3rem' }}>☕</div>
          
          {/* Zweifarbiges Logo mit gedrehtem ₿ */}
          <h1 style={{ fontSize: '2.6rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
            <span style={{ 
              color: '#f59e0b', 
              display: 'inline-block', 
              transform: 'rotate(-12deg)',
              marginRight: '2px'
            }}>₿</span>
            <span style={{ color: 'white' }}>itCoffee</span>
          </h1>
          
          <p style={{ color: '#f59e0b', marginBottom: '0.8rem' }}>{t.subtitle}</p>

          <div style={{ fontSize: '1rem', color: '#ddd', lineHeight: '1.6', marginTop: '1rem' }}>
            <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} onClick={() => window.open('https://maps.google.com/?q=DEINE_VOLLE_ADRESSE_HIER', '_blank')}>📍 [Deine volle Adresse hier]</p>
            <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} onClick={() => window.open('tel:+849XXXXXXXXX')}>📞 [+84 9XX XXX XXX]</p>
            <p style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/21BitCoffee', '_blank')}>𝕏 @21BitCoffee</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#1a1a1a', borderRadius: '9999px', padding: '4px', margin: '2.2rem 0' }}>
          {['home', 'menu', 'reservation', 'events'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as Tab)}
              style={{ flex: 1, padding: '12px', borderRadius: '9999px', fontWeight: '600', background: activeTab === tab ? '#f59e0b' : 'transparent', color: activeTab === tab ? '#111' : '#ccc' }}>
              {tab === 'home' && t.home}
              {tab === 'menu' && t.menu}
              {tab === 'reservation' && t.reservation}
              {tab === 'events' && t.events}
            </button>
          ))}
        </div>

        {/* Menu */}
        {activeTab === 'menu' && (
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>{t.menu}</h3>

            {/* Getränke */}
            <div onClick={() => setOpenCategory(openCategory === 'drinks' ? null : 'drinks')} style={{ cursor: 'pointer', padding: '12px', background: '#222', borderRadius: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{t.drinks}</span>
                <span>{openCategory === 'drinks' ? '−' : '+'}</span>
              </div>
              {openCategory === 'drinks' && menuDrinks.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i !== menuDrinks.length-1 ? '1px solid #333' : 'none' }}>
                  <div><span style={{ marginRight: '10px' }}>{item.emoji}</span>{item.name}</div>
                  <div style={{ textAlign: 'right' }}>
                    <div>{item.priceVnd.toLocaleString()} VND</div>
                    <div style={{ color: '#f59e0b' }}>~{calculateSats(item.priceVnd)} Sats</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Essen */}
            <div onClick={() => setOpenCategory(openCategory === 'food' ? null : 'food')} style={{ cursor: 'pointer', padding: '12px', background: '#222', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{t.food}</span>
                <span>{openCategory === 'food' ? '−' : '+'}</span>
              </div>
              {openCategory === 'food' && menuFood.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i !== menuFood.length-1 ? '1px solid #333' : 'none' }}>
                  <div><span style={{ marginRight: '10px' }}>{item.emoji}</span>{item.name}</div>
                  <div style={{ textAlign: 'right' }}>
                    <div>{item.priceVnd.toLocaleString()} VND</div>
                    <div style={{ color: '#f59e0b' }}>~{calculateSats(item.priceVnd)} Sats</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reservation */}
        {activeTab === 'reservation' && (
          <div style={{ background: '#1a1a1a', padding: '1.8rem', borderRadius: '20px' }}>
            <h2 style={{ color: '#f59e0b', textAlign: 'center', marginBottom: '1.5rem' }}>{t.reservation}</h2>
            
            {reservationStep === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ fontSize: '1.4rem', color: '#4ade80' }}>{t.success}</p>
                <button onClick={() => { setReservationStep('form'); setReservation({ date: '', time: '', people: '2', name: '', phone: '' }); }} style={{ marginTop: '2rem', color: '#888', background: 'none', border: 'none' }}>
                  {t.newReservation}
                </button>
              </div>
            ) : reservationStep === 'choice' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '1.5rem', color: '#ddd', fontSize: '1.1rem' }}>{t.howToReceive}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button onClick={handleSendWhatsApp} style={{ background: '#25D366', color: 'white', padding: '16px', borderRadius: '9999px', fontWeight: 'bold', border: 'none' }}>
                    📱 {t.whatsapp}
                  </button>
                  <button onClick={handleSendEmail} style={{ background: '#f59e0b', color: '#111', padding: '16px', borderRadius: '9999px', fontWeight: 'bold', border: 'none' }}>
                    ✉️ {t.email}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="date" value={reservation.date} onChange={e => setReservation({...reservation, date: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                <input type="time" value={reservation.time} onChange={e => setReservation({...reservation, time: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                <select value={reservation.people} onChange={e => setReservation({...reservation, people: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }}>
                  <option value="1">1 Person</option><option value="2">2 Personen</option><option value="3">3 Personen</option><option value="4">4 Personen</option><option value="5">5+ Personen</option>
                </select>
                <input type="text" placeholder={language === 'de' ? "Dein Name" : language === 'en' ? "Your Name" : "Tên của bạn"} value={reservation.name} onChange={e => setReservation({...reservation, name: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                <input type="tel" placeholder={language === 'de' ? "Telefonnummer" : language === 'en' ? "Phone Number" : "Số điện thoại"} value={reservation.phone} onChange={e => setReservation({...reservation, phone: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                <button type="submit" style={{ background: '#f59e0b', color: '#111', padding: '16px', borderRadius: '9999px', fontWeight: 'bold' }}>{t.send}</button>
              </form>
            )}
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>{t.events}</h3>
            
            {eventsData.map((event, i) => (
              <div key={i} style={{ 
                background: '#222', 
                padding: '1.25rem', 
                borderRadius: '12px', 
                marginBottom: i !== eventsData.length - 1 ? '1rem' : 0 
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{event.emoji}</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>{event[language].title}</h4>
                <p style={{ color: '#ddd', marginBottom: '1rem' }}>{event[language].desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#ccc' }}>
                  <div><strong>{event.date}</strong></div>
                  <div>{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Home */}
        {activeTab === 'home' && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#ddd' }}>
            Welcome / Willkommen / Chào mừng bạn đến với ₿itCoffee!
          </div>
        )}

        {/* Live Daten */}
        <div style={{ marginTop: '2.5rem', background: '#1a1a1a', padding: '14px', borderRadius: '16px', textAlign: 'center', fontSize: '0.95rem' }}>
          <div>Block Height: <span style={{ color: '#f59e0b' }}>{blockHeight ? `#${blockHeight.toLocaleString()}` : 'Laden...'}</span></div>
          <div style={{ marginTop: '6px' }}>
            BTC: {btcPrice ? `$${btcPrice.usd.toLocaleString()} • €${btcPrice.eur.toLocaleString()} • ₫${(btcPrice.vnd/1000000000).toFixed(2)}B` : 'Laden...'}</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.85rem' }}>
          Copyright © BitcoinZeit
        </div>
      </div>

      {/* Lightning Modal */}
      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', padding: '2rem', borderRadius: '20px', maxWidth: '360px', textAlign: 'center' }}>
            <h3 style={{ color: '#f59e0b' }}>Lightning Zahlung</h3>
            <p style={{ margin: '1rem 0' }}>Zahlungsmodal (wird später aktiviert)</p>
            <button onClick={() => setShowPayment(false)} style={{ background: '#f59e0b', color: '#111', padding: '14px 40px', borderRadius: '9999px', fontWeight: 'bold' }}>
              Fertig
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App