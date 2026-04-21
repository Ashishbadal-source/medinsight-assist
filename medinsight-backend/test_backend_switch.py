# test_backend_switch.py
import os
import sys
import asyncio
from pathlib import Path

# Setup paths
ROOT = Path(__file__).parent
sys.path.append(str(ROOT))
sys.path.append(str(ROOT / "backend"))

import pipeline_config
from backend.app import main

async def test_integration():
    print(f"🔍 Testing Master Switch. Active Mode: {pipeline_config.ACTIVE_PIPELINE}")
    
    # 1. Simulate Startup
    print("🎬 Initializing Backend Startup...")
    await main.startup_event()
    
    # 2. Verify Pipeline Instance
    if pipeline_config.ACTIVE_PIPELINE == "final":
        if hasattr(main, "_final_pipeline") and main._final_pipeline is not None:
            print("✅ SUCCESS: Final Pipeline is HOT and READY.")
        else:
            print("❌ ERROR: Final Pipeline failed to initialize.")
            return

    # 3. Test a mock file processing
    test_img = r"C:\Users\dell\.cursor\projects\c-Users-dell-OneDrive-Desktop-Complete\assets\c__Users_dell_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_ecg_4-50f625f5-c0bb-41c1-a5dd-a40efad0c0ab.png"
    
    print(f"🧪 Processing test image via Backend logic: {os.path.basename(test_img)}")
    
    # We call the internal process directly as it's used in the endpoint
    result = main._final_pipeline.process(test_img)
    
    if result["success"]:
        print(f"🏆 TEST PASSED!")
        print(f"   - Pipeline used: {pipeline_config.ACTIVE_PIPELINE}")
        print(f"   - Confidence: {result['overall_confidence']}")
        print(f"   - Leads Found: {len(result['signals'])}")
    else:
        print(f"❌ TEST FAILED: {result.get('error')}")

if __name__ == "__main__":
    asyncio.run(test_integration())
