from supabase import create_client
import os

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(url, key)


def save_analysis(report_id, ml_result):
    data = {
        "report_id": report_id,
        "summary": ml_result["summary"],
        "predicted_diseases": ml_result["predicted_diseases"],
        "abnormal_values": ml_result["abnormal_values"],
        "confidence_score": ml_result["confidence"]
    }

    supabase.table("analysis_results").insert(data).execute()
