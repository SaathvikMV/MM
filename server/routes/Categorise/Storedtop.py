import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Load saved model and tokenizer
model_directory = "./routes/Categorise/saved_model"
model_bert = BertForSequenceClassification.from_pretrained(model_directory)
tokenizer_bert = BertTokenizer.from_pretrained(model_directory)
category_dict = torch.load(f"{model_directory}/category_dict.pt")

# Function to get top categories for user input


def get_top_categories(input_text, top_n=3):
    input_sequence = tokenizer_bert.encode_plus(
        input_text, add_special_tokens=True, max_length=64, padding='max_length', truncation=True, return_tensors='pt')
    input_ids = input_sequence['input_ids']
    attention_mask = input_sequence['attention_mask']

    predicted_logits = model_bert(input_ids, attention_mask=attention_mask)[0]
    probabilities = torch.softmax(predicted_logits, dim=1).detach().numpy()[0]

    top_indices = probabilities.argsort()[-top_n:][::-1]
    top_categories = [(list(category_dict.keys())[i])
                      for i in top_indices]
    return top_categories

if __name__ == "__main__":
    import sys
    user_input = sys.argv[1]
    top_categories = get_top_categories(user_input, top_n=3)
    print(top_categories)
