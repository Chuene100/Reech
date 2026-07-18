import requests

import os
API_URL = os.environ.get("HUGGING_FACE_API_URL", "")
headers = {"Authorization": f"Bearer {os.environ['HUGGING_FACE_TOKEN']}"}



def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def gen_job_description(job_title):
    output = query({
        "inputs": "The job description for a {} is:\n".format(job_title),
        "parameters": {"do_sample": False},
    })
    output = output[0]['generated_text'].split('\n')[1]
    return output


def main():
    print(gen_job_description('marine biologist'))


if __name__ == "__main__":
    main()
