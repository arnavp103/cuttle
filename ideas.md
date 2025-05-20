# Prompt

I am a fourth year undergraduate student studying statistics and computer science. I'm looking to build a data-science related project for my portfolio. Here are some of the technologies I'm interested in learning and using:
- Apache Airflow
- SQL (Snowflake, BigQuery)
- Python (Pandas, NumPy, Scikit-learn, Pytorch)
- Time Series Analytics and Databases
- NoSQL solutions (Cassandra, Neo4j)
- Apache Spark
- AWS (redshift, athena, glue, msk)
- Data visualization tools (D3.js, Plotly, Matplotlib, Looker, Teableau)
- ETL pipelines
- Apache Hadoop
- Dataiku
- Huggingface
- RAG systems
- dbt
Keeping these in mind can you suggest some project ideas using a few (1-3) of these core technologies. Go 10 at a time, along with a short description of an interesting use case for it and how it would work, as well as the technologies one would use to build it.


You don't need to number them. These are good. Try to be a bit more specific in terms of how a business or user would be able to accomplish something with this that they couldn't before. Can you suggest ten more?

# Ideas

⭐⭐ Multi-source ETL Pipeline
Core Tech: AWS (Glue, Redshift), Python, Airflow
Description: Build an end-to-end data pipeline that extracts data from multiple sources (APIs, databases, files), transforms it using AWS Glue and Python, loads it into Redshift, and orchestrates the entire process with Airflow. This demonstrates cloud-based ETL architecture for large datasets.
    IoT Sensor Data for Smart Cities
    Use Case: Monitor traffic, pollution, and energy consumption across different locations.
    Data Sources:
        APIs: OpenWeatherMap (weather data), city government APIs (traffic data).
        Toronto: https://secure.toronto.ca/nm/opendata.do
        Databases: Time-series database (TimescaleDB for IoT data).
        Files: CSV logs from sensors placed in different locations.
    Why It’s Valuable: Helps city planners optimize traffic signals, reduce pollution, and manage energy use efficiently.
    Demo: Visualize as a map. Different overlays for pollution, energy usage etc. One interesting overlay is transit. It'll show all the TTC stops and whether they were on time, early, or late. 

⭐⭐⭐ RAG-Based Search Engine for Research Papers
Use Case: Build a Retrieval-Augmented Generation (RAG) model to summarize research papers.
How It Works: Store vector embeddings in FAISS, retrieve relevant papers, and summarize them using Hugging Face models.
Technologies: Hugging Face, FAISS, Apache Spark.

⭐⭐ Healthcare Resource Allocation System
Core Tech: Time Series Analytics, Scikit-learn, Tableau
Description: Create a platform that helps hospitals optimize staffing and resource allocation. By analyzing patterns in patient admissions and resource utilization across different time periods, your models can predict demand spikes with greater accuracy than traditional scheduling approaches. Hospital administrators can use Tableau dashboards to visualize projected resource needs and test different allocation scenarios, reducing both wait times during peak periods and excessive staffing costs during slower periods.

1. RAG search engine (least data sciencey - more just putting an llm in front of everything)
2. ETL pipeline with toronto map (hardest)
3. Healthcare dashbooard (easiest)

1. RAG-Based Search Engine for Research Papers (Most unique)
2. ETL (most data) 