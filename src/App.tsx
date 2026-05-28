import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type ViewMode = 'phone' | 'pad'

interface DictionaryItem {
  term: string
  de: string
  en: string
  vi: string
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [viewMode, setViewMode] = useState<ViewMode>('phone')
  const [searchTerm, setSearchTerm] = useState('')

  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  // === VOLLSTÄNDIGES BITICTIONARY ===
  const bitictionary: DictionaryItem[] = [
    { term: "Bitcoin", de: "Die erste dezentrale digitale Währung • Begrenzt auf 21 Millionen • Dezentral und pseudonym • Von Satoshi Nakamoto 2009 geschaffen.", en: "The first decentralized digital currency • Capped at 21 million • Decentralized and pseudonymous • Created by Satoshi Nakamoto in 2009.", vi: "Tiền tệ kỹ thuật số phi tập trung đầu tiên • Giới hạn 21 triệu • Phi tập trung và ẩn danh • Được Satoshi Nakamoto tạo năm 2009." },
    { term: "Blockchain", de: "Öffentliche, unveränderliche Kette von Blöcken • Jeder Block enthält Transaktionen • Sehr schwer zu manipulieren.", en: "Public, immutable chain of blocks • Each block contains transactions • Extremely difficult to manipulate.", vi: "Chuỗi khối công khai, không thể thay đổi • Mỗi khối chứa giao dịch • Rất khó bị thao túng." },
    { term: "Whitepaper", de: "Das Bitcoin Whitepaper von Satoshi Nakamoto (2008) • Beschreibt das Grundkonzept von Bitcoin • Titel: 'Bitcoin: A Peer-to-Peer Electronic Cash System'.", en: "Bitcoin Whitepaper by Satoshi Nakamoto (2008) • Describes the core concept of Bitcoin • Title: 'Bitcoin: A Peer-to-Peer Electronic Cash System'.", vi: "Whitepaper Bitcoin của Satoshi Nakamoto (2008) • Mô tả khái niệm cốt lõi • Tiêu đề: 'Bitcoin: A Peer-to-Peer Electronic Cash System'." },
    { term: "Satoshi Nakamoto", de: "Pseudonym des Bitcoin-Erfinders • Identität bis heute unbekannt • Veröffentlichte Whitepaper 2008 und Genesis Block 2009.", en: "Pseudonym of Bitcoin's creator • Identity still unknown • Published Whitepaper in 2008 and Genesis Block in 2009.", vi: "Bút danh của người tạo Bitcoin • Danh tính vẫn chưa biết • Công bố Whitepaper 2008 và Genesis Block 2009." },
    { term: "Satoshi", de: "Kleinste Einheit von Bitcoin • 1 BTC = 100.000.000 Satoshis • Benannt nach dem Erfinder.", en: "Smallest unit of Bitcoin • 1 BTC = 100,000,000 Satoshis • Named after the creator.", vi: "Đơn vị nhỏ nhất của Bitcoin • 1 BTC = 100 triệu Satoshis • Đặt theo tên người tạo." },
    { term: "Lightning Network", de: "Layer-2 für schnelle & günstige Zahlungen • Transaktionen in Sekunden • Sehr niedrige Gebühren.", en: "Layer-2 for fast & cheap payments • Transactions in seconds • Very low fees.", vi: "Layer-2 cho thanh toán nhanh & rẻ • Giao dịch trong vài giây • Phí cực thấp." },
    { term: "Wallet", de: "Digitale Geldbörse • Speichert Private Keys • Hot / Cold Varianten.", en: "Digital wallet • Stores private keys • Hot / Cold variants.", vi: "Ví điện tử • Lưu trữ khóa bí mật • Có loại Hot / Cold." },
    { term: "Private Key", de: "Geheimer Schlüssel • Niemals teilen • Verlust = Verlust der Bitcoin.", en: "Secret key • Never share • Loss = loss of coins.", vi: "Khóa bí mật • Không bao giờ chia sẻ • Mất = mất tiền." },
    { term: "Public Key", de: "Öffentliche Adresse • Kann geteilt werden • Zum Empfangen.", en: "Public address • Can be shared • For receiving.", vi: "Địa chỉ công khai • Có thể chia sẻ • Để nhận Bitcoin." },
    { term: "Halving", de: "Alle 210.000 Blöcke (~4 Jahre) halbiert sich die Mining-Belohnung • Macht Bitcoin knapper.", en: "Every 210,000 blocks (~4 years) mining reward is halved • Makes Bitcoin scarcer.", vi: "Cứ 210.000 khối (~4 năm) phần thưởng khai thác giảm một nửa • Làm Bitcoin khan hiếm hơn." },
    { term: "HODL", de: "Langfristig halten statt verkaufen • Aus Tippfehler entstanden • Bitcoiner-Philosophie.", en: "Hold long-term instead of selling • From a typo • Bitcoin philosophy.", vi: "Giữ dài hạn thay vì bán • Từ lỗi đánh máy • Triết lý Bitcoin." },
    { term: "Fiat", de: "Staatliches Geld (Euro, VND...) • Kommt vom lateinischen 'fiat' = 'es werde gemacht' • Kann beliebig vermehrt werden.", en: "Government money (Euro, VND...) • From Latin 'fiat' = 'let it be done' • Can be printed indefinitely.", vi: "Tiền pháp định • Từ tiếng Latin 'fiat' = 'hãy để nó được tạo ra' • Có thể in vô hạn." },
    { term: "Mining", de: "Rechenleistung für neue Blöcke • Sichert das Netzwerk • Belohnung in BTC.", en: "Computing power for new blocks • Secures the network • Rewarded in BTC.", vi: "Sức mạnh tính toán tạo khối • Bảo vệ mạng • Phần thưởng BTC." },
    { term: "Bitaxe 601 Miner", de: "Kleiner, energieeffizienter Solo-Miner • Ideal für Zuhause • Gut für Einsteiger.", en: "Small, energy-efficient solo miner • Great for home use • Good for beginners.", vi: "Máy đào Bitcoin nhỏ, tiết kiệm điện • Phù hợp dùng tại nhà • Tốt cho người mới." },
    { term: "Fullnode", de: "Vollständiger Bitcoin-Knoten • Speichert die komplette Blockchain • Erhöht Dezentralisierung und eigene Sicherheit.", en: "Full Bitcoin node • Stores the entire blockchain • Increases decentralization and your own security.", vi: "Nút Bitcoin đầy đủ • Lưu trữ toàn bộ blockchain • Tăng tính phi tập trung và an toàn cá nhân." },
    { term: "Blocktrainer Terminal", de: "Hardware-Terminal vom Blocktrainer • Zeigt Echtzeit-Infos, Mempool, Preis etc. • Perfekt für Cafés.", en: "Hardware terminal from Blocktrainer • Shows real-time info, mempool, price etc. • Perfect for cafés.", vi: "Thiết bị phần cứng từ Blocktrainer • Hiển thị thông tin thời gian thực, mempool • Hoàn hảo cho quán cà phê." },
    { term: "Mempool", de: "Warteschlange unbestätigter Transaktionen • Zeigt aktuelle Gebühren • https://mempool.blocktrainer.de", en: "Waiting area for unconfirmed transactions • Shows current fees • https://mempool.blocktrainer.de", vi: "Hàng chờ giao dịch chưa xác nhận • Hiển thị phí hiện tại • https://mempool.blocktrainer.de" },
    { term: "The Bitcoin Standard", de: "Buch von Saifedean Ammous • Erklärt Bitcoin als gesundes Geld • Sehr empfohlen.", en: "Book by Saifedean Ammous • Explains Bitcoin as sound money • Highly recommended.", vi: "Sách của Saifedean Ammous • Giải thích Bitcoin là tiền lành mạnh • Rất đáng đọc." },
    { term: "Hal Finney", de: "Erster Mensch, der eine Bitcoin-Transaktion von Satoshi erhielt (2009) • Früher Cypherpunk und Bitcoin-Entwickler.", en: "First person to receive a Bitcoin transaction from Satoshi (2009) • Early cypherpunk and Bitcoin developer.", vi: "Người đầu tiên nhận giao dịch Bitcoin từ Satoshi (2009) • Cypherpunk và lập trình viên Bitcoin sớm." },
    { term: "Cantillon-Effekt", de: "Neues Geld erreicht zuerst Banken und Reiche • Diese profitieren, bevor die Inflation alle trifft.", en: "New money reaches banks and rich first • They benefit before inflation hits everyone.", vi: "Tiền mới đến tay ngân hàng và người giàu trước • Họ hưởng lợi trước khi lạm phát lan ra." },
    { term: "Block Reward", de: "Belohnung für den Miner eines Blocks • Besteht aus neu geschaffenen BTC + Transaktionsgebühren.", en: "Reward for the miner of a block • New BTC + transaction fees.", vi: "Phần thưởng cho thợ đào khối • Bao gồm BTC mới + phí giao dịch." },
    { term: "FOMO", de: "Fear Of Missing Out • Angst, eine starke Kursbewegung zu verpassen.", en: "Fear Of Missing Out • Fear of missing a big price move.", vi: "Sợ bỏ lỡ • Sợ bỏ lỡ một đợt tăng giá mạnh." },
    { term: "Time Preference", de: "Hohe Zeitpräferenz = sofortige Belohnung • Niedrige Zeitpräferenz = langfristiges Denken (Bitcoin fördert das).", en: "High time preference = immediate reward • Low time preference = long-term thinking (Bitcoin encourages this).", vi: "Thời gian ưu tiên cao = thưởng ngay • Thấp = nghĩ dài hạn (Bitcoin khuyến khích)." },
    { term: "FUD", de: "Fear, Uncertainty, Doubt • Absichtliche Panikmache gegen Bitcoin.", en: "Fear, Uncertainty, Doubt • Deliberate panic against Bitcoin.", vi: "Sợ hãi, Không chắc chắn, Nghi ngờ • Tin đồn tiêu cực về Bitcoin." },
    { term: "Proof of Work (PoW)", de: "Konsensmechanismus • Miner lösen Rechenaufgaben • Macht Bitcoin extrem sicher.", en: "Consensus mechanism • Miners solve computational puzzles • Makes Bitcoin extremely secure.", vi: "Cơ chế đồng thuận • Thợ đào giải toán • Làm Bitcoin cực kỳ an toàn." },
    { term: "Genesis Block", de: "Erster Block der Bitcoin-Blockchain • 3. Januar 2009 • Enthält Nachricht über Bankenrettung.", en: "First block of the Bitcoin blockchain • January 3, 2009 • Contains message about bank bailouts.", vi: "Khối đầu tiên của blockchain Bitcoin • 3/1/2009 • Chứa thông điệp về cứu trợ ngân hàng." },
    { term: "2140", de: "Ca. im Jahr 2140 wird der letzte Bitcoin gemined • Danach nur noch Transaktionsgebühren.", en: "Around year 2140 the last Bitcoin will be mined • After that only transaction fees.", vi: "Khoảng năm 2140 Bitcoin cuối cùng sẽ được khai thác • Sau đó chỉ còn phí giao dịch." },
    { term: "Don’t Trust, Verify", de: "Bitcoin-Motto • Überprüfe alles selbst statt blind zu vertrauen.", en: "Bitcoin motto • Verify everything yourself instead of trusting blindly.", vi: "Khẩu hiệu Bitcoin • Tự kiểm chứng thay vì tin tưởng mù quáng." },
    { term: "Passphrase", de: "Zusätzliche Sicherung zur Seed Phrase • Erhöht die Sicherheit enorm • Auch '25. Wort' genannt.", en: "Additional protection for Seed Phrase • Greatly increases security • Also called '25th word'.", vi: "Bảo vệ thêm cho Seed Phrase • Tăng cường an toàn rất nhiều • Còn gọi là 'từ thứ 25'." },
    { term: "Hard Fork", de: "Nicht rückwärtskompatible Änderung der Regeln • Beispiel: Bitcoin Cash (2017) spaltete sich von Bitcoin ab.", en: "Non-backwards compatible rule change • Example: Bitcoin Cash (2017) split from Bitcoin.", vi: "Thay đổi quy tắc không tương thích ngược • Ví dụ: Bitcoin Cash tách ra năm 2017." },
    { term: "Soft Fork", de: "Rückwärtskompatible Änderung • Alte Nodes akzeptieren neue Blöcke • z.B. SegWit.", en: "Backwards compatible change • Old nodes accept new blocks • e.g. SegWit.", vi: "Thay đổi tương thích ngược • Node cũ vẫn chấp nhận khối mới • Ví dụ SegWit." },
    { term: "51% Attack", de: "Angriff, bei dem eine Gruppe mehr als 50% der Hashrate kontrolliert • Sehr teuer und bei Bitcoin extrem unwahrscheinlich.", en: "Attack where a group controls over 50% of hashrate • Very expensive and extremely unlikely on Bitcoin.", vi: "Tấn công kiểm soát hơn 50% hashrate • Rất tốn kém và cực kỳ khó xảy ra với Bitcoin." },
    { term: "Lindy Effect", de: "Je länger etwas existiert, desto wahrscheinlicher überlebt es weiter • Bitcoin wird mit der Zeit stärker.", en: "The longer something exists, the more likely it will continue to exist • Bitcoin gets stronger over time.", vi: "Càng tồn tại lâu, càng có khả năng tiếp tục tồn tại • Bitcoin càng mạnh theo thời gian." },
    { term: "Metcalfe's Law", de: "Netzwerkeffekt: Der Wert eines Netzwerks steigt quadratisch mit der Anzahl der Nutzer.", en: "Network effect: Value of a network grows quadratically with the number of users.", vi: "Hiệu ứng mạng: Giá trị mạng tăng bình phương theo số lượng người dùng." },
    { term: "The Problem Bitcoin Solves", de: "Doppelausgaben-Problem • Vertrauen in Dritte (Banken) • Inflation durch Gelddrucken.", en: "Double-spending problem • Trust in third parties (banks) • Inflation through money printing.", vi: "Vấn đề chi tiêu kép • Tin tưởng bên thứ ba (ngân hàng) • Lạm phát do in tiền." },
    { term: "Hot Wallet", de: "Mit dem Internet verbundene Wallet • Bequem, aber weniger sicher.", en: "Wallet connected to the internet • Convenient but less secure.", vi: "Ví kết nối internet • Tiện lợi nhưng ít an toàn hơn." },
    { term: "Cold Wallet", de: "Offline Wallet (Hardware oder Paper) • Sehr sicher für große Beträge.", en: "Offline wallet (hardware or paper) • Very secure for large amounts.", vi: "Ví ngoại tuyến (hardware hoặc giấy) • An toàn cao cho số lượng lớn." },
    { term: "SHA-256", de: "Kryptografische Hash-Funktion, die Bitcoin verwendet • Sehr sicher.", en: "Cryptographic hash function used by Bitcoin • Extremely secure.", vi: "Hàm băm mật mã mà Bitcoin sử dụng • Cực kỳ an toàn." },
    { term: "Hashrate", de: "Gesamte Rechenleistung des Bitcoin-Netzwerks • Maß für die Sicherheit.", en: "Total computing power of the Bitcoin network • Measure of security.", vi: "Tổng sức mạnh tính toán của mạng Bitcoin • Đo lường mức độ an toàn." },
    { term: "Merkle Root", de: "Hash aller Transaktionen in einem Block • Ermöglicht effiziente Überprüfung.", en: "Hash of all transactions in a block • Allows efficient verification.", vi: "Hash của tất cả giao dịch trong khối • Cho phép kiểm tra hiệu quả." },
    { term: "Elliptic Curve", de: "Mathematische Kurve, auf der die Kryptografie von Bitcoin basiert (ECDSA).", en: "Mathematical curve on which Bitcoin's cryptography is based (ECDSA).", vi: "Đường cong elliptic mà mật mã Bitcoin dựa vào (ECDSA)." },
    { term: "Orphan Block", de: "Gültiger Block, der nicht in die längste Kette aufgenommen wurde.", en: "Valid block that was not included in the longest chain.", vi: "Khối hợp lệ nhưng không nằm trong chuỗi dài nhất." },
    { term: "Seed Phrase", de: "12–24 Wörter Backup • Wiederherstellung auf jedem Gerät.", en: "12–24 word backup • Recover on any device.", vi: "Cụm từ khôi phục 12–24 từ." },
    { term: "Difficulty", de: "Automatisch angepasste Mining-Schwierigkeit alle 2016 Blöcke, ca. 14 Tage.", en: "Automatically adjusted mining difficulty every 2016 blocks, approx. 14 days", vi: "Độ khó khai thác được tự động điều chỉnh sau mỗi 2016 khối, khoảng 14 ngày." },
    { term: "UTXO (Unspent Transaction Output)", de: "Nicht ausgegebene Guthaben • Wie einzelne Münzen.", en: "Unspent funds • Like individual coins.", vi: "Số dư chưa chi tiêu." },
    { term: "SegWit", de: "Upgrade für mehr Transaktionen pro Block.", en: "Upgrade for more transactions per block.", vi: "Nâng cấp tăng giao dịch mỗi khối." },
    { term: "Taproot", de: "2021 Upgrade • Mehr Privatsphäre & Smart Contracts.", en: "2021 upgrade • Better privacy & smart contracts.", vi: "Nâng cấp 2021 • Quyền riêng tư tốt hơn." },
    { term: "DIP", de: "Preisrückgang • Gute Kaufgelegenheit.", en: "Price drop • Good buying opportunity.", vi: "Giảm giá tạm thời." },
    { term: "DYOR", de: "Do Your Own Research – eigene Recherche machen.", en: "Do Your Own Research.", vi: "Tự nghiên cứu." }
  ]

