import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#FAF9F6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'serif',
          border: '12px solid #1A1A1A',
          boxSizing: 'border-box',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '6px',
              backgroundColor: '#CC2200',
            }}
          />
          <span
            style={{
              fontSize: '13px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#888',
            }}
          >
            Itapoá · Santa Catarina · Brasil
          </span>
          <div
            style={{
              width: '48px',
              height: '6px',
              backgroundColor: '#CC2200',
            }}
          />
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: '#1A1A1A',
              marginBottom: '28px',
            }}
          />
          <span
            style={{
              fontSize: '108px',
              fontWeight: 900,
              color: '#1A1A1A',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            The Itapoá
          </span>
          <span
            style={{
              fontSize: '108px',
              fontWeight: 900,
              color: '#CC2200',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            Times
          </span>
          <div
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: '#1A1A1A',
              marginTop: '28px',
            }}
          />
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#555',
            }}
          >
            Portal de notícias independente de Itapoá, SC
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
