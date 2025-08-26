import { GeneralSettings } from "@/components/settings/general-settings"
import { EnergyRatesSettings } from "@/components/settings/energy-rates-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <GeneralSettings />
      <EnergyRatesSettings />
    </div>
  )
}