  const filteredTerms = bitictionary
    .filter((item): item is DictionaryItem => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[language].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  // Live Daten + Chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockRes = await fetch('https://mempool.space/api/blocks/tip/height')
        if (blockRes.ok) setBlockHeight(parseInt(await blockRes.text()))

        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,vnd')
        if (priceRes.ok) {
          const data = await priceRes.json()
          setBtcPrice(data.bitcoin)
        }

        const historyRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=vnd&days=365&interval=daily')
        if (historyRes.ok) {
          const historyData = await historyRes.json()
          const prices = historyData.prices.map((item: [number, number]) => item[1])
          setPriceHistory(prices)
        }
      } catch (e) {
        console.error("API Fehler:", e)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  const t = {
    de: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", bitictionary: "Bitictionary" },
    en: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", bitictionary: "Bitictionary" },
    vi: { title: "₿itCoffee", subtitle: "Đà Nẵng • Việt Nam", bitictionary: "Bitictionary" }
  }[language]

  const generateChartPoints = () => {
    if (priceHistory.length < 5) return "20,65 520,65";
    const max = Math.max(...priceHistory);
    const min = Math.min(...priceHistory);
    const range = max - min || 1;
    const points = priceHistory.map((price, index) => {
      const x = 20 + (index / (priceHistory.length - 1)) * 480;
      const y = 70 - ((price - min) / range) * 55;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return points;
  }

  // Breiten
  const containerMaxWidth = viewMode === 'pad' ? '3000px' : '620px';
  const innerMaxWidth = viewMode === 'pad' ? '100%' : '460px';

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
        maxWidth: containerMaxWidth,
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative'
      }}>
        
        <div style={{ maxWidth: innerMaxWidth, margin: '0 auto', position: 'relative' }}>

          {/* Hero Bild + Button */}
          <div style={{ position: 'relative' }}>
            <img 
              src="/bitcoffee-hero.png" 
              alt="BitCoffee" 
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '0 0 16px 16px' }} 
            />
            
            <button 
              onClick={() => setViewMode(viewMode === 'phone' ? 'pad' : 'phone')}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '8px 14px',
                fontSize: '0.9rem',
                background: 'rgba(245, 158, 11, 0.25)',
                color: '#111',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}
            >
              {viewMode === 'phone' ? '📱 Phone' : '📟 Pad'}
            </button>
          </div>

          {/* Sprachen */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1.5rem 0' }}>
            {(['de','en','vi'] as const).map(l => (
              <button key={l} onClick={() => setLanguage(l)} 
                style={{ padding: '6px 14px', borderRadius: '9999px', background: language === l ? '#f59e0b' : '#333', color: language === l ? '#111' : 'white' }}>
                {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
              </button>
            ))}
          </div>

          {/* Logo + Kontakt */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.8rem', marginBottom: '0.3rem' }}>☕</div>
            <h1 style={{ fontSize: '2.9rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
              <span style={{ color: '#f59e0b', display: 'inline-block', transform: 'rotate(12deg)', marginRight: '-3px' }}>₿</span>
              <span style={{ color: '#f59e0b' }}>it</span>
              <span style={{ color: 'white' }}>Coffee</span>
            </h1>
            <p style={{ color: '#f59e0b' }}>{t.subtitle}</p>

            <div style={{ fontSize: '1rem', color: '#ddd', lineHeight: '1.6', marginTop: '1rem' }}>
              <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} onClick={() => window.open('https://maps.google.com/?q=DEINE_VOLLE_ADRESSE_HIER', '_blank')}>📍 [Deine volle Adresse hier]</p>
              <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} onClick={() => window.open('tel:+849XXXXXXXXX')}>📞 [+84 9XX XXX XXX]</p>
              <p style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/21BitCoffee', '_blank')}>𝕏 @21BitCoffee</p>
            </div>
          </div>

          {/* Bitictionary Titel */}
          <div style={{ textAlign: 'center', margin: '2rem 0 1.5rem 0' }}>
            <h2 style={{ color: '#f59e0b', fontSize: '1.8rem' }}>{t.bitictionary}</h2>
          </div>

          {/* Bitictionary */}
          <div style={{ width: '100%', background: '#1a1a1a', padding: '1.8rem', borderRadius: '16px' }}>
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

          {/* Live Chart */}
          <div style={{ width: '100%', marginTop: '2.5rem', background: '#1a1a1a', padding: '1.8rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #f59e0b' }}>
            <div>Block Height: <span style={{ color: '#f59e0b' }}>{blockHeight ? `#${blockHeight.toLocaleString()}` : 'Laden...'}</span></div>
            <div style={{ marginTop: '6px', color: '#f59e0b', fontWeight: '600' }}>
              BTC: {btcPrice ? `$${btcPrice.usd.toLocaleString()} • €${btcPrice.eur.toLocaleString()} • ₫${(btcPrice.vnd/1000000000).toFixed(2)}B` : 'Laden...'}
            </div>

            <div style={{ margin: '16px 0 10px 0', minHeight: '90px' }}>
              {priceHistory.length > 5 ? (
                <svg width="100%" height="90" viewBox="0 0 520 90" style={{ filter: 'drop-shadow(0 4px 15px #f59e0b)' }}>
                  <polyline points={generateChartPoints()} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points={generateChartPoints()} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                </svg>
              ) : (
                <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>Lade Bitcoin Chart...</div>
              )}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#f59e0b' }}>1-Year Bitcoin Chart</div>
          </div>

          {/* Copyright */}
          <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.85rem' }}>
            Copyright © <span style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/BitcoinZeit', '_blank')}>BitcoinZeit</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App