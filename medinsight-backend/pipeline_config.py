# pipeline_config.py
# Master Switch for ECG Digitization Pipelines

# Options:
# "old"   -> Legacy Pipeline (Basic)
# "new"   -> Beta Pipeline (CNN based)
# "final" -> MedInsight Final Pipeline (Medical Grade 98% Accuracy, 13-Leads)
ACTIVE_PIPELINE = "final"
