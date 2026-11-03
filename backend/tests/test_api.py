from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_footprint_validation_rejects_bad_mode():
    r = client.post("/v1/footprint", json={"units": 100, "lpg": 1, "km_per_day": 5, "mode": "rocket", "diet": "veg"})
    assert r.status_code == 422


def test_solar_unknown_city():
    r = client.post("/v1/solar/estimate", json={"city": "Atlantis", "units": 200, "roof_m2": 30})
    assert r.status_code == 422
