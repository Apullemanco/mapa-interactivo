import { QRCodeSVG } from 'qrcode.react'

export function QrPanel({ url }: { url: string }) {
  const display = url.replace(/^https?:\/\//, '')
  return (
    <div className="qr-card flex items-center gap-4 rounded-2xl p-3.5">
      <div className="shrink-0 rounded-xl bg-foreground p-2.5">
        <QRCodeSVG
          value={url}
          size={128}
          bgColor="#eef2e6"
          fgColor="#0b2620"
          level="M"
          title="Código QR para registrar tu ciudad"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="font-heading text-2xl font-semibold leading-tight text-balance">
          Escanea y siembra tu ciudad
        </p>
        <p className="truncate text-sm text-muted-foreground">{display}</p>
      </div>
    </div>
  )
}
