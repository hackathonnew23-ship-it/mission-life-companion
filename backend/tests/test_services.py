from app import services as s


def test_footprint_total():
    f = s.footprint(250, 1, 12, "bike", "veg")
    assert round(f.total, 1) == round(250 * .82 + 42.6 + 12 * 26 * .05 + 50, 1)


def test_solar_subsidy_capped():
    assert s.solar_estimate("Surat", 600, 100)["subsidy"] <= 78_000
