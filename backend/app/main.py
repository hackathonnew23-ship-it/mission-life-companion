from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from . import services as s

app = FastAPI(title="Mission LiFE API", version="0.1.0")
# Prototype: open CORS so the static frontend can call the API. Restrict origins in production.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class FootprintIn(BaseModel):
    units: float = Field(ge=0)
    lpg: float = Field(ge=0)
    km_per_day: float = Field(ge=0)
    mode: Literal["car", "bike", "bus", "metro", "walk"]
    diet: Literal["veg", "mix", "non"]


class SolarIn(BaseModel):
    city: str
    units: float = Field(gt=0)
    roof_m2: float = Field(gt=0)
    tariff: float = Field(default=6.5, gt=0)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/v1/footprint")
def calc_footprint(body: FootprintIn):
    f = s.footprint(body.units, body.lpg, body.km_per_day, body.mode, body.diet)
    return {**f.__dict__, "total": f.total}


@app.post("/v1/solar/estimate")
def calc_solar(body: SolarIn):
    if body.city not in s.YIELD_KWH_PER_KW:
        raise HTTPException(422, f"Unsupported city. Use one of {list(s.YIELD_KWH_PER_KW)}")
    return s.solar_estimate(body.city, body.units, body.roof_m2, body.tariff)
