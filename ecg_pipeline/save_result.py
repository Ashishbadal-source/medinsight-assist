import psycopg2

def save_ecg_result(image_name, prediction, confidence):
    conn = psycopg2.connect(
        host="localhost",
        database="ecgdb",
        user="postgres",
        password="password"
    )
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO ecg_results (image_name, prediction, confidence)
        VALUES (%s, %s, %s)
        """,
        (image_name, prediction, confidence)
    )

    conn.commit()
    cur.close()
    conn.close()
