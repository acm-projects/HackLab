import sys
import json
from linkedin_scraper import Person, actions
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Read command-line arguments
linkedin_url = sys.argv[1]
email = sys.argv[2]
password = sys.argv[3]

# Set up Selenium WebDriver with headless mode
options = Options()
options.add_argument("--headless")  # Run Chrome in the background
options.add_argument("--disable-gpu")  # Disables GPU hardware acceleration (optional)
options.add_argument("--no-sandbox")  # Helps when running on some server environments
options.add_argument("--disable-dev-shm-usage")  # Prevents crashes in Docker containers

driver = webdriver.Chrome(options=options)

try:
    # Log in to LinkedIn
    actions.login(driver, email, password)

    # Scrape LinkedIn profile
    person = Person(linkedin_url, driver=driver)

    # Extract required fields
    data = {
        "name": person.name,
        "experiences": [vars(e) for e in person.experiences],
        "educations": [vars(e) for e in person.educations],
        "accomplishments": person.accomplishments,
        "company": person.company,
        "job_title": person.job_title
    }

    # Print JSON output
    print(json.dumps(data))

except Exception as e:
    # Print error message in JSON format
    print(json.dumps({ "error": str(e) }))

finally:
    # Close the WebDriver
    driver.quit()
