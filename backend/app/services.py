"""Pure business logic (no I/O) so it is trivially unit-testable."""
from dataclasses import dataclass

GRID_EF = 0.82  # kg CO2 per kWh (India grid average, indicative)
LPG_EF = 42.6   # kg CO2 per 14.2 kg cylinder
TRANSPORT_EF = {"car": 0.17, "bike": 0.05, "bus": 0.05, "metro": 0.03, "walk": 0.0}
DIET_KG = {"veg": 50, "mix": 90, "non": 130}
YIELD_KWH_PER_KW = {"Ahmedabad": 1500, "Gandhinagar": 1500, "Surat": 1450,
                    "Vadodara": 1480, "Rajkot": 1550, "Bhuj": 1600}


@dataclass(frozen=True)
class Footprint:
    electricity: float
    lpg: float
    transport: float
    diet: float

    @property
    def total(self) -> float:
        return self.electricity + self.lpg + self.transport + self.diet


def footprint(units: float, lpg: float, km_per_day: float, mode: str, diet: str) -> Footprint:
    return Footprint(units * GRID_EF, lpg * LPG_EF,
                     km_per_day * 26 * TRANSPORT_EF[mode], DIET_KG[diet])


def solar_estimate(city: str, units: float, roof_m2: float, tariff: float = 6.5,
                   cost_per_kw: float = 60_000) -> dict:
    y = YIELD_KWH_PER_KW[city]
    kw = max(1.0, min(round(units * 12 / y * 2) / 2, (roof_m2 // 5) / 2))
    gen = kw * y
    cost = kw * cost_per_kw
    subsidy = min(kw, 2) * 30_000 + (min(kw, 3) - 2) * 18_000 * (kw > 2)  # indicative PM Surya Ghar
    saving = min(gen, units * 12) * tariff
    return {"kw": kw, "yearly_kwh": gen, "cost": cost, "subsidy": subsidy,
            "yearly_saving": saving, "payback_years": (cost - subsidy) / saving,
            "co2_tonnes": gen * GRID_EF / 1000}
