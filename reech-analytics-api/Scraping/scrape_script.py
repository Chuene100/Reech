import csv
import requests
import random

#url = 'https://za.indeed.com/jobs?q=data%20engineer&l=johannesburg%2C%20gauteng' 
url = "https://za.indeed.com/viewjob?jk=f4e14f6cd97f19f5&from=tp-sponfirstjob&tk=1h3hlfrh6lgap800&viewtype=embedded&advn=5404776885157339&adid=410303135&ad=-6NYlbfkN0A_kYjPb70ehwA2c5bnZzv7Do-wGLiB5KNfbXgvtW-E_xGL3YLbbwgKQCvEUscindDi9iLj6AlxtLestEyL2KqWcwWiCmPv6ukXQHpVBQVzxE1QzFImjg4OVSGASOIKUUe1yvK0JJJhIFm_4xVFzEUvRZ5MhlBThW7wYblXAIfQUS9A-Qb0IDgPqavUVmDbVKDlgZuaTr4x0RbFgC1yeLr0VDk4w9etkkBsiDtVv7uwe7a5FERf1l8dAIeN52AvSb4dKYFmtNnRXCJ0FaJ257y5xgPCkTvmjfMO08uGPTj1yoRQ9yZpevPA5WfjaItTqWJ2u1NZ0QqF1Fa7JFvneFBHQ4nijDEmugYfWJ5CLpIkiWjYmtkbe8V8kNgs32jjoLW83FZtXg3iz9Tdxr1GCDufo7EH1S52--s3Xj-0hA1k6CDewJFbyQxtOn7hZq59wp4JRupW-_n-wa4vDEoFpNR7s122FEYrLLKwxwK3ukqIP-yLxJyzGAkSvQCBfgFUiXILJrC4Umn0psXQXNZT1ywnD2IgqSl-Fxk2-sOGtfL0TFKtWOEAHjUdeDadNH19XdPKQ3Ln8oAddn6lEUe033jU&xkcb=SoDc-_M3OxiwrVRuXZ0LbzkdCdPP&continueUrl=%2Fjobs%3Fq%3Ddata%2Bengineer%26mGrp%3D-1%26l%3Djohannesburg%252C%2Bgauteng&spa=1&hidecmpheader=0"
 
proxy_file = 'proxylist.csv'  
output_file = 'output.csv'  

user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0'
]



# Read proxies from CSV file
proxylist = []
with open(proxy_file, 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        if row:
            proxylist.append(row[0])

results = []

for proxy in proxylist:
    for user_agent in user_agents:
        proxies = {
            'http': proxy,
            'https': proxy
        }

        headers = {
                'authority': 'za.indeed.com',
                'Accept': 'application/json',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'referer': 'https://za.indeed.com/jobs?q=data%20engineer&l=johannesburg%2C%20gauteng',
                #'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                'sec-ch-ua-mobile': '?0',
                #'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': random.choice(user_agents)
}

        try:
            response = requests.get(url, headers=headers, proxies=proxies)

            if response.status_code == 200:
                data = response.json()

                # Extract the desired fields from the JSON data
                job_title = data['job_title']
                job_type = data['job_type']
                company_name = data['company_name']
                salary = data['salary']
                skills = data['skills']
                education = data['education']
                location = data['location']
                experience = data['experience']
                industry = data['industry']

                result = (job_title, job_type, company_name, salary, skills, education, location, experience, industry)
                results.append(result)

        except requests.exceptions.RequestException as e:
            print(f"Error occurred while making a request with proxy {proxy} and user agent {user_agent}: {e}")

# Write the results to a CSV file
with open(output_file, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['Job Title', 'Job Type', 'Company Name', 'Salary', 'Skills', 'Education', 'Location', 'Experience', 'Industry'])
    writer.writerows(results)