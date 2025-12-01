from sentence_transformers import SentenceTransformer
from transformers import pipeline
from app.core.database import get_chroma_client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LocalRAG:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LocalRAG, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        logger.info("Loading Local RAG models... This might take a minute.")
        try:
            # Load embedding model (lightweight, ~80MB)
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Load generation model (flan-t5-base, ~1GB)
            # using device_map="auto" to use GPU if available, else CPU
            self.generation_pipeline = pipeline(
                'text2text-generation', 
                model='google/flan-t5-base',
                max_length=512
            )
            logger.info("Local RAG models loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            raise e

    def embed_text(self, text):
        # Returns a list of floats
        return self.embedding_model.encode(text).tolist()

    def store_news(self, news_item):
        try:
            client = get_chroma_client()
            collection = client.get_or_create_collection(name="news_embeddings")
            
            # Construct summary/blob
            text_blob = f"{news_item['headline']} - {news_item['source']}"
            if 'summary' in news_item and news_item['summary']:
                text_blob += f": {news_item['summary']}"
            
            # Generate embedding
            embedding = self.embed_text(text_blob)
            
            collection.add(
                ids=[news_item["id"]],
                embeddings=[embedding],
                metadatas=[{
                    "ticker": news_item["ticker"],
                    "headline": news_item["headline"],
                    "source": news_item["source"],
                    "timestamp": news_item["timestamp"]
                }],
                documents=[text_blob]
            )
            logger.info(f"Stored news item {news_item['id']} locally.")
        except Exception as e:
            logger.error(f"Error storing news locally: {e}")

    def answer_query(self, query):
        try:
            # Step 1: Retrieve
            query_embedding = self.embed_text(query)
            
            client = get_chroma_client()
            collection = client.get_collection("news_embeddings")
            
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=3
            )
            
            retrieved_docs = []
            if results['documents']:
                retrieved_docs = results['documents'][0]
            
            if not retrieved_docs:
                return "No relevant news found to answer your question."

            # Step 2: Contextualize
            context_str = "\n".join(retrieved_docs)
            
            # Step 3: Generate
            prompt = f"Answer the question based on the context.\n\nContext: {context_str}\n\nQuestion: {query}"
            
            # Generate response
            output = self.generation_pipeline(prompt)
            # output is a list of dicts: [{'generated_text': '...'}]
            answer_text = output[0]['generated_text']
            
            # Extract citations from metadata
            citations = []
            if results['metadatas'] and results['metadatas'][0]:
                for meta in results['metadatas'][0]:
                    citations.append({
                        "headline": meta.get("headline", "Unknown"),
                        "source": meta.get("source", "Unknown"),
                        "ticker": meta.get("ticker", "Unknown")
                    })

            return {
                "answer": answer_text,
                "citations": citations
            }
        except Exception as e:
            logger.error(f"Error answering query locally: {e}")
            return "I encountered an error processing your request locally."

# Create a global instance to be imported
local_rag_service = LocalRAG()
