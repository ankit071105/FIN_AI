from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.feed import fetch_mock_news
from app.agents.graph import create_graph
import asyncio

scheduler = AsyncIOScheduler()
graph = create_graph()

async def poll_news():
    print("Polling for news...")
    news_items = fetch_mock_news(count=1)
    for item in news_items:
        print(f"Processing news: {item['headline']}")
        # Run the graph
        await graph.ainvoke({"news_item": item})

def start_scheduler():
    scheduler.add_job(poll_news, "interval", seconds=10)
    scheduler.start()
