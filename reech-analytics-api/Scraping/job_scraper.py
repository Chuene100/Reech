import argparse
from selenium import webdriver
from shutil import which
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, ElementNotInteractableException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time
import re


'''
To run the script: 

- python job_scraper.py "Data Engineer" 1

- Install the chromedriver and put in a directory

'''


def fetch_jobs(keyword, num_pages):
    options = Options()
    options.add_argument("window-size=1920,1080")
    #Enter your chromedriver.exe path below
    chrome_path = '/usr/local/bin/chromedriver'
    driver = webdriver.Chrome(executable_path=chrome_path, options=options)
    driver.get("https://www.glassdoor.co.in/Job/Home/recentActivity.htm")
    search_input = driver.find_element_by_id("sc.keyword")
    search_input.send_keys(keyword)
    search_input.send_keys(Keys.ENTER)
    time.sleep(2)
    
    
    
    
    company_name = []
    job_title = []
    job_type = []
    salary_est = []
    location = []
    job_description = []
    salary_estimate = []
    company_size = []
    company_type = []
    company_sector = []
    company_industry = []
    company_founded = []
    company_revenue = []
    education = []
    certifications = []
    technical_skills = []
    
    
    
    #Set current page to 1
    current_page = 1     
        
        
    time.sleep(3)
    
    while current_page <= num_pages:   
        
        done = False
        while not done:
            job_cards = driver.find_elements_by_xpath("//article[@id='MainCol']//ul/li[@data-adv-type='GENERAL']")
            for card in job_cards:
                card.click()
                time.sleep(1)

                #Closes the signup prompt
                try:
                    driver.find_element_by_xpath(".//span[@class='SVGInline modal_closeIcon']").click()
                    time.sleep(2)
                except NoSuchElementException:
                    time.sleep(2)
                    pass


                # Start scraping 

                try:
                    company_name.append(driver.find_element_by_xpath("//div[@class='css-87uc0g e1tk4kwz1']").text)
                except:
                    company_name.append("#N/A")
                    pass

                try:
                    job_title.append(driver.find_element_by_xpath("//div[@class='css-1vg6q84 e1tk4kwz4']").text)
                except:
                    job_title.append("#N/A")
                    pass
                
                try:
                    #job_title.append(driver.find_element_by_xpath("//div[@class='css-1j389vi e1tk4kwz2']").text)
                    #job_title.append(driver.find_element_by_xpath("//*[@id="JDCol"]/div/article/div/div[1]/div/div/div[1]/div[3]/div[1]/div[2]").text)
                    job_type.append(driver.find_element_by_xpath("//div[contains(@class, 'jobDescriptionContent desc')]//p[contains(text(), 'Job Type')/following-sibling::p]").text)
                except:
                    job_type.append("#N/A")
                    pass

                try:
                    location.append(driver.find_element_by_xpath("//div[@class='css-56kyx5 e1tk4kwz5']").text)
                except:
                    location.append("#N/A")
                    pass

                try:
                    job_description.append(driver.find_element_by_xpath("//div[@id='JobDescriptionContainer']").text)
                except:
                    job_description.append("#N/A")
                    pass

                try:
                    #salary_estimate.append(driver.find_element_by_xpath("//div[contains(@id, 'JobDesc')]/div[contains(@class,    'jobDescriptionContent')]//p[contains(text(), 'Salary')]").text)
                    time.sleep(2)
                    salary_estimate.append(driver.find_element_by_xpath(".//div[@class='p-std css-1k5huso e856ufb0']//p[contains(text(), 'Salary')]//following-sibling::*").text.strip())
                    #salary_estimate.append(driver.find_element_by_css_selector("#JobDesc1008577123062 ").text)
                    #salary_estimate.append(driver.find_element_by_xpath("//div[contains(@class, 'jobDescriptionContent') and contains(@class, 'desc')]//*[contains(text(), 'Salary')]").text)
                    
                    # Wait for the element to be visible
                    #wait = WebDriverWait(driver, 10)
                    #element = wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'jobDescriptionContent') and contains(@class, 'desc')]//*[contains(text(), 'Salary')]")))

                    # Extract the text
                    #salary_estimate.append(element.text)
                    
                    #salary_estimate.append(driver.find_element_by_xpath("//div[contains(@class, 'jobDescriptionContent')]/p[contains(text(), 'Salary')]//following-sibling::*").text)
                    
                    #salary_text = driver.find_element_by_xpath('//*[contains(text(), "Salary")]/following-sibling::*').text.strip()
                   # salary_text = driver.find_element_by_xpath('//*[@id="JobDesc1008577123062"]//following-sibling::*').text.strip()
                    #salary_value = re.search(r'\d+', salary_text).group()
                    #salary_estimate.append(salary_text)
                    
                    #salary_estimate.append(driver.find_element_by_xpath("//div[contains(@id, 'JobDesc')]/following-sibling::div//p[contains(text(), 'Salary')]").text)
                except:
                    salary_estimate.append("#N/A")
                    pass
                
                try:
                    company_size.append(driver.find_element_by_xpath("//div[@id='CompanyContainer']//span[text()='Size']//following-sibling::*").text)
                except:
                    company_size.append("#N/A")
                    pass
                
                try:
                    company_type.append(driver.find_element_by_xpath("//div[@id='CompanyContainer']//span[text()='Type']//following-sibling::*").text)
                except:
                    company_type.append("#N/A")
                    pass
                    
                try:
                    company_sector.append(driver.find_element_by_xpath("//div[@id='CompanyContainer']//span[text()='Sector']//following-sibling::*").text)
                except:
                    company_sector.append("#N/A")
                    pass
                    
                try:
                    company_industry.append(driver.find_element_by_xpath("//div[@id='CompanyContainer']//span[text()='Industry']//following-sibling::*").text)
                except:
                    company_industry.append("#N/A")
                    pass
                    
                try:
                    company_founded.append(driver.find_element_by_xpath("//div[@id='CompanyContainer']//span[text()='Founded']//following-sibling::*").text)
                except:
                    company_founded.append("#N/A")
                    pass
                    
                try:
                    company_revenue.append(driver.find_element_by_xpath("//div[@id='CompanyContainer']//span[text()='Revenue']//following-sibling::*").text)
                except:
                    company_revenue.append("#N/A")
                    pass
                
                try:
                    education.append(driver.find_element_by_xpath("//div[contains(@class, 'jobDescriptionContent')]/p[contains(text(), 'degree')]//following-sibling::*").text)
                except:
                    education.append("#N/A")
                    pass
                
                try:
                    certifications.append(driver.find_element_by_xpath("//div[contains(@class, 'jobDescriptionContent')]/p[contains(text(), 'certification')]//following-sibling::*").text)
                except:
                    certifications.append("#N/A")
                    pass
                
                try:
                    technical_skills.append(driver.find_element_by_xpath("//div[contains(@class, 'jobDescriptionContent')]/p[contains(text(), 'skills')]//following-sibling::*").text)
                except:
                    technical_skills.append("#N/A")
                    pass
                    
                
                    
                    
                done = True
                
       # Moves to the next page         
        if done:
            print(str(current_page) + ' ' + 'out of' +' '+ str(num_pages) + ' ' + 'pages done')
            driver.find_element_by_xpath("//span[@alt='next-icon']").click()   
            current_page = current_page + 1
            time.sleep(4)
            




    driver.close()
    df = pd.DataFrame({'company': company_name, 
    'job title': job_title,
    'job type': job_type,
    'location': location,
    'job description': job_description,
    'salary estimate': salary_estimate,
    'company_size': company_size,
    'company_type': company_type,
    'company_sector': company_sector,
    'company_industry' : company_industry,
    'company_founded' : company_founded, 
    'company_revenue': company_revenue,
    'education': education,
    'certifications': certifications,
    'technical_skills': technical_skills})
    
    #df.to_csv(keyword + '.csv')
    return df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Glassdoor Job Scraper")
    parser.add_argument("keyword", type=str, help="Keyword for job search")
    parser.add_argument("num_pages", type=int, help="Number of pages to scrape")
    args = parser.parse_args()

    data = fetch_jobs(args.keyword, args.num_pages)
    print(data)