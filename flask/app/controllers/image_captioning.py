from huggingface_hub import InferenceClient
from config import Config

hf_client = InferenceClient(model='Salesforce/blip-image-captioning-large', token=Config.HF_TOKEN)

def generate_caption(image_path):
    """Generates a caption for an uploaded image."""
    result = hf_client.image_to_text(image_path, model="Salesforce/blip-image-captioning-large")
    caption = result["generated_text"]
    return caption