from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)
CORS(app)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if not installed (though requirements should handle it)
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

LIMITATION_KEYWORDS = [
    "future work", "limited dataset", "lack of research", 
    "small sample size", "further studies required", 
    "geographical limitation", "not generalizable",
    "limitation", "weakness", "restricted to", "small cohort"
]

@app.route('/extract-limitations', methods=['POST'])
def extract_limitations():
    data = request.json
    abstracts = data.get('abstracts', [])
    extracted_sentences = []

    for abstract in abstracts:
        doc = nlp(abstract)
        for sent in doc.sents:
            sentence_text = sent.text.lower()
            if any(kw in sentence_text for kw in LIMITATION_KEYWORDS):
                extracted_sentences.append(sent.text.strip())

    return jsonify({"limitations": list(set(extracted_sentences))})

@app.route('/cluster-topics', methods=['POST'])
def cluster_topics():
    data = request.json
    abstracts = data.get('abstracts', [])
    
    if len(abstracts) < 3:
        return jsonify({"clusters": [{"id": 0, "papers": abstracts, "topic": "General"}]})

    # Vectorize text
    vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
    X = vectorizer.fit_transform(abstracts)

    # Cluster
    n_clusters = min(len(abstracts), 3) # default to 3 clusters
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    kmeans.fit(X)

    # Group papers
    clusters = []
    terms = vectorizer.get_feature_names_out()
    order_centroids = kmeans.cluster_centers_.argsort()[:, ::-1]

    for i in range(n_clusters):
        # Get top words for the cluster as the "topic"
        topic_keywords = [terms[ind] for ind in order_centroids[i, :3]]
        
        cluster_papers = [abstracts[j] for j, label in enumerate(kmeans.labels_) if label == i]
        clusters.append({
            "id": i,
            "topic": ", ".join(topic_keywords),
            "count": len(cluster_papers),
            "is_potential_gap": len(cluster_papers) <= 2 # Mark small clusters as potential gaps
        })

    return jsonify({"clusters": clusters})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
