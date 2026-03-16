def validate(ecg, expected_leads=12):
    assert ecg.shape[0] == expected_leads
