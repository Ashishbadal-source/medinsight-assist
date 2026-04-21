import json
from pathlib import Path

from gatekeeper import ECGGatekeeper


IMAGE_CASES = [
    {
        "name": "ecg_001",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_001-e789079d-4252-44d8-8c52-cf965a646a69.png",
        "expected_is_ecg": True,
    },
    {
        "name": "ecg_5",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_5-e01e7977-a2d0-4e91-99c3-cedd08be26b2.png",
        "expected_is_ecg": True,
    },
    {
        "name": "ecg_4",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_4-50f625f5-c0bb-41c1-a5dd-a40efad0c0ab.png",
        "expected_is_ecg": True,
    },
    {
        "name": "ecg_6_blank",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_6-edcf9ba6-20e2-4ea2-ad93-2fe26d60e493.png",
        "expected_is_ecg": False,
    },
    {
        "name": "mod_x_grid",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_mod_x_grid-7c7d0ec7-cc3b-4a3d-9433-516e5b7d3d99.png",
        "expected_is_ecg": False,
    },
    {
        "name": "single_graph",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_single_graph-745230e3-bb15-464d-9f4c-36664e4fb739.png",
        "expected_is_ecg": False,
    },
    {
        "name": "test1_circle_noise",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_test1-077b8c1b-e262-4e5f-ac9b-f2a96544d5e7.png",
        "expected_is_ecg": False,
    },
    {
        "name": "person",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_person-9dd8ccbf-0fa9-444a-ae36-f8045378e8b9.png",
        "expected_is_ecg": False,
    },
    {
        "name": "noise",
        "path": r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_noise-4935b9e1-3aa1-4098-ba92-910b3af40259.png",
        "expected_is_ecg": False,
    },
]


def run_all():
    gatekeeper = ECGGatekeeper()
    results = []
    all_ok = True

    for case in IMAGE_CASES:
        image_path = case["path"]
        exists = Path(image_path).exists()
        if not exists:
            res = {"is_ecg": False, "confidence": 0.0, "error": "image_not_found"}
        else:
            res = gatekeeper.decide(image_path)

        got = bool(res.get("is_ecg", False))
        expected = bool(case["expected_is_ecg"])
        ok = got == expected
        all_ok = all_ok and ok

        results.append(
            {
                "name": case["name"],
                "path": image_path,
                "exists": exists,
                "expected_is_ecg": expected,
                "got_is_ecg": got,
                "ok": ok,
                "confidence": float(res.get("confidence", 0.0)),
                "reason": res.get("reason"),
                "error": res.get("error"),
                "breakdown": res.get("breakdown"),
            }
        )

    payload = {
        "summary": {
            "total": len(results),
            "passed": sum(1 for r in results if r["ok"]),
            "failed": sum(1 for r in results if not r["ok"]),
            "all_ok": all_ok,
        },
        "results": results,
    }

    out_path = Path(__file__).resolve().parent / "external_test_results.json"
    out_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return out_path


if __name__ == "__main__":
    path = run_all()
    print(str(path))

