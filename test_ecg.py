from ecg_pipeline.run_pipeline import process_ecg_image
def main():
    image_path = "ecg_pipeline/data/raw_images/ecg_001.png"

    result = process_ecg_image(image_path)

    print("\n================ RESULT ================")
    print("Status:", result["status"])

    if result["status"] == "success":
        print("ECG Shape:", result["ecg"].shape)
    else:
        print("Reasons:", result.get("reasons"))


if __name__ == "__main__":
    main()