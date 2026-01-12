from flask import Flask, request, render_template
from SPARQLWrapper import SPARQLWrapper, JSON
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")  # Load spaCy model
sparql = SPARQLWrapper("http://localhost:3030/ds/query")  # Jena Fuseki endpoint
sparql.setReturnFormat(JSON)

def generate_sparql_query(question):
    doc = nlp(question)
    store_name = None
    for ent in doc.ents:  # Extract entities (e.g., store names)
        store_name = ent.text
    
    if "owns" in question.lower() and store_name:
        query = f"""
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX : <http://example.org/ontology#>
        SELECT ?owner WHERE {{
            ?store rdf:type :Store .
            ?store :hasName "{store_name}" .
            ?store :hasOwner ?owner .
        }}
        """
        return query
    return None

@app.route("/", methods=["GET", "POST"])
def index():
    answer = None
    query = None
    if request.method == "POST":
        question = request.form["question"]
        query = generate_sparql_query(question)
        if query:
            sparql.setQuery(query)
            results = sparql.query().convert()
            bindings = results["results"]["bindings"]
            if bindings:
                answer = bindings[0]["owner"]["value"]
            else:
                answer = "No results found."
        else:
            answer = "Could not understand the question."
    return render_template("index.html", answer=answer, query=query)

if __name__ == "__main__":
    app.run(debug=True)