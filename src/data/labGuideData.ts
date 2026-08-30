import { LabTaskGuide } from "../types";

export const GSP517_LAB_DATA: LabTaskGuide[] = [
  {
    id: 1,
    title: "Task 1: Use cURL to test a prompt with the API",
    shortDesc: "Open Workbench JupyterLab in Agent Platform, open prompt.ipynb, and update cell 5 with the low-sodium Japanese chef prompt.",
    instructions: [
      "In Google Cloud Console, navigate to Vertex AI / Agent Platform > Workbench / Notebooks.",
      "Open your Workbench JupyterLab instance in a new browser tab.",
      "In the File Browser, open prompt.ipynb and select the Python 3 (Local) kernel.",
      "Locate Cell 5 (the cURL execution cell) and replace the prompt with the low-sodium Japanese recipe prompt.",
      "If you receive a 404 region error, navigate to Cell 3 and set the LOCATION variable to your lab's assigned region (e.g., us-central1) instead of 'global'.",
      "Execute all cells in prompt.ipynb, verify the response, save the notebook, and click 'Check my progress'."
    ],
    codeSnippets: [
      {
        filename: "prompt.ipynb (Cell 5 - cURL Command)",
        language: "bash",
        description: "The exact prompt text to paste into cell 5 in prompt.ipynb:",
        code: `I am a Chef.  I need to create Japanese recipes for customers who want low sodium meals. However, I do not want to include recipes that use ingredients associated with a peanuts food allergy. I have ahi tuna, fresh ginger, and edamame in my kitchen and other ingredients. The customer wine preference is red. Please provide some for meal recommendations. For each recommendation include preparation instructions, time to prepare and the recipe title at the beginning of the response. Then include the wine paring for each recommendation. At the end of the recommendation provide the calories associated with the meal and the nutritional facts.`
      },
      {
        filename: "cURL Terminal Equivalent",
        language: "bash",
        description: "Full curl command structure used by the JupyterLab notebook:",
        code: `curl -X POST \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/$LOCATION/publishers/google/models/gemini-1.5-flash:generateContent \\
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{
        "text": "I am a Chef.  I need to create Japanese recipes for customers who want low sodium meals. However, I do not want to include recipes that use ingredients associated with a peanuts food allergy. I have ahi tuna, fresh ginger, and edamame in my kitchen and other ingredients. The customer wine preference is red. Please provide some for meal recommendations. For each recommendation include preparation instructions, time to prepare and the recipe title at the beginning of the response. Then include the wine paring for each recommendation. At the end of the recommendation provide the calories associated with the meal and the nutritional facts."
      }]
    }]
  }'`
      }
    ],
    verificationTip: "Make sure all notebook cells run without errors and cell 5 outputs Japanese meal recommendations with wine pairings and calories before clicking Check My Progress."
  },
  {
    id: 2,
    title: "Task 2: Write Streamlit framework and prompt Python code in chef.py",
    shortDesc: "Clone generative-ai repository, download chef.py, add the wine radio button, insert the Gemini prompt with f-string variables, and upload to the GCS bucket.",
    instructions: [
      "Open Cloud Shell and clone the GoogleCloudPlatform generative-ai repository.",
      "Navigate to the directory: generative-ai/gemini/sample-apps/gemini-streamlit-cloudrun",
      "Add 'google-cloud-logging' to requirements.txt",
      "Download the initial chef.py from the Cloud Storage path specified in your lab instructions.",
      "Update chef.py with your Project ID and Gemini model ID.",
      "Add the Streamlit radio button for the 'wine' variable with options: 'Red', 'White', 'None'.",
      "Insert the parameterized f-string prompt into chef.py.",
      "Upload the updated chef.py to your lab's GCS bucket using: gcloud storage cp chef.py gs://<YOUR_LAB_BUCKET>/"
    ],
    codeSnippets: [
      {
        filename: "Cloud Shell Commands (Setup & Clone)",
        language: "bash",
        description: "Clone repo, navigate to directory, and append logging dependency:",
        code: `git clone https://github.com/GoogleCloudPlatform/generative-ai.git
cd generative-ai/gemini/sample-apps/gemini-streamlit-cloudrun
echo "google-cloud-logging" >> requirements.txt`
      },
      {
        filename: "chef.py (Complete Code)",
        language: "python",
        description: "The complete, working chef.py with Streamlit UI and parameterized Gemini prompt:",
        code: `import os
import streamlit as st
import vertexai
from vertexai.generative_models import GenerativeModel

# Setup Project and Model IDs
PROJECT_ID = os.environ.get("PROJECT") or os.environ.get("GOOGLE_CLOUD_PROJECT") or "YOUR_PROJECT_ID"
LOCATION = os.environ.get("REGION") or "us-central1"
MODEL_ID = "gemini-1.5-flash"

vertexai.init(project=PROJECT_ID, location=LOCATION)
model = GenerativeModel(MODEL_ID)

st.set_page_config(page_title="Cymbal Health AI Chef", page_icon="🍳", layout="wide")

st.title("🍳 Cymbal Health - AI Chef Recipe Recommender")
st.markdown("Reimagining nutrition and healthy living with Google Gemini & Streamlit.")

col1, col2 = st.columns(2)

with col1:
    cuisine = st.selectbox("Cuisine Preference", ["Japanese", "Italian", "Mexican", "Mediterranean", "Indian", "Thai", "American"])
    dietary_preference = st.selectbox("Dietary Preference", ["low sodium", "keto", "vegan", "vegetarian", "gluten-free", "diabetic-friendly"])
    allergy = st.selectbox("Food Allergy (to avoid)", ["peanuts", "shellfish", "dairy", "tree nuts", "soy", "gluten", "eggs", "none"])

with col2:
    st.subheader("Pantry Ingredients")
    ingredient_1 = st.text_input("Ingredient 1", "ahi tuna")
    ingredient_2 = st.text_input("Ingredient 2", "fresh ginger")
    ingredient_3 = st.text_input("Ingredient 3", "edamame")
    
    # Task 2 Wine Radio Button
    wine = st.radio("Wine Preference", ["Red", "White", "None"], index=0, horizontal=True)

if st.button("Generate Chef Recommendations", type="primary"):
    with st.spinner("Executive Chef Gemini is crafting your customized recipes..."):
        prompt = f"""I am a Chef.  I need to create {cuisine} \\n
recipes for customers who want {dietary_preference} meals. \\n
However, don't include recipes that use ingredients with the customer's {allergy} allergy. \\n
I have {ingredient_1}, \\n
{ingredient_2}, \\n
and {ingredient_3} \\n
in my kitchen and other ingredients. \\n
The customer's wine preference is {wine} \\n
Please provide some for meal recommendations.
For each recommendation include preparation instructions,
time to prepare
and the recipe title at the beginning of the response.
Then include the wine paring for each recommendation.
At the end of the recommendation provide the calories associated with the meal
and the nutritional facts.
"""
        response = model.generate_content(prompt)
        st.markdown("### 🍽️ Recipe Recommendations")
        st.markdown(response.text)`
      },
      {
        filename: "Upload chef.py to GCS Bucket",
        language: "bash",
        description: "Upload the modified chef.py file to your student lab bucket:",
        code: `# Replace with your lab's bucket name from the lab details page:
gcloud storage cp chef.py gs://$PROJECT-generative-ai/`
      }
    ],
    verificationTip: "Double check that the radio button options are exactly ['Red', 'White', 'None'] and that the f-string prompt formatting matches the lab requirements precisely."
  },
  {
    id: 3,
    title: "Task 3: Test the Streamlit application in Cloud Shell",
    shortDesc: "Create Python virtual environment, install requirements.txt, configure PROJECT and REGION environment variables, and run streamlit on port 8080.",
    instructions: [
      "In Cloud Shell, make sure you are in generative-ai/gemini/sample-apps/gemini-streamlit-cloudrun",
      "Create and activate a Python virtual environment.",
      "Install required packages from requirements.txt",
      "Set your PROJECT and REGION environment variables.",
      "Run the Streamlit application and test it via Cloud Shell Web Preview on port 8080."
    ],
    codeSnippets: [
      {
        filename: "Cloud Shell Testing Commands",
        language: "bash",
        description: "Setup virtualenv, install dependencies, and run Streamlit:",
        code: `python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export PROJECT=$(gcloud config get-value project)
export REGION=us-central1 # or your lab assigned region

streamlit run chef.py --server.port=8080 --server.address=0.0.0.0`
      }
    ],
    verificationTip: "Verify that the app loads and generates at least one recipe successfully without throwing Python exceptions before clicking Check My Progress."
  },
  {
    id: 4,
    title: "Task 4: Modify Dockerfile and Push Image to Artifact Registry",
    shortDesc: "Update Dockerfile to run chef.py, create Artifact Registry repository 'chef-repo', and submit build with Cloud Build.",
    instructions: [
      "Modify the Dockerfile in the current directory so that the CMD points to chef.py instead of app.py.",
      "Set the AR_REPO=chef-repo and SERVICE_NAME=chef-streamlit-app environment variables.",
      "Create the Docker Artifact Registry repository in your lab's region.",
      "Submit the container image build to Cloud Build with the Artifact Registry tag."
    ],
    codeSnippets: [
      {
        filename: "Dockerfile",
        language: "dockerfile",
        description: "Modified Dockerfile pointing to chef.py and port 8080:",
        code: `FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

EXPOSE 8080

ENTRYPOINT ["streamlit", "run", "chef.py", "--server.port=8080", "--server.address=0.0.0.0"]`
      },
      {
        filename: "Artifact Registry & Cloud Build (One-Liner)",
        language: "bash",
        description: "Create repository and submit Cloud Build (takes ~4-8 minutes):",
        code: `export AR_REPO=chef-repo
export SERVICE_NAME=chef-streamlit-app
export PROJECT=$(gcloud config get-value project)
export REGION=us-central1 # Use your lab assigned region

# Create Artifact Registry Repository
gcloud artifacts repositories create $AR_REPO \\
  --repository-format=Docker \\
  --location=$REGION \\
  --description="Cymbal Health Chef Streamlit App Repository"

# Submit Cloud Build
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT/$AR_REPO/$SERVICE_NAME"`
      }
    ],
    verificationTip: "Wait for the Cloud Build command to finish with STATUS: SUCCESS before checking your progress."
  },
  {
    id: 5,
    title: "Task 5: Deploy the application to Cloud Run and test",
    shortDesc: "Deploy the container image to Cloud Run with unauthenticated access, port 8080, and environment variables.",
    instructions: [
      "Run gcloud run deploy with the image created in Task 4.",
      "Specify port 8080, --allow-unauthenticated, and pass PROJECT and REGION environment variables.",
      "When prompted to enable required APIs, press 'Y'.",
      "Open the resulting Cloud Run Service URL in your browser and test a recipe generation."
    ],
    codeSnippets: [
      {
        filename: "Cloud Run Deployment Command",
        language: "bash",
        description: "Deploy container to Cloud Run managed platform:",
        code: `gcloud run deploy $SERVICE_NAME \\
  --port=8080 \\
  --image="$REGION-docker.pkg.dev/$PROJECT/$AR_REPO/$SERVICE_NAME" \\
  --allow-unauthenticated \\
  --region=$REGION \\
  --platform=managed \\
  --project=$PROJECT \\
  --set-env-vars=PROJECT=$PROJECT,REGION=$REGION`
      }
    ],
    verificationTip: "Once the deployment outputs the Service URL (e.g., https://chef-streamlit-app-xxx.a.run.app), visit it in your browser and test one recommendation before clicking Check My Progress for 100% score!"
  }
];
