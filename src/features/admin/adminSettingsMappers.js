/** Map backend vehicle rate row */
export function mapAdminSettingsVehicleRate(rate) {
  return {
    id: rate.id,
    vehicle: rate.vehicle,
    perKmCharge: Number(rate.perKmCharge) || 0,
  }
}

/** Map backend settings payload */
export function mapAdminSettings(settings) {
  if (!settings) return null

  return {
    vehicleRates: (settings.shipping?.vehicleRates ?? []).map(
      mapAdminSettingsVehicleRate,
    ),
    vatDefaultRate: Number(settings.vat?.defaultRate) || 0,
    auction: {
      hours: Number(settings.auction?.hours) || 0,
      minutes: Number(settings.auction?.minutes) || 0,
    },
  }
}

export function toAdminSettingsShippingPayload(vehicleRates) {
  return {
    vehicleRates: vehicleRates.map((rate) => ({
      id: rate.id,
      perKmCharge: Number(rate.perKmCharge) || 0,
    })),
  }
}

export function vehicleRatesEqual(left, right) {
  if (left.length !== right.length) return false

  return left.every((rate, index) => {
    const other = right[index]
    return (
      rate.id === other?.id &&
      Number(rate.perKmCharge) === Number(other?.perKmCharge)
    )
  })
}
