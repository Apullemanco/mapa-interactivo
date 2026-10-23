import { QRCodeSVG } from 'qrcode.react'

export function QrPanel({ url }: { url: string }) {
  return (
    <div className="qr-card flex items-center gap-4 rounded-2xl p-3.5">
      <div className="shrink-0 rounded-xl bg-[#063b4a] p-2.5 shadow-[0_0_24px_rgba(18,190,216,0.18)]">
        <QRCodeSVG
          value={url}
          size={128}
          bgColor="#b8f3f2"
          fgColor="#063b4a"
          level="M"
          title="Código QR para registrar tu ciudad"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="font-heading text-2xl font-semibold leading-tight text-balance">
          Registra tu ciudad
        </p>
      </div>
    </div>
  )
}
